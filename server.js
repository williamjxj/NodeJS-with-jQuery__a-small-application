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
	if (airbrake) {
		airbrake.notify(err);
	}
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

//var allExports = autoloader.requireDir('Models');
var allSchemas = autoloader.requireDir('Schemas');

var mongoose = require('mongoose')
, User = mongoose.model('User')
, PostModel = mongoose.model('Post')
, jade = require('jade');

var curUser;


/*
if(siteConf.debug) { mongoose.connect(siteConf.mongolocal_url); }
else { mongoose.connect(siteConf.mongohq_url); }
*/

User.findOne({
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

    instance = new User({
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
            console.log('error on instance save');
            console.log(err);
            return;
        }

        curUser = instance;
    })
});

// console.log(options);
var RedisStore = require('connect-redis')(express);
var sessionStore = new RedisStore(options);

var app = express.createServer();

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
		, cookie: {
			maxAge: null
			, originalMaxAge: null
			, httpOnly: false
		}
	}));
	app.use(i18n.init);
	app.use(express.logger({
		format: ':response-time ms - :date - :req[x-real-ip] - :method :url :user-agent / :referrer'
	}));
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
app.configure('qa', function ()
{
	app.use(express.errorHandler({
		'dumpExceptions': true
		, 'showStack': true
	}));
	app.all('/robots.txt', function(req,res) {
		res.send('User-agent: *\nDisallow: /', {'Content-Type': 'text/plain'});
	});
	app.all('/', function (req, res, next)
	{
		if (req.cookies.username !== siteConf.qa.username || req.cookies.pass !== siteConf.qa.pass) {
			app.set('view options', { layout: false })
			res.render('qa-auth');
			app.set('view options', { layout: true });

			return;
		}

		next();
	})
});

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

app.resource('users', require('./lib/Resources/users'));
var postsRouts = require('./lib/Resources/posts')
	, postsResource = app.resource('posts', postsRouts);

postsResource.map('get', '/:minLat/:maxLat/:minLong/:maxLong', postsRouts.getPosts)

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
	if (airbrake) {
		airbrake.notify(err);
	}

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
		, 'postsWaitingTime': siteConf.postsWaitingTime
	}

	res.write(JSON.stringify(obj));
	res.end();
});


app.all('/', function(req, res) {
	// Set example session uid for use with socket.io.
	if (!req.session.uid) {
		req.session.uid = (0 | Math.random()*1000000);
		res.cookie('sessionStarted', 'true')
	}

    res.render('index');
});

// We need or login/logout or only signin/signout names
app.get('/signout', function (req, res) {
    if(siteConf.debug) { }
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
    /* move to lib/authenticate.js which has not 'next()'.
    if(typeof req.session.doc != 'undefined' || req.session.doc.length>0) {
        delete req.session.doc;
    }*/
});

var pmUser = require('./lib/Models/createProfile').pmUser;
var users = new pmUser();

app.post('/register', function(req, res) {
	console.log('------------['+__filename+':------------');
    console.log(req.body);
	// req.body.username = req.body.firstname + ' ' + req.body.lastname;
    // How does it garuanttee 'save' before res.render()?
	users.findOrCreateUserByPeoplemeltData(req.body, function(err, callback){
		res.render('index');
	});
	return;
});

app.post('/login', function(req, res) {
	var u = users.findUserByEmailPassword(req.body, function(err, doc) {
		if(err) { throw err; }
		if(doc) {
			req.session.doc = doc;
			//res.render('index', { }); //session.doc
			res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('_callback(\'{msg: 1}\')');
    }
		else {
      res.writeHead(200, {'Content-Type': 'text/plain'});
			//var msg = "{ msg: 'No Such User - email: [' + req.body.email2 + '], password: [' + req.body.password2 +']' }";
      //res.end('_callback(\'{msg: [req.body.email2, req.body.password2]}\')');
      res.end('_callback(\'{msg: 2}\')');
		}
	});
	return;
});

var comm = require('./lib/common');
/**
 * fb_id or Object:_id?
 * fb_id: all digital, such as 580317536
 * Object:_id: mix of digital and word, such as 4fdb3sde....0001
 */
app.get('/editProfile/:id', function(req, res) {
	var condition;
	if (/\w/.test(req.params.id)) {
		condition = {_id: req.params.id };
	}
	else {
		condition = {fb_id: req.params.id };
	}

    User.findOne(condition, function(err, user) {
        arr = comm.get_birthday_array(user.birthday);
				console.log('======'+__filename+'======');
				console.log(arr);

        if(arr.length > 0) {
            user.month = arr[1];
            user.day = arr[2];
            user.year = arr[3];
        }
        if(err) { throw err; }
        res.render('users/userProfile', {
			layout: 'wj_layout.jade',
            locals: {
                title: user.username || 'Peoplemelt User Account',
                user:user
            }
        });
    });
});


var pmUser1 = require('./lib/Models/updateProfile').pmUser;
var UserProvider = new pmUser1();

// req.query and req.url work.
app.get('/checkAvailable', function(req, res) {
	// console.log(req.query); // _callback and timestamp need to filt out.
    var cond = {};
    for (var k in req.query) {
        if (/(username|email)/.test(k)) {
            if(/email/.test(k)) {
                cond['email'] = req.query[k];
            }
            else {
                cond[k] = req.query[k];
            }
        }
    }
    console.log(cond);
    User.findOne(cond, function(err, user) {
		if(err) { throw err; }
        console.log(user);
		if (user===null || typeof(user)==='undefined') {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('_callback(\'{code: 0}\')');
    }
		else {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('_callback(\'{code: 1}\')');
    }
	});
});

/**
 * app.resource('facebook', require('./lib/Resources/r_connectFacebook'));
 * app.resource('profile', require('./lib/Resources/r_updateProfile'));
 */
// If all fails, hit em with the 404
app.all('*', function(req, res){
	throw new NotFound;
});

exports.start = function (port, connectionString, callback) {
	var cb = callback || function () {};

	// connect must be inside of any Model file, because we need to do it once and be sure that we have connection in other Model files
	mongoose.connect(connectionString, function (err)
	{
		if (err) {
			console.log(err);
			throw new Error('Unable to connect to MongoDB');
		}

		app.listen(port, cb);
	});
};

if (!module.parent) {
	exports.start(siteConf.port, siteConf.mongohq_url, function () { console.log('Running in '+(process.env.NODE_ENV || 'development')+' mode @ '+siteConf.uri); });
}
