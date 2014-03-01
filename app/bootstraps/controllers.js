var fs = require('fs'),
    express = require('express');

module.exports = function (app, acl) {
    var controllersDir = __dirname + '/../controllers/';
    fs.readdirSync(controllersDir).forEach(function (file) {
            var controller = require(controllersDir + file),
            controllerName = file.replace(/\.js$/, '');
        controller.routes(app, acl);
    });
};