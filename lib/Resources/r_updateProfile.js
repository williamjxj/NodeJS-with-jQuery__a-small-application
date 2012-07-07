/**
 * Created with JetBrains WebStorm.
 * User: william
 * Date: 17/06/12
 * Time: 4:28 PM
 * To change this template use File | Settings | File Templates.
 */
var util = require('util')
    , comm = require('../common')
    , VAR1 = 'profile'; // vary from app.resource definition.

var pmUser = require('../Models/updateProfile').pmUser;
var UserProvider = new pmUser();

exports.index = function(req, res) {
    console.log(VAR1 + '#index');
    UserProvider.findAll(function(error, users) {
        res.render('users/index', {
            locals: {
                title: 'William Accounts Management',
                accounts: users
            }
        });
    }).sort('updated_time', -1).limit(siteConf.streamLength);
};

exports.new = function(req, res) {
    console.log(VAR1 + '#new');
    findOrCreateUserByWilliam(req.body, function(error, docs) {
        res.redirect('/users/new' + user._id.toHexString());
        res.redirect('/');
    });
};

exports.show = function(req, res) {
    console.log(__filename + '=> ' + req.params.id);

    UserProvider.yyId(req.params.id, function(err, user) {
        user.id = user._id; //req.params.id; can't read property: user._id.toHexString();

				arr = comm.get_birthday_array(user.birthday);
				console.log('1.----------'+__filename+'--------------');
				console.log(arr);
				if(arr.length > 0) {
						user.month = arr[1];
						user.day = arr[2];
						user.year = arr[3];
				}

				console.log('2.----------'+__filename+'--------------');
        console.log(util.inspect(user));
        if(err) {
            console.log(__filename + ': ' + err);
            throw err;
        }
        res.render('users/userProfile', {
            locals: {
                title: user.username || 'William User Account',
                user:user
            }
        });
    });
};


exports.create = function(req, res) {
    console.log(VAR1 + '#create');
    console.log(util.inspect(req.body));
    id = req.body.uid;
    UserProvider.updateUserByWilliam(id, req.body, function(err, users) {
        console.log('=======================++++++++++++++++++++++++++++++++')
       res.render('index', {
           layout: true
       });
    });
};

//: GET /profile/:id/edit
exports.edit = function(req, res) {
    console.log(VAR1 + '#edit' + util.inspect(req.user));
    var id = req.params.id;
    console.log(req.body.user);
    UserProvider.findById(id).first(function(user) {
       user.name = req.body.user.name;
       user.first_name = req.body.user.first_name;
       user.save(function() {
          res.redirect('/users/' + user._id.toHexString());
       });
    });
};

//: PUT /profile/:id
exports.update = function(req, res){
    console.log(VAR1 + '#update');
    UserProvider.updateById(req.params.id, req.body, function(error, user) {
        res.redirect('users/index');
    });
};

//: DELETE /profile/:id
exports.destroy = function(req, res) {
    UsertProvider.deleteById(req.params.id, reg.body, function(error, user) {

    })
};

/*
exports.load = function(id, callback) {
    callback(null, {id: id, name: "William Account" + id });
};

exports.comment = function(req, res){
    console.log(VAR1 + '#update1');
    UserProvider.addCommentToUser(req.body._id, {
        person: req.body.person,
        comment: req.body.comment,
        created_at: new Date()
    }, function(error, docs) {
        res.redirect('/users/' + req.body._id)
    });
};
exports.findFirst = function(req, res) {
    console.log(VAR1 + '#index');
    UserProvider.findById(req.params.id).first(function(error, user) {
        res.render('users/user_show', {
            locals: {
                title: user.title,
                user:user
            }
        });
    });
};
*/
