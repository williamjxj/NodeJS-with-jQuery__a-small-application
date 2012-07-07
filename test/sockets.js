var vows = require('vows').describe('Post tests')
	, assert = require('assert')
	, siteConf = require('../siteConfig')
	, app = require('../server')
	, loader = require('./helper/loader')
	, events = require('events')
	, request = require('request')
	, sockets = require('./helper/sockets');

loader.setupVows(app, vows);

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

vows.addBatch({
	'server must return limitted post counts if he have more posts': {
		topic: function ()
		{
			var promise = new events.EventEmitter();

			sockets.getSocket('http://localhost:' + siteConf.port + '/', function (socket)
			{
				var n = 0;

				socket.emit('getLastPosts', {
					minLat: 0
					, maxLat: 100
					, minLong: 0
					, maxLong: 100
				});

				socket.on('getPost', function ()
				{
					++n;
				});

				var timeout = setTimeout(function ()
				{
					assert.equal(n, siteConf.streamLength);

					promise.emit('success');
				}, 2000)
			});

			return promise;
		}
		, check: function (err)
		{
			assert.isUndefined(err)
		}
	}
}).addBatch({
	'server must emit "noPost" event if db does not have posts': {
		topic: function ()
		{
			var promise = new events.EventEmitter()
				, succ = false;

			sockets.getSocket('http://localhost:' + siteConf.port + '/', function (socket)
			{
				var timeout
					, n = 0;

				socket.emit('getLastPosts', {
					minLat: 0
					, maxLat: 1
					, minLong: 0
					, maxLong: 1
				});

				socket.on('noPosts', function ()
				{
					succ = true;
				});

				timeout = setTimeout(function ()
				{
					assert.equal(n, 0);
					assert.equal(succ, true);

					promise.emit('success');
				}, 2000)
			});

			return promise;
		}
		, check: function (err)
		{
			assert.isUndefined(err)
		}
	}
}).exportTo(module)