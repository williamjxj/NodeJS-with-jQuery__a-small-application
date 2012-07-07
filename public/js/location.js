function getLocationText (pos, cb)
{
	var geocoder;

	$.cookie('sessionStarted', null)

	geocoder = new google.maps.Geocoder();

	geocoder.geocode( { address: pos.lat() + ' ' + pos.lng() }, function (results, status)
	{
		if (status == google.maps.GeocoderStatus.OK) {
			cb(pos, results[0].formatted_address);
		} else {
			cb(pos, null);
		}
	})
}

function getLocation (cb)
{
	var lat = parseFloat($.cookie('lat'))
		, long = parseFloat($.cookie('long'))
		, etimeout
		, isOnError = false
		, waitingTime = 15000;

	if ($.cookie('sessionStarted') !== 'true') {
		cbSuc(new google.maps.LatLng(lat, long));

		return;
	}

	function cbSuc (pos)
	{
		getLocationText(pos, cb);
	}

	function getGeoLocationByRequest ()
	{
		var geocoder;

		if (typeof geoip_latitude === 'function' && typeof geoip_longitude === 'function') {
			cbSuc(new google.maps.LatLng(geoip_latitude(), geoip_longitude()));
		} else {
			cb(null, null)
		}
	}

	function onError ()
	{
		clearTimeout(etimeout);
		isOnError = true;
		getGeoLocationByRequest();
	}

	if (typeof navigator.geolocation !== 'undefined') {
		etimeout = setTimeout(onError, waitingTime);

		navigator.geolocation.getCurrentPosition(function(position)
		{
			clearTimeout(etimeout);

			if (isOnError) { // it's too late

				return;
			}

			cbSuc(new google.maps.LatLng(position.coords.latitude, position.coords.longitude))
		}, onError,
		{
			timeout: waitingTime - 2000
		});
	} else {
		getGeoLocationByRequest();
	}
}
