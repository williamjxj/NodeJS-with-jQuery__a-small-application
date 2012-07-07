/**
 * Created with JetBrains WebStorm.
 * User: ingrid
 * Date: 19/06/12
 * Time: 12:05 PM
 * To change this template use File | Settings | File Templates.
 */
// Fetch the site configuration
var siteConf = require('./lib/getConfig')
    , i18n = require("i18n");

i18n.configure({
    locales: siteConf.langs
    , cookie: 'lang'
    , directory: __dirname + '/locales/'
});

process.title = siteConf.uri.replace(/http:\/\/(www)?/, '');

var airbrake;
if (siteConf.airbrakeApiKey) {
    airbrake = require('airbrake').createClient(siteConf.airbrakeApiKey);
}

process.addListener('uncaughtException', function (err, stack) {
    console.log('Caught exception: '+err+'\n'+err.stack);
    console.log('\u0007'); // Terminal bell
    if (airbrake) { airbrake.notify(err); }
});

var connect = require('connect')
    , express = require('express')
    , Resource = require('express-resource')
    , notifoMiddleware = require('connect-notifo');

// Session store
var options = {
    'port': siteConf.redis_port,
    'host': siteConf.redis_host,
    'pass': siteConf.redis_auth
}
// temporary hack while I can't create new user or login by facebook from client side
var autoloader = require('./lib/autoloader');

var allExports = autoloader.requireDir('Models');
var allSchemas = autoloader.requireDir('Schemas');

var mongoose = require('mongoose')
//, Users = require('./lib/Users')
    , UserModel = mongoose.model('UserModel')
    , PostModel = mongoose.model('PostModel')
    , jade = require('jade');

var curUser;

// connect must be inside of any Model file, because we need to do it once and be sure that we have connection in other Model files
mongoose.connect(siteConf.mongohq_url);

UserModel.findOne({
    username: 'Enjeru'
}, function (err, doc)
{
    var instance;

    if (err) {
        console.log('error for getting user');
        console.log(err);

        return;
    }

    if (doc) {
        curUser = doc;

        return;
    }

    instance = new UserModel({
        username: 'Enjeru'
        , first_name: 'Slava'
        , middle_name: 'Endspiel'
        , last_name: 'Muteki'
        , gender: 'male'
        , locale: 'ua'
        , timezone: 2
        , created_time: new Date()
        , updated_time: new Date()
        , birthday: new Date()
        , email: 'nikolaenko@qarea.com'
        , picture: ''
    });

    instance.save(function (err)
    {
        if (err) {
            console.log('error on instane save');
            console.log(err);

            return;
        }

        curUser = instance;
    })
})

// console.log(options);
var RedisStore = require('connect-redis')(express);
var sessionStore = new RedisStore(options);

var app = module.exports = express.createServer();
app.listen(siteConf.port, null);

// Setup socket.io server
var socketIo = new require('./lib/socket-io-server.js')(app, sessionStore);
var authentication = new require('./lib/authentication.js')(app, siteConf);

// Settings
app.configure(function() {
    app.set('view engine', 'jade');
    app.set('views', __dirname+'/views');
});

// Middleware
app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        'store': sessionStore
        , 'secret': siteConf.sessionSecret
    }));
    app.use(i18n.init);
    app.use(express.logger({format: ':response-time ms - :date - :req[x-real-ip] - :method :url :user-agent / :referrer'}));
    app.use(authentication.middleware.auth());
    app.use(authentication.middleware.normalizeUserData());
    app.use(express.static(__dirname + '/public', {maxAge: 86400000}));

    // Send notification to computer/phone @ visit. Good to use for specific events or low traffic sites.
    if (siteConf.notifoAuth) {
        app.use(notifoMiddleware(siteConf.notifoAuth, {
            'filter': function(req, res, callback) {
                callback(null, (!req.xhr && !(req.headers['x-real-ip'] || req.connection.remoteAddress).match(/192.168./)));
            }
            , 'format': function(req, res, callback) {
                callback(null, {
                    'title': ':req[x-real-ip]/:remote-addr @ :req[host]'
                    , 'message': ':response-time ms - :date - :req[x-real-ip]/:remote-addr - :method :user-agent / :referrer'
                });
            }
        }));
    }
});

// ENV based configuration

// Show all errors and keep search engines out using robots.txt
app.configure('development', function(){
    app.use(express.errorHandler({
        'dumpExceptions': true
        , 'showStack': true
    }));
    app.all('/robots.txt', function(req,res) {
        res.send('User-agent: *\nDisallow: /', {'Content-Type': 'text/plain'});
    });
});
// Suppress errors, allow all search engines
app.configure('production', function(){
    app.use(express.errorHandler());
    app.all('/robots.txt', function(req,res) {
        res.send('User-agent: *', {'Content-Type': 'text/plain'});
    });
});

app.helpers({
    __i: i18n.__
    , __n: i18n.__n
});

// Template helpers
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
    , 'locale': function (req, res) {
        return i18n.getLocale();
    }
    , 'langs': function () {
        return siteConf.langs;
    }
});

