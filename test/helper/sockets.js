var io = require('socket.io-client')
	, sockets = {}
	, request = require('request')
	, getSocket;

function getCookies (cookies)
{
	var res = {}
		, i;

	for (i = 0; i < cookies.length; ++i) {
		cookies[i] = cookies[i].split('=');
		res[cookies[i][0]] = cookies[i][1].split(';')[0];
	}

	return res;
}

function initSocket(url, sid)
{
	var socketObj = sockets[url];

	socketObj.socket = io.connect(url);

	socketObj.socket.on('connect', function ()
	{
		socketObj.socket.emit('sid', {
			sid: sid
		})
	});

	socketObj.socket.on('ready', function ()
	{
		socketObj.socketReady = true;

		socketObj.cbStack.map(function (el)
		{
			el(socketObj.socket);
		})
	})
}

getSocket = exports.getSocket = function (url, cb)
{
	var socketObj = sockets[url];

	if (typeof socketObj === 'undefined') {
		socketObj = {
			socket: null
			, cbStack: [cb]
			, socketReady: false
		}

		sockets[url] = socketObj;

		request(url, function (err, res)
		{
			var sid = getCookies(res.headers['set-cookie'])['connect.sid'];

			initSocket(url, sid);
		})

		return;
	}

	if (socketObj.socketReady) {
		cb(socketObj.socket);

		return;
	}

	if (socketObj.socket) {
		socketObj.cbStack.push(cb);

		return;
	}
}