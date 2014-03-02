var m = require('underscore').memoize,
    config = require('getconfig');

function _formatErrors(errors) {
    if (typeof errors === 'string') {
        return errors;
    } else if (errors instanceof Error) {
        return 'System error';
    } else {
        var result = {};
        errors.forEach(function (e) {
            result[e.param] = e.msg;
        });
        return result;
    }
}

module.exports = {

    /**
     * @return {SkinDb}
     */
    db: m(function () {
        return require('./bootstraps/mongoskin');
    }),

    /**
     *
     * @returns {agenda}
     */
    agenda: function () {
        return require('./bootstraps/agenda');
    },

    userService: function () {
        return require('./services/users');
    },
    
    siteService: function(){
    	return require('./services/sites');
    },

    
    paymentService: function (deviceId, userAgent) {
        return require('./services/payments');
    },
    jobsService: function () {
        return require('./services/jobs');
    },
    emailService: function(){
    	return require('./services/email');
    },
    instagram: function (deviceId, userAgent) {
        return new (require('./libs/Instagram'))(deviceId, userAgent);
    },
    authMiddleware: function (needGuest) {
        return function (req, resp, next) {
            var isGuest = !req.session.userId;

            if (needGuest && !isGuest) {
                resp.redirect('/');
                return;
            }

            if (!needGuest && isGuest) {
                resp.redirect('/pingjs');
                return;
            }
            next();
        };
    },

    jsonResponse: {
        data: function (data) {
            return {
                status: 'ok',
                data: data
            }
        },
        error: function (message) {
            return {
                status: 'error',
                message: _formatErrors(message)
            };
        },
        redirect: function (url) {
            return {
                status: 'redirect',
                url: url
            };
        }
    }
};