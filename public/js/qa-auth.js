$(document).ready(function ()
{
	$('#auth').click(function ()
	{
		var form = $('#form')
			, username = form.find('[name="username"]').val()
			, pass = form.find('[name="pass"]').val();

		$.cookie('username', username, {
			expires: 365
		});

		$.cookie('pass', pass, {
			expires: 365
		});

		window.location.reload();

		return false;
	});

	$(document).keydown(function (e)
	{
		if (e.keyCode === 13) {
			$('#auth').click();
		}
	})
})