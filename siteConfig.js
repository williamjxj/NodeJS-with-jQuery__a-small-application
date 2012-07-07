var settings = {
	'sessionSecret': 'sessionSecret'
	, 'port': 8080
	, 'uri': 'http://localhost:8080' // Without trailing /
	, langs: [ 'en', 'cn' ]
    , 'redis_host': 'panga.redistogo.com'
    , 'redis_port': '9137'
    , 'redis_auth': 'a9ef25d5a8b5b3ca268e836aa5a5ad14'

    , 'mongohq_url': 'mongodb://william:william@flame.mongohq.com:27039/test'
    , 'mongolocal_url': 'mongodb://localhost/williamjxj'
	, 'mongohq_url_fixt': 'mongodb://pm_admin:pech0nka@flame.mongohq.com:27047/pm_fixtures'


	// You can add multiple recipiants for notifo notifications
	, 'notifoAuth': null /*[
		{
			'username': ''
			, 'secret': ''
		}
	]*/

	// Enter API keys to enable auth services, remove entire object if they aren't used.
	, 'external': {
		'facebook': {
			appId: '123456677',
			appSecret: '5b91184d9464bcbdb3a287db63bb'
		}
  }
	, 'debug': (process.env.NODE_ENV !== 'production')
	, streamLength: 100
	, postsWaitingTime: 700
	, qa: {
		username: "test"
		, pass: "test"
	}
};

if (process.env.NODE_ENV == 'qa') {
    settings.port = process.env.PORT || 80;*/

    settings.external.facebook = {
      appId: '1234567890',
      appSecret: 'cc43bdafeb0aefa2934a76e8a6'
    }
};

if (process.env.NODE_ENV == 'production') {
	settings.uri = 'http://yourname.no.de';
	settings.port = process.env.PORT || 80; // Joyent SmartMachine uses process.env.PORT
};

module.exports = settings;


