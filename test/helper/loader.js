var assert = require('assert')
	, events = require('events')
	, siteConf = require('../../siteConfig')
	, inProgress = false
	, fixtureLoader = require('../../lib/mongoose-feaxture')
	, fixtures = require('../fixtures');

module.exports.setupVows = function (app, vows)
{
	if (inProgress) {

		return;
	}

	inProgress = true;

	vows.addBatch({
		'before testing':
		{
			topic: function ()
			{
				var promise = new events.EventEmitter();

				app.start(siteConf.port, siteConf.mongohq_url_fixt, function (err)
				{
					if (err) {
						promise.emit('error', err);

						return;
					}

					fixtureLoader.load(fixtures, function (err)
					{
						if (err) {
							promise.emit('error', err);

							return;
						}

						promise.emit('success');
					});
				});

				return promise;
			}
			, 'fixtures should be loaded': function (err)
			{
				assert.isUndefined(err);
			}
		}
	});
}