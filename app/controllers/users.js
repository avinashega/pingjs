var i = require('../i');
var _checkAuth = i.authMiddleware;
var jsonResponse = i.jsonResponse,
crypto = require('crypto');

var intercom_api_secret = 'fL8fwuVjhxbdYMnDyPlxAc5XkgDlhc99Y3NWQ7h8';
module.exports={
		index: function(req, resp){
			resp.render('index');
		},
		home: function(req, resp){
			resp.render('home', {username: req.session.username});
		},
		pingjs: function(req, resp){
			resp.render('pingjs');
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
					req.session.username = user.username;
					req.session.name = user.firstName+' '+user.lastName;
					req.session.createdAt = user.created_at;
					req.session.email = user.email;
					user.encryptedemail = crypto.createHmac('sha256', intercom_api_secret).update(user.email.toString()).digest('hex');
    				req.session.userhash = user.encryptedemail;
					resp.json(jsonResponse.redirect('/home'));
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
					req.session.username = user.username;
					req.session.name = user.firstName+' '+user.lastName;
					req.session.createdAt = user.created_at;
					req.session.email = user.email;
					user.encryptedemail = crypto.createHmac('sha256', intercom_api_secret).update(user.email.toString()).digest('hex');
    				req.session.userhash = user.encryptedemail;
					resp.redirect('/home');
				}
			}).fail(function(err){
				console.log(err);
				resp.render('message', {message:err});
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
		signout: function(req, resp){
	        req.session.destroy();
	        resp.redirect('/signin');
		},
		emailConfirmation: function(req, resp){
			resp.render('message', {message:"A confirmation has been sent to your registered mail address. Please verify."});
		},
		routes: function(app){
			app.get('/', _checkAuth(true),this.index);
			app.get('/home', _checkAuth(false),this.home);
			app.get('/signup', _checkAuth(true), this.signup);
			app.get('/signin', this.signin);
			app.post('/signup', this.signupAction);
			app.post('/signin', this.signinAction);
			app.get('/activate/:token', this.activate);
			app.post('/forgotPassword', this.forgotPassword);
			app.get('/signout', this.signout);
			app.get('/emailConfirmation', this.emailConfirmation);
			app.get('/pingjs', this.pingjs);
		}
}