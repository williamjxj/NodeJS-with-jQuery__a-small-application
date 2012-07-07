var vows = require('vows').describe('Main page must return status 200 Ok')
	, assert = require('assert')
	, request = require('request')
	, siteConf = require('../siteConfig')
	, app = require('../server')
	, loader = require('./helper/loader');

loader.setupVows(app, vows);

vows.addBatch({
	'request must return status 200 OK': {
		topic: function ()
		{
			request('http://localhost:' + siteConf.port + '/', this.callback);
		},
		'request': function (err, res)
		{
			assert.isNull(err);
			assert.equal(res.statusCode, 200);
		}
	}
}).exportTo(module);