var clientConfig = {};

$.ajax({
	url: 'client-config.json',
	async: false,
	success: function (arg, success, response)
	{
		clientConfig = $.parseJSON(response.responseText);
	}
});

<<<<<<< HEAD
	centered(modalLoading).modal('show');
	centered($('#post-success-modal'));

	var socket = io.connect(window.location.protocol + '//' + window.location.host)

	/*$.ajax({
	$.ajax({
		url: 'client-config.json',
		async: false,
		success: function (arg, success, response)
		{
			clientConfig = $.parseJSON(response.responseText);
		}
	});*/

	var myOptions = {
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		, map
		, zoom = $.cookie('zoom')
		, marker = new google.maps.Marker({
			icon: 'img/me_marker.png',
			draggable: true
		})
		, autocomplete = new google.maps.places.Autocomplete($('#locationnameinput')[0])
		, lang = $.cookie('lang') || navigator.language || navigator.userLanguage
		, postMap
		, postMarker = new google.maps.Marker({
			icon: 'img/pin-marker.png',
			draggable: true
		})
		, postAutoComplete = new google.maps.places.Autocomplete($('#post-loc-input')[0])
		, isBoundsGot = false;

	google.maps.event.addListener(autocomplete, 'place_changed', function ()
	{
		var place = autocomplete.getPlace()
			, new_place = place.formatted_address
			, link = $('#locationnamelink');

		link.text(new_place);

		$('#locationnameinput').hide();
		link.show();

		setLocationPos(place.geometry.location);
		setLocationText(new_place);
	});

	google.maps.event.addListener(postAutoComplete, 'place_changed', function ()
	{
		var place = postAutoComplete.getPlace()
		, new_place = place.formatted_address
		, link = $('#post-loc');

		link.text(new_place);

		$('#post-loc-input').hide();
		link.show();

		postMarker.setPosition(place.geometry.location);
		postMap.setCenter(place.geometry.location);
	});

	zoom = zoom === null ? 12 : parseInt(zoom, 10);
	myOptions.zoom = zoom;
=======
function centered (element)
{
	element.css({
		'margin-top': (-element.height()  / 2) + 'px'
		, 'margin-left': (-element.width()  / 2) + 'px'
	})
>>>>>>> d5d849101db58075ae0f4aff544b37f6fc5b5dbe

	return element;
}

$(document).ready(function ()
{
    var lang = $.cookie('lang') || navigator.language || navigator.userLanguage
		, modalLoading = $('#loading-modal');

    centered(modalLoading).modal('show');
    centered($('#post-success-modal'));

	$('#post-news').click(function ()
	{
		PostController.trigger('postNewClick', {
			el: $(this)
		});
	});

	$.validator.addMethod("filled", function(value, el) {
		return value.replace(/[^a-zA-Z0-9а-яА-Я]/, '').length !== 0;
	});

	$('#new-post-modal .modal-body form').validate({
		rules: {
			message: "filled"
			, tags: "filled"
		},
		messages: {
			message: clientConfig.invalidMessage
			, tags: clientConfig.invalidTags
		},
		errorClass: "help-inline",
		errorElement: "span",
		highlight:function(el, errorClass, validClass) {
			$(el).parents('.control-group').addClass('error');
			$(el).parent('.control-group').removeClass('success');
		},
		unhighlight: function(el, errorClass, validClass) {
			$(el).parents('.control-group').removeClass('error');
			$(el).parents('.control-group').addClass('success');
		}
	});

	$('#new-post-modal').modal({
		keyboard: false,
		show: false
	}).on('show', function ()
	{
		PostController.trigger('newPostModalShow', {
			el: $(this)
		});
	});

    $('.hide-alert').click(function ()
    {
        $(this).parent('.alert').hide();

        return false;
    });

	$('#post-success-modal').on('hide', function ()
	{
		PostController.trigger('postSuccessModalHide', {
			el: $(this)
		});
	});

    $('.langli').click(function ()
    {
        var newLang = $(this).attr('lang');

        if (newLang === $.cookie('lang')) {

            return;
        }

        $('#langlink span').text(newLang);
        $('#langlink img').attr('src', 'img/' + newLang + '.png');

        $.cookie('lang', newLang, {
            expires: 365
        });

        window.location.reload();
    });
});
