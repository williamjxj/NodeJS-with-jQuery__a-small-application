/**
 * Created with JetBrains WebStorm.
 * User: william
 * Date: 18/06/12
 * Time: 3:20 PM
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose')
    , comm = require('../common')
    , util = require('util');

require('../Schemas/Users');

var User = mongoose.model('User');

var user = new User();
pmUser = function() {};

pmUser.prototype.findUserByEmailPassword = function(pmData, callback) {
    var condition = { email: pmData.email2, password: pmData.password2 };
    console.log('----------' + __filename + ': --------')
    console.log(condition);
    User.findOne(condition, function(err, doc) {
        if(err) {
            console.log(err.lineNumber + ': ' + err);
        }
        callback(err, doc);
    });
}

// email is the unique index.
pmUser.prototype.findOrCreateUserByPeoplemeltData = function(pmData, callback) {
    callback = callback || function() {};

    console.log('['+__filename + ']: Retrieving Peoplemelt Account: [' + pmData.pm_email + ']');

    var condition = { email: pmData.pm_email };

    User.findOne(condition, function(err, doc) {
        if(err) {
            console.log(err.lineNumber + ': ' + err);
        }
        var pm = {
            username: pmData.username || pmData.first_name + ' ' + pmData.last_name
            , first_name: pmData.firstname || ''
            , last_name: pmData.lastname || ''
            , gender: pmData.sex
            , email: pmData.pm_email
            , picture:  pmData.picture || ''
            , third_party: 'Peoplemelt'
            , third_party_id: 'Peoplemelt'
            , password: pmData.pm_passwd || ''
        };

        if(pmData.birthday_year == ""
            || pmData.birthday_month == ''
            || pmData.birthday_day == '') {
            pm.birthday = '';
        }
        else {
            dt    = pmData.birthday_year + '-' + pmData.birthday_month + '-' + pmData.birthday_day;
            pm.birthday = new Date(dt); // Date Object is required, not a string.
        }

        if(doc) {
            console.log(util.inspect(doc));
            pm.updated_time = comm.get_current_datetime();

            User.update(condition, pm, {multi: false}, function(err) {
                if(err) {
                    console.log(err);
                }
            });
        }
        else {
            console.log('Insert to Peoplemelt Database: [' + pmData.pm_email + ']');

            pm.created_time = comm.get_current_datetime();

            for (var attr in pm) {
                user[attr] = pm[attr];
            }

            // Async save, so promise is useful.
            user.save(function(err, res) {
                if(err) {
                    throw err;
                }
                else {
                  console.log('[' + pmData.pm_email + '] user information has been saved.');
                }
            });

            User.findOne(condition, function(err, doc1) {
                if(err) {
                    console.log(err.lineNumber + ': ' + err);
                }
                callback(err, doc1);
            });

        }
    });
};

exports.pmUser = pmUser;
