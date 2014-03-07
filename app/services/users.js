var q = require('q'),
    i = require('../i'),
    c = require('../c'),
    agenda = i.agenda(),
    users = i.db().users,
    crypto = require('crypto'),
    fs = require('fs'),
    handlebars = require('handlebars');

module.exports={
		signup: function(req){
			req.sanitize('username').trim();
	        req.sanitize('email').trim();
	        req.sanitize('company').trim();
	        req.sanitize('firstName').trim();
	        req.sanitize('lastName').trim();

	        req.assert('email', 'Valid email required').isEmail();
	        req.assert('username', 'Your username should be at least 4 characters, and no more than 20.').len(4, 20);
	        req.assert('firstName', 'First name required').notEmpty();
	        req.assert('lastName', 'Last name required').notEmpty();
	        req.assert('password', 'Please use at least 6 characters for your password.').len(6, 100);
	        req.assert('passwordRepeat', 'Your passwords are not equal').equals(req.param('password'));
	        
	        return q.fcall(function () {
	            var errors = req.validationErrors();
	            if (errors) {
	                return q.reject(errors);
	            } else {
	                return req.body;
	            }
	        })
	            .then(function (params) {
	                return q.all([params, q.nbind(users.getByLogin, users)(params.username, params.email)]);
	            })
	            .then(function (res) {
	                var params = res[0],
	                    user = res[1];

	                if (user) {
	                    return q.reject(i.makePromiseError('login', 'A user with this login already exists'));
	                }
	                return q.nbind(users.signUp, users)(params);
	            }).then(function(user){
	            	i.emailService().welcomeEmail(user);
	            	return user;
	            });
		},
		activateUser: function(token){
			return q.nbind(users.activateUser, users)(token).then(function(user){
				return user[0];
			});
		},
		signin: function(req){
			return q.nbind(users.getByLoginAndPassword, users)(req.body.username, req.body.password).then(function(user){
				if(!user){
					return q.reject('Incorrect username/password');
				} else if(user.confirmed != true){
					return q.reject('Please verify your account. A verification email has already been sent to your registered mail id.');
				}
				return user;
			});
		},
		
		getById: function(id){
			return q.nbind(users.getById, users)(id);
		},
	    updateUser: function(id, req){
	        req.sanitize('email').trim();
	        req.sanitize('company').trim();
	        req.sanitize('firstName').trim();
	        req.sanitize('lastName').trim();

	        req.assert('email', 'Valid email required').isEmail();
	        req.assert('firstName', 'First name required').notEmpty();
	        req.assert('lastName', 'Last name required').notEmpty();
	        
	        return q.fcall(function () {
	            var errors = req.validationErrors();
	            if (errors) {
	                return q.reject(errors);
	            } else {
	                return req.body;
	            }
	        }).then(function(params){
	        	return q.nbind(users.updateUser, users)(id, params);
	        });
	    },
	    changePassword: function(id, req){
	    	req.assert('newpassword', 'Please use at least 6 characters').len(6, 100);
	    	req.assert('newpasswordRepeat', 'Your passwords are not equal').equals(req.param('newpassword'));
	        req.assert('password', 'Passwords are equal').equals(req.param('newpassword'));
	        return q.fcall(function () {
	            var errors = req.validationErrors();
	            if (errors) {
	                return q.reject(errors);
	            } else {
	                return req.body;
	            }
	        }).then(function(params){
	        	return q.nbind(users.changePassword, users)(id, req.body.password, req.body.newpassword);
	        });
	    },
	    forgotPassword: function(req){
	    	req.sanitize('email').trim();
	    	req.assert('email', 'Valid email required').isEmail();
	    	 return q.fcall(function () {
	             var errors = req.validationErrors();
	             if (errors) {
	                 return q.reject(errors);
	             } else {
	                 return req.body;
	             }
	         }).then(function(params){
	        	 var deferred = q.defer();
	        	 crypto.randomBytes(18, function(ex, buf) {
	        		 var token = buf.toString('hex');
	        		 deferred.resolve(q.nbind(users.forgotPassword, users)(params.email, token));
	        	 });
	        	 return deferred.promise;
	         }).then(function(params){
	        	 i.emailService().resetEmail(params[0]);
	         	return params[0];
	         });
	    },

	    resetPassword: function(req){
	    	req.assert('newPassword', 'Please use at least 6 characters').len(6, 100);
	        req.assert('repeatNewPassword', 'Passwords are not equal').equals(req.body.newPassword);
	        console.log(req.body.token);
	    	 return q.fcall(function () {
	             var errors = req.validationErrors();
	             if (errors) {
	                 return q.reject(errors);
	             } else {
	                 return req.body;
	             }
	         }).then(function(params){
	        		 return q.nbind(users.resetPassword, users)(params.token, params.newPassword);
	         });
	    }
}