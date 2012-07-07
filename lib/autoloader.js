/*jshint indent: 2, node: true, laxcomma: true */
var fs = require("fs")
	, assert = require("assert")
	, cache = {};

exports.requireDir = function (path) {
	if (cache[path]) { return cache[path]; }

	var result = {};
	fs.readdirSync(__dirname + '/' + path).forEach(function (file) {
		var module = require(__dirname + '/' + path + '/' + file)
			, key
			, moduleName = file.replace(/\.js$/gi, '');
		result[moduleName] = {};
		for (key in module) {
			result[moduleName][key] = module[key];
		}
	});
	cache[path] = result;

	return result;
};

