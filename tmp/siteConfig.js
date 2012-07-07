var settings = {
	'sessionSecret': 'sessionSecret'
	, 'port': 8080
	, 'uri': 'http://localhost:8080' // Without trailing /
	, langs: [ 'en', 'ru' ]
    , 'redis_host': 'panga.redistogo.com'
    , 'redis_port': '9137'
    , 'redis_auth': 'a9ef25d5a8b5b3ca268e836aa5a5ad14'
    // 'redis_server': 'redis://peoplemelt:a9ef25d5a8b5b3ca268e836aa5a5ad14@panga.redistogo.com:9137/'

    , 'mongohq_url': 'mongodb://pm_admin:pech0nka@flame.mongohq.com:27039/pm_test'
    , 'mongolocal_url': 'mongodb://localhost/peoplemelt'


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
			appId: '442297625788094',
			appSecret: '47425b91184d9464bcbdb3a287db63bb'
		}
        , 'google': {
			appId: 'AIzaSyAH_spWKm1Eu5ghelSE74kS2us50Hok_Og'
		}
        /*
		, 'twitter': {
			consumerKey: 'eA54JQ6rtdZE7nqaRa6Oa',
			consumerSecret: '6u2makgFdf4F6EauP7osa54L34SouU6eLgaadTD435Rw'
		}
        */
  }
    // node_modules/everyauth/lib/step.js: this.debug
    //  everyauth.debug = true;
	, 'debug': (process.env.NODE_ENV !== 'production')
	, streamLength: 10
};

if (process.env.NODE_ENV == 'qa') {
    settings.uri = 'http://peoplemelt.jit.su';
    settings.port = process.env.PORT || 80;

    settings.external.facebook = {
			'appId': '442297625788094',
			'appSecret': '47425b91184d9464bcbdb3a287db63bb'
      //appId: '194915770634421',
      //appSecret: 'c75e21ec43bdafeb0aefa2934a76e8a6'
    }
}

if (process.env.NODE_ENV == 'production') {
	settings.uri = 'http://yourname.no.de';
	settings.port = process.env.PORT || 80; // Joyent SmartMachine uses process.env.PORT

	//settings.airbrakeApiKey = '0190e64f92da110c69673b244c862709'; // Error logging, Get free API key from https://airbrakeapp.com/account/new/Free
}
module.exports = settings;


