var	conf = require('../../siteConfig')
	, mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var posts = new Schema({
	_user: { type: ObjectId, ref: 'User'}
	, message: String
	, place_text: String
	, tags: [ String ]
	, special: Boolean
	, lat: Number
	, long: Number
	, created_time: Date
	, updated_time: Date
});

var PostModel = mongoose.model('Post', posts);

exports.PostsSchema = posts;
