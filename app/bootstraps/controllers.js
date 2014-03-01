var fs = require('fs'),
    express = require('express');

module.exports = function (app, acl) {
    var controllersDir = __dirname + '/../controllers/',
        viewsDir = __dirname + '/../views/';
    fs.readdirSync(controllersDir).forEach(function (file) {
            var controller = require(controllersDir + file),
            controllerName = file.replace(/\.js$/, '');
        app.set('views', viewsDir + controllerName + '/');
        controller.routes(app, acl);
    });
};