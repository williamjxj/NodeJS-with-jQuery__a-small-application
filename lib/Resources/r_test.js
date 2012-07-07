/**
 * Created with JetBrains WebStorm.
 * User: william
 * Date: 17/06/12
 * Time: 7:17 PM
 * To change this template use File | Settings | File Templates.
 */

exports.user = function(req, res) {
    if(siteConf.debug) {
        //console.log(session);
        //console.log(util.inspect(cookies));
    }
    res.render('index');
};

// directly use: localhost:8080/test1, register,user
exports.test1 = function (req, res) {
    res.render('register');
};

exports.test2 = function(req, res) {
  res.render('test2')
};

exports.load = function(req, id, fn) {

};