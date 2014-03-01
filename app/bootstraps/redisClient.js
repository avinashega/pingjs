var redisUrl = require('redis-url'),
    cfg = require('getconfig');
var url = cfg.redis.uri;

module.exports = redisUrl.connect(url);