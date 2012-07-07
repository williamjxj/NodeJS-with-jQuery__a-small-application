/**
 * Created with JetBrains WebStorm.
 * User: william
 * Date: 08/06/12
 * Time: 5:43 PM
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose')
    , comm = require('../common');

require('../Schemas/Users');

var User = mongoose.model('User');

var user = new User();

pmUser = function() {};

//Find all Users
pmUser.prototype.findAll = function(callback) {
    User.find({}, function (err, pmusers) {
			if(err) {
                console.log(err);
                throw err;
            }
			/*pmusers.forEach(function(data) {
				console.log(data);
				mongoose.disconnect();
			});*/
			callback( null, pmusers )
    }).sort('updated_time', -1).limit(siteConf.streamLength);
};


//Find User by ID
pmUser.prototype.findById = function(id, callback) {
    User.findById(id, function (err, pm) {
        if (!err) {
            callback(null, pm);
        }
        else {
            console.log('88888888: ' + err);
        }
    });
};

/*pmUser.prototype.updateUserByPeoplemeltData = function(id, body, callback) {
    var data = {};
    data.id = body.uid; // id=data.id
    data.username = body.username;
    data.first_name = body.firstname;
    data.last_name = body.lastname;
    data.gender = body.sex;
    data.email = body.pm_email;
    data.password = body.pm_passwd;
    if (body.birthday_month && body.birthday_day && body.birthday_year) {
        var bd = body.birthday_year + '-' + body.birthday_month + '-' + body.birthday_day;
        data.birthday = new Date(bd);
    }
    data.updated_time = comm.get_current_datetime();

    var condition = { _id: data.id };
    userModel.update(condition, data, { multi: false }, function(err) {
        if(err) { throw err; }
        userModel.find({}, function (err, users) {
            if(err) {
                console.log(err);
                throw err;
            }
            callback( null, users );
        });
    });
    // this is insert, not update. save() only do insert.
    userModel.findById(id, function(err, user) {
        console.log('333333333333: ' + user);
        if(err) { throw err; }
        else {
            for(var attr in data) {
                User[attr] = data[attr];
            }
            User.save(function(err) {
                if(!err) {   callback(null, user);  }
                else {  console.log('999999999: ' + err);  }
            });
        }
    });
};*/

pmUser.prototype.updateUserByPeoplemeltData = function(id, body, callback) {
    var data = {};
    data.id = body.uid; // id=data.id
    data.username = body.username;
    data.first_name = body.firstname;
    data.last_name = body.lastname;
    data.gender = body.sex;
    data.email = body.pm_email;
    data.password = body.pm_passwd;
    if (body.birthday_month && body.birthday_day && body.birthday_year) {
        var bd = body.birthday_year + '-' + body.birthday_month + '-' + body.birthday_day;
        data.birthday = new Date(bd);
    }
    data.updated_time = comm.get_current_datetime();

    var condition = { _id: data.id };
    User.update(condition, data, { multi: false }, function(err) {
        if(err) { throw err; }
        User.find({}, function (err, data) {
            if(err) {
                console.log(err);
                throw err;
            }
            callback( null, data );
        });
    });
    /* this is insert, not update. save() only do insert.
    User.findById(id, function(err, user) {
        console.log('333333333333: ' + user);
        if(err) { throw err; }
        else {
            for(var attr in data) {
                User[attr] = data[attr];
            }
            User.save(function(err) {
                if(!err) {   callback(null, user);  }
                else {  console.log('999999999: ' + err);  }
            });
        }
    });*/
};

exports.pmUser = pmUser;
