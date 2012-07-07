var mongoose = require('mongoose')
	, PostModel = mongoose.model('Post')
	, User = mongoose.model('User')
	, siteConf = require('../../siteConfig')
	, curUser = null;

User.findOne({
	username: 'Enjeru'
}, function (err, doc)
{
	var instance;

	if (err) {
		console.log('error for getting user');
		console.log(err);
		return;
	}

	if (doc) {
		curUser = doc;
		return;
	}

	instance = new User({
		username: 'Enjeru'
		, first_name: 'Slava'
		, middle_name: 'Endspiel'
		, last_name: 'Muteki'
		, gender: 'male'
		, locale: 'ua'
		, timezone: 2
		, created_time: new Date()
		, updated_time: new Date()
		, birthday: new Date()
		, email: 'nikolaenko@qarea.com'
		, picture: ''
	});

	instance.save(function (err)
	{
		if (err) {
			console.log('error on instance save');
			console.log(err);
			Session
			return;
		}

		curUser = instance;
	})
});

function getUserFromRequest (req)
{
	return curUser;
}

function getSign (n) {
	return n < 0 ? -1 : 1;
}

exports.getPosts = function (req, res)
{
	var data = {
			minLat: parseFloat(req.params.minLat)
			, maxLat: parseFloat(req.params.maxLat)
			, minLong: parseFloat(req.params.minLong)
			, maxLong: parseFloat(req.params.maxLong)
		}
		, where = '(this.lat > ' + data.minLat + ' && this.lat < ' + data.maxLat + ') && (this.long > ' +
			data.minLong + ' ' + (data.maxLong > data.minLong ? '&&' : '||') + ' this.long < ' + data.maxLong + ')';

	PostModel.$where(where).sort('updated_time', -1).limit(siteConf.streamLength).populate('_user').exec(function (err, posts)
	{
		console.log('here !!!!');
		var result = [];

		if (err) {
			console.log('error when I tried to get last posts');
			console.log(err);

			res.send(JSON.stringify(result));

			return;
		}

		posts.map(function (el)
		{
			result.push({
				_id: el._id
				, message: el.message
				, tags: el.tags
				, userName: el._user.username
				, time: el.updated_time.getTime()
				, positionText: el.place_text
				, lat: el.lat
				, long: el.long
			})
		});

		res.send(JSON.stringify(result));
	});
}

exports.create = function (req, res)
{
	var data = req.body;

	if (data.message.length === 0) {
		res.send(JSON.stringify({
			success: false
		}));

		return;
	}

	var tags = data.tags.split(/[^a-zA-Z0-9а-яА-Я]+/)
		, new_post = new PostModel({
			message: data.message
			, special: !!data.special || false
			, lat: data.lat
			, long:data.long
			, place_text: data.locationname
			, _user: getUserFromRequest(req)._id
			, created_time: new Date()
			, updated_time: new Date()
		})
		, i;

	for (i = 0; i < tags.length; ++i) {
		if (tags[i].length !== 0) {
			tags[i] = tags[i].toLowerCase();
			tags[i] = tags[i][0].toUpperCase() + tags[i].substr(1);

			new_post.tags.push(tags[i]);
		}
	}

	if (new_post.tags.length === 0) {
		res.send(JSON.stringify({
			success: false
		}));

		return;
	}

	new_post.save(function (err)
	{
		if (err) {
			console.log('error on post saving');
			console.log(err);

			res.send(JSON.stringify({
				success: false
			}));

			return;
		}

		res.send(JSON.stringify({
			success: true
		}));
	});
}