// Error handling
app.error(function(err, req, res, next){
    // Log the error to Airbreak if available, good for backtracking.
    console.log(err);
    if (airbrake) { airbrake.notify(err); }

    if (err instanceof NotFound) {
        res.render('errors/404');
    } else {
        res.render('errors/500');
    }
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

// Routing

app.all('/client-config.json', function (req, res)
{
    var obj = {
        'edit-title': i18n.__('edit-title')
        , 'edit-content': i18n.__('edit-content')
        , 'fail-loc-title': i18n.__('fail-loc-title')
        , 'fail-loc-content': i18n.__('fail-loc-content')
        , 'sec': i18n.__('sec')
        , 'min': i18n.__('min')
        , 'hour': i18n.__('hour')
        , 'day': i18n.__('day')
        , 'month': i18n.__('month')
        , 'year': i18n.__('year')
        , 'invalidMessage': i18n.__('post-mess-val-err')
        , 'invalidTags': i18n.__('post-tags-val-err')
    }

    res.write(JSON.stringify(obj));
    res.end();
});
function getUserFromRequest (req)
{
    return curUser;
}

socketIo.on('connection', function (socket)
{
    socket.on('getLastPosts', function (data)
    {
        getLastPosts({
            minLat: data.minLat
            , maxLat: data.maxLat
            , minLong: data.minLong
            , maxLong: data.maxLong
        }, function (err, res)
        {
            if (err) {
                console.log('error on get last posts for client');
                console.log(err)

                return;
            }

            var i;

            if (res.length === 0) {
                socket.emit('noPosts')

                return;
            }
            for (i = res.length - 1; i > -1; --i) {
                socket.emit('getPost', {
                    message: res[i].message
                    , tags: res[i].tags
                    , userName: res[i]._user.username
                    , time: res[i].updated_time.getTime()
                    , positionText: res[i].place_text
                });
            }
        })
    });

    socket.on('newPost', function (data)
    {
        if (data.message.length === 0) {
            socket.emit('postErr', data);

            return;
        }

        var tags = data.tags.split(/\W+/)
            , new_post = new PostModel({
                message: data.message
                , special: !!data.special || false
                , lat: data.lat
                , long: data.long
                , place_text: data.locationname
                , _user: getUserFromRequest()._id
                , created_time: new Date()
                , updated_time: new Date()
            })
            , i;

        for (i = 0; i < tags.length; ++i) {
            if (tags[i].length !== 0) {
                tags[i] = tags[i].toLowerCase();
                tags[i] = tags[i][0].toUpperCase() + tags[i].substr(1);

                new_post.tags.push(tags[i]);
            }
        }

        if (new_post.tags.length === 0) {
            socket.emit('postErr', data);

            return;
        }

        new_post.save(function (err)
        {
            if (err) {
                console.log('error on post saving');
                console.log(err)
                // throw Error in future
                socket.emit('postErr', data);

                return;
            }

            socket.emit('postSuc');
        });
    });
})

function getLastPosts (data, cb)
{
    PostModel.find({
        $and: [
            {
                lat: {
                    $gt: data.minLat
                    , $lt: data.maxLat
                }
                , long: {
                $gt: data.minLong
                , $lt: data.maxLong
            }
            }
        ]
    }).sort('updated_time', -1).limit(siteConf.streamLength).populate('_user').exec(cb);
}

/*getLastPosts(function (err, res)
 {
 if (err) {
 console.log('error on getting last posts');
 console.log(err);

 return;
 }

 res.map(function (el)
 {
 console.log(el);
 })
 });*/

/*PostModel.find({}, function (err, res)
 {
 console.log(res.length)

 res.map(function (el)
 {
 el.remove();
 })
 })*/


app.all('/', function(req, res) {
    // Set example session uid for use with socket.io.
    if (!req.session.uid) {
        req.session.uid = (0 | Math.random()*1000000);
    }

    res.render('index');
});



app.get('/signout', function (req, res) {
    if(siteConf.debug) {
    }
    res.render('index');
});
/**
 * https://github.com/bnoguchi/everyauth:
 * If you integrate everyauth with connect, then everyauth automatically sets up a logoutPath at GET /logout for the app.
 * It also sets a default handler for your logout route that clears your session of auth information
 * and redirects them to '/'.
 * authentication.js -> handleLogout is called underlying.
 */
app.get('/logout', function (req, res) {
});

app.get('/fbuser', function(req, res) {
    res.render('index');
});

var pmUser = require('./lib/Models/createProfile').pmUser;
var users = new pmUser();
app.post('/register', function(req, res) {
    console.log(req.body);
//    req.body.username = req.body.firstname + ' ' + req.body.lastname;
    users.findOrCreateUserByPeoplemeltData(req.body);
    res.render('index');
});

///////////////////////////////

app.resource('facebook', require('./lib/Resources/r_connectFacebook'));

app.resource('profile', require('./lib/Resources/r_updateProfile'));

/*
 app.all('*', function(req, res){
 console.log(res);
 throw new NotFound;
 });

console.log('Running in '+(process.env.NODE_ENV || 'development')+' mode @ '+siteConf.uri);


