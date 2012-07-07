var everyauth = require('everyauth')
    , util = require('util')
    , siteConf = require('./getConfig')
    , users = require('./Models/connectFacebook').fbUser;
users = new users();

var https = require('https');

module.exports = function Server(expressInstance, siteConf) {
	everyauth.debug = siteConf.debug;

    everyauth.everymodule.handleLogout( function (req, res) {
		delete req.session.user;
        if(typeof req.session.doc != 'undefined' || req.session.doc != undefined) {
            delete req.session.doc;
        }
        req.logout();
		res.writeHead(303, { 'Location': this.logoutRedirectPath() });
		res.end();
	});

	// Facebook
	if(siteConf.external && siteConf.external.facebook) {
        everyauth.facebook
            .appId(siteConf.external.facebook.appId)
            .appSecret(siteConf.external.facebook.appSecret)
            .findOrCreateUser(function(session, accessToken, accessTokenExtra, fbUser) {
                if(siteConf.debug) {
                    //console.log('fbUser: ' + util.inspect(fbUser));
                    //console.log('Session: ' + util.inspect(session));
                    //console.log('accessToken: ' + util.inspect(accessToken));
                    //console.log('accessTokenExtra: ' + util.inspect(accessTokenExtra));
                }
                users.findOrCreateUserByFacebookData(session, accessToken, accessTokenExtra, fbUser);

                return true;
            })
            .redirectPath('/');
    }

	// Twitter
	if (siteConf.external && siteConf.external.twitter) {
		everyauth.twitter
		.myHostname(siteConf.uri)
		.consumerKey(siteConf.external.twitter.consumerKey)
		.consumerSecret(siteConf.external.twitter.consumerSecret)
		.findOrCreateUser(function (session, accessToken, accessSecret, twitterUser) {return true;}).redirectPath('/');
	}

	everyauth.helpExpress(expressInstance, { userAlias: '__user__' });

	// Fetch and format data so we have an easy object with user data to work with.
	function normalizeUserData() {
		function handler(req, res, next) {
			if (req.session && !req.session.user && req.session.auth && req.session.auth.loggedIn) {
                if(siteConf.debug) {
                    //console.log(util.inspect(req, true, null));
                    //console.log(util.inspect(res, true, null));
                    //console.log(next);
                }

                var user = {};
				if (req.session.auth.twitter) {
					user.image = req.session.auth.twitter.user.profile_image_url;
					user.name = req.session.auth.twitter.user.name;
					user.id = 'twitter-'+req.session.auth.twitter.user.id_str;
				}
				if (req.session.auth.facebook) {
					user.image = req.session.auth.facebook.user.picture;
					user.name = req.session.auth.facebook.user.name;
					user.id = 'facebook-'+req.session.auth.facebook.user.id;

					// Need to fetch the users image...
					https.get({
						'host': 'graph.facebook.com'
						, 'path': '/me/picture?access_token='+req.session.auth.facebook.accessToken
					}, function(response) {
						user.image = response.headers.location;
						req.session.user = user;
						next();
					}).on('error', function(e) {
						req.session.user = user;
						next();
					});
					return;
				}
				req.session.user = user;
                if(siteConf.debug) {
                    console.log(user);
                    console.log(req.session.user);
                }
			}
			next();
		}
		return handler;
	}

	return {
		'middleware': {
			'auth': everyauth.middleware
			, 'normalizeUserData': normalizeUserData
		}
	};
};
