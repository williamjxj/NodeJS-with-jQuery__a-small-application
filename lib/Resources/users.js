var mongoose = require('mongoose')
	, userModel = mongoose.model('User')
	, pmUser = require('../Models/createProfile').pmUser
	, users = new pmUser()
	, pmUser1 = require('../Models/updateProfile').pmUser
	, UserProvider = new pmUser1()
	, comm = require('../common');

exports.create = function (req, res)
{
	// console.log(req.body);
	// req.body.username = req.body.firstname + ' ' + req.body.lastname;
	//users.findOrCreateUserByPeoplemeltData(req.body);

    users.findOrCreateUserByPeoplemeltData(req.body, function(err, doc){
        if(err) { throw err; }
        if(doc) {
            req.session.doc = doc;
        }
        res.render('index');
    });

	// res.render('index');
	// I think we could use jQuery ajaxForm plugin to sendform post data via ajax
	// and return some json object. Then if registration success, client reload page. It will be good to say user
	// if some error happens

    // William: you are right. It is better to ajax to replace the res.render().
    // I use ajaxForm before, it is a good option. Here I use pure jQuery.ajax to rend page.
};

exports.edit_pm = function (req, res)
{
	var user = req.user;
    console.log('---------['+__filename+']----------');
	console.log(user);

	arr = comm.get_birthday_array(user.birthday);

	if(arr.length > 0) {
		user.month = arr[1];
		user.day = arr[2];
		user.year = arr[3];
	}

	res.render('users/userProfile', { // we need to find solution for form extends
		layout: 'wj_layout.jade',
		title: user.username || 'Peoplemelt User Account',
		user: user
	});
};

exports.edit = function (req, res)
{
    var user = req.user;
    console.log('---------['+__filename+']----------');
    console.log(user);

    arr = comm.get_birthday_array(user.birthday);

    if(arr.length > 0) {
        user.month = arr[1];
        user.day = arr[2];
        user.year = arr[3];
    }

    // res.writeHead(200, {'Content-Type': 'text/plain'});
    res.render('users/userProfile', {
        layout: false,
        title: user.username || 'Peoplemelt User Account',
        user: user
    });
};


exports.update = function (req, res)
{
	console.log(req.body);
	console.log('=======================!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
	UserProvider.updateUserByPeoplemeltData(req.user._id, req.body, function(err, users) {
		console.log('=======================++++++++++++++++++++++++++++++++')
		res.send(JSON.stringify({
			success: true
		}));
	});
};

exports.destroy = function (req, res)
{

};

exports.load = function (id, callback)
{
	userModel.findOne({_id: id }, function(err, user) {
		if (err) {
			console.log('error on user load');
			console.log(err);

			throw err;

			return;
		}

		callback(null, user);
	});
};