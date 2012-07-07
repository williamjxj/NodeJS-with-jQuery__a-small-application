var PostController = {
};

_.extend(PostController, Backbone.Events);

(function ()
{
	var postSuccessTime = 4000
		, postSuccessTimeout
		, lastBounds
		, boundsTimeout
		, postMapObject = false
		, socketReady
		, posts = {};

	function getPosts ()
	{
		var coords
			, data = {}
			, el;

		coords = lastBounds.getNorthEast();

		if (! MainMapController.isAllMapOnScreen()) {
			data.maxLat = coords.lat();
			data.maxLong = coords.lng();

			coords = lastBounds.getSouthWest();

			data.minLat = coords.lat();
			data.minLong = coords.lng();
		} else {
			data.maxLat = coords.lat();
			data.maxLong = 180;

			coords = lastBounds.getSouthWest();

			data.minLat = coords.lat();
			data.minLong = -180;
		}

		while(postsCollection.length !== 0) {
			el = postsCollection.at(0);
			postsCollection.remove(el);
			el.destroy()
		}

		getPostsFromServer(data);

		$('#empty-posts').hide();
		$('#post-stream-load').show();
	}

	function getPostsFromServer (data)
	{
		clearTimeout(boundsTimeout);
		$.ajax({
			url: '/posts/' + data.minLat + '/' + data.maxLat + '/' + data.minLong + '/' + data.maxLong + '.' // dirty hack, because express-resource part afeter '.' moved to req.format
			, method: 'GET'
			, success: function (data)
			{
				data = $.parseJSON(data);

				var i
					, postsIds = {};

				if (data.length === 0) {
					PostController.trigger('noPosts');

					return;
				}

				for (i = data.length - 1; i > -1; --i) {
					PostController.trigger('getPost', data[i]);
					postsIds[data[i]._id] = true;
				}

				PostController.trigger('updatePosts', postsIds);
			}
		})
	}

	PostController.on('updatePosts', function (postsIds)
	{
		var i;

		for (i in posts) {
			if (! postsIds[i]) {
				posts[i].remove();
				delete posts[i];
			}
		}
	});

	PostController.on('socketDisconnect', function ()
	{
		socketReady = false;
	});

	PostController.on('boundsChanged', function (bounds)
	{
		clearTimeout(boundsTimeout);

		lastBounds = bounds;

		boundsTimeout = setTimeout(getPosts, clientConfig.postsWaitingTime)
	});

	PostController.on('boundsReady', function(bounds)
	{
		lastBounds = bounds;

		getPosts();
	});

	PostController.on('getPost', function (data)
	{
		$('#post-stream-load').hide();
		$('#empty-posts').hide();
		data.time = analyzeTime((new Date()).getTime() - data.time)

		var newPost = new PostModel(data)
			, view;

		postsCollection.add(newPost);

		if (posts[data._id]) {
			view = posts[data._id];
			view.show(newPost.attributes);
		} else {
			view = new PostView(newPost.attributes);
			posts[data._id] = view
		}

		newPost.on('destroy', function ()
		{
			view.hide();
		})
	});

	PostController.on('postSuc', function ()
	{
		$('#new-post-modal').modal('hide');
		$('#post-success-modal').modal('show');

		postSuccessTimeout = setTimeout(function ()
		{
			$('#post-success-modal').modal('hide');
		}, postSuccessTime);
	});

	PostController.on('postErr', function (data)
	{
		var modal = $('#new-post-modal');

		modal.find('.error-mess').show();
		modal.find('.success-mess').hide();
	});

	PostController.on('noPosts', function ()
	{
		$('#post-stream-load').hide();
		$('#empty-posts').show();
	});

	PostController.on('postNewClick', function ()
	{
		var form = $('#new-post-modal .modal-body form')
			, position;

		if (! form.valid()) {

			return;
		}

		position = postMapObject.marker.getPosition();

		form.find('[name="lat"]').val(position.lat());
		form.find('[name="long"]').val(position.lng());
		form.find('[name="locationname"]').val(postMapObject.view.link.text());

		form.ajaxSubmit(function (data)
		{
			data = $.parseJSON(data);

			PostController.trigger('newPostSent', data)
		});
	});

	PostController.on('newPostSent', function (data)
	{
		if (data.success) {
			PostController.trigger('postSuc')
		} else {
			PostController.trigger('postErr')
		}
	})

	PostController.on('newPostModalShow', function (data)
	{
		data.el.css('display', 'block'); // display is none and google maps doesn't get correct width and height
		data.el.find('.success-mess').show()
		data.el.find('.error-mess').hide()
		var lat = parseFloat($.cookie('lat'))
			, long = parseFloat($.cookie('long'))
			, pos
			, zoom = parseInt($.cookie('zoom'), 10);

		$('#new-post-modal .modal-body form [name="message"]').focus();

		if (isNaN(lat) || isNaN(long)) {

			return;
		}

		if (! postMapObject) {
			postMapObject = MapsController.initMap({
				mapOptions: {
					mapTypeId: google.maps.MapTypeId.ROADMAP
					, zoomControlOptions: {
						style: google.maps.ZoomControlStyle.SMALL
					}
					, streetViewControl: false
					, mapTypeControl: false
				}
				, iconUrl: 'img/pin-marker.png'
				, mapContainerId: 'new-post-map'
				, linkContSelector: '#new-post-modal .modal-footer'
			});
		}

		postMapObject.map.setZoom(isNaN(zoom) ? 12 : zoom);
		postMapObject.view.link.text($.cookie('locationname'))
		pos = new google.maps.LatLng(lat, long);

		MapsController.trigger('changePos', {
			map: postMapObject.map
			, marker: postMapObject.marker
			, pos: pos
		});

		MapsController.trigger('changeText', {
			link: postMapObject.view.link
			, text:$.cookie('locationname')
		})
	});

	PostController.on('postSuccessModalHide', function ()
	{
		clearTimeout(postSuccessTimeout);
	});
})();