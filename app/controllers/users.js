var i = require('../i');
var _checkAuth = i.authMiddleware;
var jsonResponse = i.jsonResponse;
module.exports={
		index: function(req, resp){
			resp.render('index');
		},
		signup: function(req, resp){
			resp.render('signup');
		},
		signin: function(req, resp){
			resp.render('signin');
		},
		signupAction: function(req, resp){
			i.userService().signup(req).then(function(user){
				if(!user || user.length < 1){
					console.log('user signup failure ALERT');
					resp.json(jsonResponse.error('Failed to Signup. Internal Server Error'));
				} else {
					resp.json(jsonResponse.redirect('/emailConfirmation'));
				}
			}).fail(function(err){
				console.log(err);
				resp.json(jsonResponse.error(err));
			});
		},
		signinAction: function(req, resp){
			i.userService().signin(req).then(function(user){
				console.log(user);
				if(!user || user.length < 1){
					resp.json(jsonResponse.error('Incorrect username/password.'));
				} else {
					req.session.userId = user._id.toString();
					resp.json(jsonResponse.redirect('/'));
				}
			}).fail(function(err){
				console.log(err);
				resp.json(jsonResponse.error(err));
			});
		},
		activate: function(req, resp){
			i.userService().activateUser(req.params.token).then(function(user){
				if(!user){
					resp.render('message', {message:"Internal Server Error. Activation Failed."});
				} else {
					req.session.userId = user._id.toString();
					resp.redirect('/');
				}
			}).fail(function(err){
				console.log(err);
				resp.render('message', {message:err});
			});
		},
		changePassword: function(req, resp){
			i.userService().changePassword(req).then(function(user){
				if(!user || user.length <1 ){
					resp.json(jsonResponse.error('Internal server error. Failed to Change Password.'));
				} else {
					resp.json(jsonResponse.data('Password Changed Successfully.'));
				}
			}).fail(function(err){
				console.log(err);
				resp.json(jsonResponse.error(err));
			});
		},
		forgotPassword: function(req, resp){
			i.userService().forgotPassword(req).then(function(token){
				if(!token){
					resp.json(jsonResponse.error('Internal server error. Failed to send verification token.'));
				} else {
					resp.json(jsonResponse.data('Please check your email for verification link.'));
				}
			}).fail(function(err){
				console.log(err);
				resp.json(jsonResponse.error(err));
			});
			
		},
		updateProfile: function(req, resp){
			i.userService().updateProfile(req).then(function(user){
				if(!user || user.length < 1){
					resp.json(jsonResponse.error('Internal server error. Update profile failed.'));
				} else {
					resp.json(jsonResponse.data('Profile updated successfully.'));
				}
			}).fail(function(err){
				resp.json(jsonResponse.error(err));
			})
		},
		signout: function(req, resp){
	        req.session.destroy();
	        resp.redirect('/signin');
		},
		profile: function(req, resp){
			
		},
		emailConfirmation: function(req, resp){
			resp.render('message', {message:"A confirmation has been sent to your registered mail address. Please verify."});
		},
		routes: function(app){
			app.get('/', _checkAuth(false),this.index);
			app.get('/signup', _checkAuth(true), this.signup);
			app.get('/signin', this.signin);
			app.post('/signup', this.signupAction);
			app.post('/signin', this.signinAction);
			app.get('/activate/:token', this.activate);
			app.post('/forgotPassword', this.forgotPassword);
			app.post('/changePassword', this.changePassword);
			app.post('/updateUser', this.updateProfile);
			app.get('/profile', this.profile);
			app.get('/signout', this.signout);
			app.get('/emailConfirmation', this.emailConfirmation);
		}
}