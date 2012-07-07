var MainMapController = {
	isAllMapOnScreen: function ()
	{
		var mapTextureSize = 256
			, mapWidth = $('#map_canvas').width()
			, result = mapTextureSize * Math.pow(2, this.map.getZoom());

		return result < mapWidth + 1;
	}
}

_.extend(MainMapController, Backbone.Events);

MainMapController.on('newMarker', function (marker)
{
	marker.setMap(this.map);
});

MainMapController.on('mapReady', function (data)
{
	this.map = data.map;
});

$(document).ready(function ()
{
	var isBoundsGot = false;

	getLocation(function (pos, text)
	{
		$('#loading-modal').modal('hide');

		var zoom = parseInt($.cookie('zoom'), 10)
			, mainOptions = {
				mapTypeId: google.maps.MapTypeId.ROADMAP
				, center: pos
			}
			, mainResult;

		if (isNaN(zoom)) {
			zoom = 12;
		}

		mainOptions.zoom = zoom;

		mainResult = MapsController.initMap({
			mapOptions: mainOptions
			, iconUrl: 'img/me_marker.png'
			, mapContainerId: 'map_canvas'
			, linkContSelector: '#main-loc-link'
		});

		MainMapController.trigger('mapReady', mainResult)

		$('#homebtn').click(function ()
		{
			mainResult.map.setCenter(mainResult.marker.getPosition());

			return false;
		})

		if (typeof text !== 'undefined' && text !== null) {
			mainResult.view.link.text(text);

			$.cookie('locationname', text, {
				expires: 365
			})
		}

		if (pos === null) {
			mainResult.view.link.popover({
				title: clientConfig['fail-loc-title'],
				content: clientConfig['fail-loc-content'],
				trigger: 'manual'
			}).popover('show');

			setTimeout(function ()
			{
				mainResult.view.link.popover('hide').removeData('popover');
				setPopoverSuccess();
			}, 8000);

			return;
		}

		$.cookie('lat', pos.lat(), {
			expires: 365
		});
		$.cookie('long', pos.lng(), {
			expires: 365
		});

		setPopoverSuccess();

		function setPopoverSuccess ()
		{
			mainResult.view.link.popover({
				title: clientConfig['edit-title'],
				content: clientConfig['edit-content']
			})
		}

		google.maps.event.addListener(mainResult.autocomplete, 'place_changed', function ()
		{
			var geocoder = new google.maps.Geocoder()
				, place = mainResult.autocomplete.getPlace()
				, newPlace = place.formatted_address || mainResult.view.input.val();

			$.cookie('locationname', newPlace, {
				expires: 365
			});

			function callback (newPos, newText)
			{
				MapsController.trigger('changeText', {
					text: newText
					, link: mainResult.view.link
				});

				MapsController.trigger('changePos', {
					map: mainResult.map
					, marker: mainResult.marker
					, pos: newPos
				});

				$.cookie('locationname', newText);

				$.cookie('lat', newPos.lat(), {
					expires: 365
				});
				$.cookie('long', newPos.lng(), {
					expires: 365
				});
			}

			if (typeof place.geometry === 'undefined') {
				geocoder.geocode({address: newPlace}, function(results, status)
				{
					if (status == google.maps.GeocoderStatus.OK) {
						callback(new google.maps.LatLng(results[0].geometry.location.lat(),
							results[0].geometry.location.lng()), results[0].formatted_address)
					}
				});
			} else {
				callback(new google.maps.LatLng(place.geometry.location.lat(),
					place.geometry.location.lng()), newPlace)
			}
		});

		google.maps.event.addListener(mainResult.marker, 'dragend', function ()
		{
			var loc = mainResult.marker.getPosition()
				, lat = loc.lat()
				, long = loc.lng()
				, geocoder = new google.maps.Geocoder();
			;

			geocoder.geocode( { address: lat + ' ' + long }, function (results, status)
			{
				if (status == google.maps.GeocoderStatus.OK) {
					$.cookie('locationname', results[0].formatted_address);

					$.cookie('lat', results[0].geometry.location.lat(), {
						expires: 365
					});
					$.cookie('long', results[0].geometry.location.lng(), {
						expires: 365
					});
				}
			})
		});

		function getPosts()
		{
			var bounds = mainResult.map.getBounds()
				, interval;

			function boundsReady (bound)
			{
				PostController.trigger("boundsReady", bound)
			}

			if (typeof bounds === 'undefined') {
				interval = setInterval(function ()
				{
					var bound = mainResult.map.getBounds();

					if (typeof bound !== 'undefined') {
						clearInterval(interval);

						boundsReady(bound);
					}
				}, 12)
			} else {
				boundsReady(bounds);
			}
		}

		getPosts();

		google.maps.event.addListener(mainResult.map, 'zoom_changed', function (e)
		{
			$.cookie('zoom', mainResult.map.getZoom(), {
				expires: 365
			});
		});

		google.maps.event.addListener(mainResult.map, 'bounds_changed', function (e)
		{
			if (! isBoundsGot) {
				isBoundsGot = true;

				return;
			}

			PostController.trigger('boundsChanged', mainResult.map.getBounds());
		})
	});
})