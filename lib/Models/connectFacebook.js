/**
 * Created with JetBrains WebStorm.
 * User: william
 * Date: 08/06/12
 * Time: 5:43 PM
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose')
    , comm = require('../common')
    , util = require('util');

require('../Schemas/Users');

var User = mongoose.model('User');

var user = new User();

fbUser = function() {};

fbUser.prototype.findOrCreateUserByFacebookData = function(session, accessToken, accessTokenExtra, fbData) {
    console.log(__filename + ': Retrieving Facebook Account in William Database: [' + fbData.name + ': ' + accessToken + ']');

    var condition = { token: accessToken };

    // user.find({email: fbData.email}, function(err, docs) {});
    User.findOne(condition, function(err, doc) {
        if (err) {
            console.log(err.lineNumber + ': ' + err);
        }

        var new_fb = {
            token: accessToken
            , fb_id: fbData.id
            // It is strange that username could be null.
            , username: fbData.username || ''
            , first_name: fbData.first_name || ''
            , middle_name: fbData.middle_name || ''  // could be null.
            , last_name: fbData.last_name || ''
            , gender: fbData.gender
            , locale: fbData.locale
            , timezone:  fbData.timezone || -7
            //created_time: typeof created_time === 'undefined' ? comm.get_current_datetime() : created_time,
            //updated_time: comm.get_current_datetime(),
            , birthday: fbData.birthday || ''
            , email: fbData.email || ''
            , picture:  fbData.picture || ''
            , role_id: ''
            , third_party: 'Facebook'
            , third_party_id: 'Facebook'
            , ex_session: session
            , ex_token: accessTokenExtra || {}
            , ex_link: fbData.link || {}
            //, ex_bio: fbData.bio
            //, ex_location: fbData.location
            , ex_verified: fbData.verified || true
        };

        if(doc) {
           // console.log(util.inspect(doc));

            new_fb.updated_time = comm.get_current_datetime();
            user.markModified('ex_token');
            user.markModified('ex_session');

            console.log(util.inspect(new_fb));

            // During any next sign-in user account should be synch with some of Facebook fields.
            User.update(condition, new_fb, { multi: false }, function(err) {
                if(err) {
                    console.log(err);
                }
            });
        }
        else {
            console.log('Insert Facebook Account to William Database: [' + fbData.name + ']');

            new_fb.created_time = comm.get_current_datetime();
            for(var attr in new_fb) {
                user[attr] = new_fb[attr];
            }
            user.markModified('ex_token');
            user.markModified('ex_session');

            user.save(function(err, res) {
                if(err) {
                    console.log(err);
                    return;
                }
                else {
                        console.log('[' + fbData.name + '] information has been saved.');
                }
            })
        }
    });
};

exports.fbUser = fbUser;
