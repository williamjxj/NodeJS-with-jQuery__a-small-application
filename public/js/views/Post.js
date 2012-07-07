var PostView = Backbone.View.extend({
	template: _.template($('#postitemtmpl').html())
	, tagName: 'div'
	, initialize: function (data)
	{
		var me = this;

		this.marker = new google.maps.Marker({
			icon: '/img/post_marker.png'
			, position: new google.maps.LatLng(data.lat, data.long)
		});

		this.$el = $(this.template(data));

		$('#stream-container').prepend(this.$el);

		this.$el.on('mouseenter', function ()
		{
			me.marker.setAnimation(google.maps.Animation.BOUNCE);
		});

		this.$el.on('mouseleave', function ()
		{
			me.marker.setAnimation(null);
		});

		this.infoWindow = new google.maps.InfoWindow({
			content: this.$el.html()
		});

		google.maps.event.addListener(this.marker, 'click', function ()
		{
			me.infoWindow.open(me.marker.getMap(), me.marker);
		});

		MainMapController.trigger('newMarker', this.marker);
	}
	, hide: function ()
	{
		this.$el.hide();
	}
	, show: function (data)
	{
		$('#stream-container').prepend(this.$el);
		this.$el.html(this.template(data));
		this.$el.show();
	}
	, remove: function ()
	{
		this.$el.remove();

		this.marker.setMap(null);

		delete this.marker;
	}
});