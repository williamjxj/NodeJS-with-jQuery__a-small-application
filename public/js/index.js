var clientConfig = {};

$.ajax({
	url: 'client-config.json',
	async: false,
	success: function (arg, success, response)
	{
		clientConfig = $.parseJSON(response.responseText);
	}
});

function analyzeTime (time)
{
	var type = clientConfig.year
		, timeConf = [
			{
				text: ''
				, val: 1000
			},
			{
				text: clientConfig.sec
				, val: 60
			},
			{
				text: clientConfig.min
				, val: 60
			},
			{
				text: clientConfig.hour
				, val: 24
			},
			{
				text: clientConfig.day
				, val: 31
			},
			{
				text: clientConfig.month
				, val: 12
			}
		]
		, i;

	for (i = 0; i < timeConf.length - 1; ++i) {
		time /= timeConf[i].val;
		time >>= 0; // fast floor

		if (time < timeConf[i + 1].val) {
			type = timeConf[i + 1].text;

			break;
		}
	}

	return time + '&nbsp;' + type;
}

function centered (element)
{
	element.css({
		'margin-top': (-element.height()  / 2) + 'px'
		, 'margin-left': (-element.width()  / 2) + 'px'
	})

	return element;
}
$(document).ready(function ()
{
	var lang = $.cookie('lang') || navigator.language || navigator.userLanguage
		, modalLoading = $('#loading-modal');

	centered(modalLoading).modal('show');
	centered($('#post-success-modal'));

	$.validator.addMethod("filled", function(value, el) {
		return value.replace(/[^a-zA-Z0-9а-яА-Я]/, '').length !== 0;
	});

	$('#new-post-modal .modal-body form').ajaxForm().validate({
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

	$('#post-news').click(function ()
	{
		PostController.trigger('postNewClick')
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
	})
});
