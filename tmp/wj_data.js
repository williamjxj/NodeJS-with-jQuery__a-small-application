/**
 * Created with JetBrains WebStorm.
 * User: william
 * Date: 17/06/12
 * Time: 11:45 PM
 * To change this template use File | Settings | File Templates.
 */

var conf = require('../lib/getConfig');
var mongoose = require('mongoose')
    , comm = require('../lib/common');

require('../lib/Schemas/Users');

var User = mongoose.model('User');

var user = new User();

//mongoose.connect(conf.mongolocal_url);
mongoose.connect(conf.mongohq_url);

pmUser = function() {};

var pm = {
		username: 'william test: username'
		, first_name: 'first name'
		, last_name: 'last name'
		, gender: 'gender'
		, birthday: new Date()
		, email: 'test@example.com'
		, picture:  'http://example.com/myfacebook.ico'
		, third_party: 'Peoplemelt'
		, third_party_id: 'Peoplemelt'
		, password: '123456'
};
pm.created_time = comm.get_current_datetime();

pmUser.prototype.findOrCreateUserByPeoplemeltData = function(pm) {

    for (var attr in pm) {
        user[attr] = pm[attr];
    }

    if(conf.debug) {
        console.log(user);
    }
    user.save(function(err, res) {
        if(err) {
            console.log(err);
            return;
        }
        else {
            if(conf.debug) {
                console.log('[' + pm.email + '] user information has been saved.');
            }
        }
				mongoose.disconnect();
    });
};

//	query.or([ {email: data.email }, { username: data.username } ]
pmUser.prototype.getUserObjectId = function (email) {

	var query = User.find({ email: email }, [ '_id' ], function(err, uid) {
		if(err) { throw err; }
		console.log(uid);
		mongoose.disconnect();
	});
};

p = new pmUser();
// p.findOrCreateUserByPeoplemeltData(pm);

//p.getUserObjectId('jxjwilliam@gmail.com');



function getUserObjectId (data)
{
	var query = User.find({
		email: data.email
	}, [ '_id' ], function(err, uid) {
		if(err) { throw err; }
		mongoose.disconnect();
	});
}

var id = getUserObjectId({email: 'jxjwilliam@gmail.com'});
console.log(id);
