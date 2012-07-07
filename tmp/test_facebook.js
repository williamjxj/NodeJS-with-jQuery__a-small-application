/**
 * Created with JetBrains WebStorm.
 * User: william
 * Date: 08/06/12
 * Time: 3:07 PM
 * To change this template use File | Settings | File Templates.
 */
// Fetch the site configuration
var siteConf = require('./lib/getConfig')
    , i18n = require("i18n")
    , mongoose = require('mongoose')
    , mongooseTypes = require('mongoose-types');

mongoose.connect(siteConf.mongohq_url);
mongooseTypes.loadTypes(mongoose);





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

var connect = require('connect');
var express = require('express');
var notifoMiddleware = require('connect-notifo');

// Session store
var options = {
    'port': siteConf.redis_port,
    'host': siteConf.redis_host,
    'pass': siteConf.redis_auth
}

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

app.all('/locale-config.json', function (req, res)
{
    var obj = {
        'edit-title': i18n.__('edit-title')
        , 'edit-content': i18n.__('edit-content')
        , 'fail-loc-title': i18n.__('fail-loc-title')
        , 'fail-loc-content': i18n.__('fail-loc-content')
    }

    res.write(JSON.stringify(obj));
    res.end();
});

app.all('/', function(req, res) {
    // Set example session uid for use with socket.io.
    if (!req.session.uid) {
        req.session.uid = (0 | Math.random()*1000000);
    }

    res.render('index');
});

// If all fails, hit em with the 404
app.all('*', function(req, res){
    throw new NotFound;
});

console.log('Running in '+(process.env.NODE_ENV || 'development')+' mode @ '+siteConf.uri);
