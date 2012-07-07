$(document).ready(function ()
{
	var socket = io.connect(window.location.protocol + '//' + window.location.host)

	window.getSocket = function () // in future it will be in separate file
	{
		return socket;
	}

	socket.on('connect', function ()
	{
		socket.emit('sid', {
			sid: $.cookie('connect.sid')
		});
	})

	socket.on('ready', function ()
	{
		PostController.trigger('socketReady');
	});

	socket.on('disconnect', function ()
	{
		PostController.trigger('socketDisconnect');
	})

	socket.on('getPost', function (data)
	{
		PostController.trigger('getPost', data);
	});
})
