/**
 * Created with JetBrains WebStorm.
 * User: william
 * Date: 17/06/12
 * Time: 6:32 PM
 * To change this template use File | Settings | File Templates.
 */

// ref: nodejs.org/api/modules.html#modules_modules
// ISO-8601: Date	2012-06-10

exports.get_current_datetime = function() {
    var dt = new Date();
    return dt.getFullYear() + '-' + (dt.getMonth()+1) + '-' + dt.getDate();
    return dt.getFullYear() + '-' + (dt.getMonth()+1) + '-' + dt.getDate + ' '
        + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
};

Date.prototype.monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];

Date.prototype.getMonthName = function() {
    return this.monthNames[this.getMonth()];
};
Date.prototype.getShortMonthName = function () {
    return this.getMonthName().substr(0, 3);
};

exports.get_birthday_array = function(birthday) {
    if(birthday===null || birthday === undefined || (typeof birthday === 'undefined')) {
        return new Array();
    }
    var b = new Date(birthday);
    var d = ("0" + (b.getDate())).slice(-2);
    return [ b.toDateString(), b.getShortMonthName(), d, b.getFullYear() ];
}

//re = new RegExp(/(\d{4})-(\d{1,2})-(\d{1,2})/);
//re = new RegExp(/,\s+(\d{1,2})\s+(\w{3})\s+(\d{4})/);
// Object: Tue, 03 Feb 2004 00:00:00 GMT
exports.get_birthday_array_old = function (birthday) {
    if(birthday===null || birthday === undefined || (typeof birthday === 'undefined')) {
        return new Array();
    }
    var bd = '', arr = new Array();
    if(typeof birthday == 'object') {
        bd = birthday.toString();  // it's a object, can't use match() directly.
    }
    else {
        bd = birthday; // +'': force to string. suppose it is a String object.
    }

    // String: 'Mon Feb 02 2004 16:00:00 GMT-0800 (PST)'
    re = new RegExp(/(?:\w{3})\s+(\w{3})\s+(\d{1,2})\s+(\d{4})/);
    arr = bd.match(re);

    if(arr.length === 0 || typeof arr == 'undefined') {
        //  Mon, 10 Jan 2000 00:00:00 GMT
        re = new RegExp(/(\d{1,2})\s+(\w{3})\s+(\d{4})/);
        arr = bd.match(re);
    }
    return arr;
};


var conf = require('./getConfig.js');

exports.get_mongohq_url = function() {
    return conf.mongolocal_url;
};

exports.get_redis_server = function() {
    return {
        'port': conf.redis_port
        , 'host': conf.redis_host
        , 'pass': conf.redis_auth
    }
};

exports.get_facebook_info = function() {
    return {
        'appId': conf.external.appId
        , 'appSecret': conf.external.appSecret
    }
};
