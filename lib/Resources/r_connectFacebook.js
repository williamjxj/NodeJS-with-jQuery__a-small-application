/**
 * Created with JetBrains WebStorm.
 * User: william
 * Date: 17/06/12
 * Time: 4:28 PM
 * To change this template use File | Settings | File Templates.
 */
var fbUser = require('../Models/connectFacebook').fbUser;
var UserProvider= new fbUser();
var util = require('util');

exports.index = function(req, res) {
    console.log('facebook#index');
    UserProvider.findAll(function(error, users){
        res.render('users/registration', {
            locals: {
                title: 'Mongo Node.js Blog',
                users: users
            }
        });
    })
};

exports.show = function(req, res){
    console.log('facebook#show22222: ' + util.inspect(req.user));
    res.render('user_new', {
        locals: {
            title: 'New user'
        }
    });
};

exports.new = function(req, res) {
    console.log('facebook#new');
    var nu = new User(req.body.user);
    UserProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function(error, docs) {
        res.redirect('/users/new' + user._id.toHexString());
        res.redirect('/');
    });
};

exports.create = function(req, res) {
    console.log('facebook#create');
    //UserProvider.findById(req.param('id'), function(error, user) {}
    //UserProvider.findById(req.params.id, function(error, user) {}
    UserProvider.findById(req.params.id).first(function(user) {
        res.render('users/user_show', {
            locals: {
                title: user.title || 'William User Account',
                user:user
            }
        });
    });
};

exports.edit = function(req, res) {
    console.log('facebook#edit' + util.inspect(req.user));
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

exports.update = function(req, res) {
    console.log('facebook#index');
    UserProvider.findById(req.params.id).first(function(error, user) {
        res.render('user_edit', {
            locals: {
                title: user.title,
                user:user
            }
        });
    });
};

exports.update = function(req, res){
    console.log('facebook#update');
    UserProvider.updateById(req.param('id'), req.body, function(error, user) {
        res.redirect('/');
    });
};

/*
exports.comment = function(req, res){
    console.log('facebook#update1');
    UserProvider.addCommentToUser(req.body._id, {
        person: req.body.person,
        comment: req.body.comment,
        created_at: new Date()
    }, function(error, docs) {
        res.redirect('/users/' + req.body._id)
    });
};
*/

exports.load = function(id, callback) {
    callback(null, {id: id, name: "William Account" + id });
}
