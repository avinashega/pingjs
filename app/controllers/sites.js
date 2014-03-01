var check = require('validator');
var i = require('../i');
var _checkAuth = i.authMiddleware;

module.exports = {
	postsite: function(req, resp) {
		console.log(req.body);
		i.siteService().addSite(req).then(function(site){
			if(!site || site.length < 1){
				console.log('Internal server error');
				resp.json(jsonResponse.error('Internal server error.'));
			} else {
				resp.json(jsonResponse.data('Site added successfully.'));
			}
		}).fail(function(err){
			console.log(err);
			resp.json(jsonResponse.error(err));
		});
	},
	
	deletesite: function(req, resp){
		i.siteService().deleteSite(req).then(function(){
			resp.json(jsonResponse.data('Site removed successfully.'));
		}).fail(function(err){
			console.log(err);
			resp.json(jsonResponse.error(err));
		});
	},
	
	routes: function(app){
		app.post('/postsite', _checkAuth(false), this.postsite);
		app.post('/deletesite', _checkAuth(false), this.deletesite);
	}
}