var vows = require('vows').describe('Server should return right client config')
	, assert = require('assert')
	, request = require('request')
	, siteConf = require('../siteConfig')
	, app = require('../server')
	, loader = require('./helper/loader')
	, i18n = require('i18n')
	, i
	, sid = null;

loader.setupVows(app, vows);

function getBatch (locale)
{
	var res = {};

	res['client config for ' + locale + ' locale'] = {
		topic: function ()
		{
			var jar = request.jar()
				, cookie = request.cookie("lang=" + locale);

			jar.add(cookie)
			request(
			{
				url: 'http://localhost:' + siteConf.port + '/client-config.json'
				, jar: jar
			}, this.callback);
		},
		'config': function (err, res, body)
		{
			var res = JSON.parse(body)
				, expected
				, i;

			assert.isNull(err);
			i18n.setLocale(locale);

			expected = {
				'edit-title': i18n.__('edit-title')
				, 'edit-content': i18n.__('edit-content')
				, 'fail-loc-title': i18n.__('fail-loc-title')
				, 'fail-loc-content': i18n.__('fail-loc-content')
				, 'sec': i18n.__('sec')
				, 'min': i18n.__('min')
				, 'hour': i18n.__('hour')
				, 'day': i18n.__('day')
				, 'month': i18n.__('month')
				, 'year': i18n.__('year')
				, 'invalidMessage': i18n.__('post-mess-val-err')
				, 'invalidTags': i18n.__('post-tags-val-err')
				, 'postsWaitingTime': siteConf.postsWaitingTime
			}

			for (i in expected) {
				assert.equal(res[i], expected[i])
			}
		}
	};

	return res;
}

for (i = 0; i < siteConf.langs.length; ++i) {
	vows.addBatch(getBatch(siteConf.langs[i]))
}

vows.exportTo(module);