var express = require('express'),
    config = require('getconfig'),
    expressValidator = require('express-validator'),
    path = require('path'),
    app = express();
var ipaddr  = process.env.IP || "0.0.0.0";
var port    = process.env.PORT || 8000;

app.configure('development', function () {
    app.use(express.logger('dev'));
});

app.configure(function () {
    console.log('starting web worker on ' + ipaddr + ':' + port);
    //just touch it, to check mongodb connection
    console.log('mongodb at ' + config.mongodb.uri);
    require('./app/bootstraps/mongoskin');
    console.log('mongo OK');

    app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
    console.log('A');
    app.use(express.static('public'));
    console.log('B');
    require('./app/bootstraps/handlebars')(app);
    console.log('1');
    app.use(express.favicon());
    console.log('2');
    app.use(express.limit('5mb'));
    app.use(express.urlencoded({limit: '5mb'}));
    app.use(express.multipart({limit: '5mb'}));
    app.use(express.json({limit: '5mb'}));
    console.log('3');
    app.use(express.cookieParser(config.http.cookieSecret));
    app.use(expressValidator());
    console.log('4');
    app.use(express.methodOverride());
    console.log('redis start');
    require('./app/bootstraps/session')(app);
    console.log('redis OK');
    app.use(function(req,resp,next) {
        resp.locals.session = req.session;
        return next();
    });
    console.log('start router');
    app.use(app.router);

    require('./app/bootstraps/controllers')(app);
    require('./app/bootstraps/errors')(app);
    var agenda = require('./app/bootstraps/agenda');
    require('./app/bootstraps/agenda-jobs')(agenda);
    console.log('start newrelic on job worker');
    require('newrelic');
    console.log('finished starting newrelic on job worker');
    console.log('started');
});

app.listen(port,ipaddr);

module.exports = app;