/**
 * Created with JetBrains WebStorm.
 * User: william
 * Date: 08/06/12
 * Time: 1:57 PM
 * To change this template use File | Settings | File Templates.
 */
var conf = require('./siteConfig')
    , express = require('express')
    , util = require('util');

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , mongooseAuth = require('mongoose-auth');

var UserSchema = new Schema({})
    , User;

// Schema Decoration and Configuration for the Routing
UserSchema.plugin(mongooseAuth, {
    everymodule:{
        everyauth:{
            User:function () {
                return User;
            }, handleLogout:function (req, res) {
                req.logout();
                this.redirect(res, this.logoutRedistectPath());
            }
        }
    }, facebook:{
        everyauth:{
            appId:conf.external.facebook.appId, appSecret:conf.external.facebook.appSecret, redirectPath:'/', findOrCreateUser:function (session, accessTok, accessTokExtra, fbUser) {
                console.log(util.inspect(fbUser));

                var promise = this.Promise()
                    , User = this.User()();

                User.findById(session.auth.userId, function (err, user) {
                    if (err) return promise.fail(err);
                    if (!user) {
                        User.where('password.login', fbUser.email).findOne(function (err, user) {
                            if (err) return promise.fail(err);
                            if (!user) {
                                User.createWithFB(fbUser, accessTok, accessTokExtra.expires, function (err, createdUser) {
                                    if (err) return promise.fail(err);
                                    return promise.fulfill(createdUser);
                                });
                            } else {
                                assignFbDataToUser(user, accessTok, accessTokExtra, fbUser);
                                user.save(function (err, user) {
                                    if (err) return promise.fail(err);
                                    promise.fulfill(user);
                                });
                            }
                        });
                    } else {
                        assignFbDataToUser(user, accessTok, accessTokExtra, fbUser);

                        // Save the new data to the user doc in the db
                        user.save(function (err, user) {
                            if (err) return promise.fail(err);
                            promise.fuilfill(user);
                        });
                    }
                });
                return promise; // Make sure to return the promise that promises the user
            }
        }
    }
});

// Assign all properties - see lib/modules/facebook/schema.js for details
function assignFbDataToUser(user, accessTok, accessTokExtra, fbUser) {
    user.fb.accessToken = accessTok;
    user.fb.expires = accessTokExtra.expires;
    user.fb.id = fbUser.id;
    user.fb.name.first = fbUser.first_name;
    // etc. more assigning...
}

//mongooseAuth.everymodule.logoutPath('/logout');
//mongooseAuth.everymodule.logoutRedirectPath('/redirect');

function helper() {
    console.log(util.inspect(everyauth.loggerIn));
    console.log(everyauth.user);
    console.log(everyauth.facebook);
    console.log(req.session.auth.facebook);
    console.log(everyauth.facebook.user);
    console.log(everyauth.facebook.accessToken);
    console.log(user);
}

mongoose.model('User', UserSchema);

mongoose.connect(conf.mongohq_url);

User = mongoose.model('User');

var app = express.createServer();
app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.static(__dirname + "/public"));
    app.use(express.cookieParser());
    app.use(express.session({ secret:'peoplemelt'}));

    // Add in the Routing, don't add app.use(app.router), or req.user can't be use.
    app.use(mongooseAuth.middleware());

    app.set('view engine', 'jade');
    app.set('views', __dirname+'/views');

    app.use(express.errorHandler());
});

var siteConf = conf;

// Add in Dynamic View Helpers
mongooseAuth.helpExpress(app);
app.dynamicHelpers({
    'session': function(req, res) {
        return req.session;
    }
    , 'googleKey': function (req, res) {
        return siteConf.external.google.appId;
    }
    , 'location': function (req, res) {
        return req.cookies.locationname || false;
    }
    , 'langs': function () {
        return siteConf.langs;
    }
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

app.get('/', function (req, res) {
    //console.log(util.inspect(req.user, true, null));
    res.render('test1');
});

app.all('/', function(req, res) {
    // Set example session uid for use with socket.io.
    if (!req.session.uid) {
        req.session.uid = (0 | Math.random()*1000000);
    }

    res.render('index');
});


app.get('/logout', function (req, res) {

});

app.get('/redirect', function (req, res) {

});

app.get('/test', function (req, res) {
    //console.log(util.inspect(req.user, true, null));
    console.log(req);
    console.log(res);
    res.render('/test');
});

app.listen(3000);

// If all fails, hit em with the 404
app.all('*', function(req, res){
    throw new NotFound;
});

console.log('Running in '+(process.env.NODE_ENV || 'development')+' mode @ '+conf.uri);
