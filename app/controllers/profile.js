var i= require('../i');
var  _checkAuth = i.authMiddleware;
var jsonResp = i.jsonResponse;
module.exports={
		profile: function(req, res){
			i.userService().getById(req.session.userId).then(function(user){
					res.render('profile', {user: user, username:req.session.username});
			}).fail(function(err){
				console.log(err)
				res.render('profile', {username:req.session.username});
			});
		},
		
		update: function(req, res){
			var id= req.session.userId;
			i.userService().updateUser(id, req).then(function(user){
				res.json(jsonResp.data('success'));
			}).fail(function(err){
				console.log(err);
				res.json(jsonResp.error(err));
			});
		},
		changePassword: function(req, resp){
			i.userService().changePassword(req.session.userId, req).then(function(user){
				if(!user || user.length <1 ){
					resp.json(jsonResp.error('Internal server error. Failed to Change Password.'));
				} else {
					resp.json(jsonResp.data('Password Changed Successfully.'));
				}
			}).fail(function(err){
				console.log(err);
				resp.json(jsonResp.error(err));
			});
		},
		
		forgotPassword: function(req, resp){
			i.userService().forgotPassword(req).then(function(token){
				if(!token){
					resp.json(jsonResp.error('Internal server error. Failed to send verification token.'));
				} else {
					resp.json(jsonResp.data('Please check your email for verification link.'));
				}
			}).fail(function(err){
				console.log(err);
				resp.json(jsonResp.error(err));
			});
			
		},
		resetPassword: function(req, res){
			i.userService().resetPassword(req).then(function(user){
				if(user && user.length > 0 && user[0]){
				res.json(jsonResp.data('Your password is successfully reset.'));
				} else {
					res.json(jsonResp.error('Invalid password reset token.'));
				}
			}).fail(function(err){
				res.json(jsonResp.error(err));
			})
		},

		routes: function(app){
			app.get('/profile', _checkAuth(false), this.profile);
			app.post('/profile/update', _checkAuth(false), this.update);
			app.post('/profile/changePassword', this.changePassword);
			app.post('/profile/forgotPassword', this.forgotPassword);
			app.post('/profile/reset', _checkAuth(true), this.resetPassword);
		}
};