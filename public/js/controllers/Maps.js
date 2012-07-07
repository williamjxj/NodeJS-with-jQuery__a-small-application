var MapsController = {
	initMap: function (data)
	{
		var map = new google.maps.Map(document.getElementById(data.mapContainerId), data.mapOptions)
			, marker = new google.maps.Marker({
				icon: data.iconUrl
				, draggable: true
				, position: data.mapOptions.center
				, map: map
			})
			, model = new MapModel({
				map: map
				, marker: marker
			})
			, view = new MapView({
				model: model
				, linkContainerSelector: data.linkContSelector
			})
			, autocomplete = new google.maps.places.Autocomplete(view.input[0]);

		view.link.click(function ()
		{
			view.link.hide();
			view.input.show();
			view.input.val(view.link.text());
			view.input.focus();
			view.input.select();
		});

		view.input.blur(function ()
		{
			view.input.hide();
			view.link.show();
		}).keydown(function (e)
		{
			if (e.keyCode === 27) {
				view.input.trigger('blur')
			}
		});

		google.maps.event.addListener(autocomplete, 'place_changed', function ()
		{
			var place = autocomplete.getPlace()
				, new_place = place.formatted_address || view.input.val()
				, link = view.link
				, geocoder;

			link.text(new_place);

			view.input.hide();
			link.show();

			if (location.geometry) {
				MapsController.trigger('changePos', {
					map: map
					, marker: marker
					, pos: place.geometry.location
				});

				MapsController.trigger('changeText', {
					link: view.link
					, text: new_place
				});
			} else {
				geocoder = new google.maps.Geocoder();
				geocoder.geocode( { address: new_place }, function (results, status)
				{
					if (status == google.maps.GeocoderStatus.OK) {
						MapsController.trigger('changePos', {
							map: map
							, marker: marker
							, pos: results[0].geometry.location
						});

						MapsController.trigger('changeText', {
							link: view.link
							, text: new_place
						});
					}
				})
			}
		});

		google.maps.event.addListener(marker, 'dragend', function (e)
		{
			var geocoder = new google.maps.Geocoder();

			geocoder.geocode( { address: e.latLng.lat() + ' ' + e.latLng.lng() }, function (results, status)
			{
				if (status == google.maps.GeocoderStatus.OK) {
					MapsController.trigger('changePos', {
						map: map
						, marker: marker
						, pos: results[0].geometry.location
					});

					MapsController.trigger('changeText', {
						link: view.link
						, text: results[0].formatted_address
					});
				}
			});
		});

		return {
			map: map
			, marker: marker
			, view: view
			, model: model
			, autocomplete: autocomplete
		};
	}
};

_.extend(MapsController, Backbone.Events)

MapsController.on('changePos', function (data)
{
	data.map.setCenter(data.pos);
	data.marker.setPosition(data.pos);
});

MapsController.on('changeText', function (data)
{
	data.link.text(data.text);
});