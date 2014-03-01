var express = require('express'),
    RedisStore = require('connect-redis')(express),
    redisClient = require('./redisClient'),
    cfg = require('getconfig');

module.exports = function (app) {
    app.use(express.session({
        store: new RedisStore({client: redisClient}),
        secret: cfg.http.sessionSecret,
        cookie: {maxAge: 3600000} // 1 hour
    }));
};