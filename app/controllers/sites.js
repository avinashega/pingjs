var check = require('validator');
var i = require('../i');
var _checkAuth = i.authMiddleware;
var jsonResponse = i.jsonResponse;
var q = require('q');

module.exports = {
	postsite: function(req, resp) {
		console.log(req.body);
		i.siteService().addSite(req).then(function(site){
			console.log(site);
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
		i.siteService().deleteSite(req.body.id).then(function(){
			resp.json(jsonResponse.data('Site removed successfully.'));
		}).fail(function(err){
			console.log(err);
			resp.json(jsonResponse.error(err));
		});
	},
	
	list: function(req, resp){
		i.siteService().getByUsername(req.session.username).then(function (sites) {
			console.log(sites);
            return q.nbind(resp.render, resp)('_siteList', {sites: sites});
        })
        .then(function (html) {
            resp.json(jsonResponse.data(html));
        })
        .fail(function (errors) {
        	console.log(errors);
            resp.json(jsonResponse.error('Sorry, System error'));
        })
        .done();
	},
	
	sites: function(req, resp){
            resp.render('sites', {username: req.session.username});
	},
	managelist: function(req, resp){
		i.siteService().getByUsername(req.session.username).then(function (sites) {
			console.log(sites);
            return q.nbind(resp.render, resp)('_manageSiteList', {sites: sites});
        })
        .then(function (html) {
            resp.json(jsonResponse.data(html));
        })
        .fail(function (errors) {
        	console.log(errors);
            resp.json(jsonResponse.error('Sorry, System error'));
        })
        .done();
	},
	
	activity: function(req, resp){
		i.siteService().getActivity(req.session.username).then(function(activity){
			console.log(activity);
			resp.render('activity', {activity:activity, username:req.session.username});
		}).fail(function(err){
			console.log(err);
			resp.render('activity',{username:req.session.username});
		});
	},
	editsite: function(req, resp){
		i.siteService().updateSite(req).then(function(site){
			resp.json(jsonResponse.data('success'));
		}).fail(function(err){
			console.log(err);
            resp.json(jsonResponse.error(err));
		});
	},
	
	routes: function(app){
		app.post('/sites/add', _checkAuth(false), this.postsite);
		app.post('/sites/remove', _checkAuth(false), this.deletesite);
		app.post('/sites/edit', _checkAuth(false), this.editsite);
		app.get('/sites/list', _checkAuth(false), this.list);
		app.get('/manageSites/list', _checkAuth(false), this.managelist);
		app.get('/sites', _checkAuth(false), this.sites);
		app.get('/activity', _checkAuth(false), this.activity);
	}
}