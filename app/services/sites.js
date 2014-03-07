var q = require('q');
var ObjectId = require('mongoskin').ObjectID;
var i = require('../i');
var agenda = i.agenda();
var sites = i.db().sites;
var jobs = i.db().agendaJobs;
var activity = i.db().activity;

module.exports={
	addSite: function(req){
		req.sanitize('protocol').trim();
        req.sanitize('url').trim();
        req.sanitize('port').trim();
        req.sanitize('frequency').trim();
        req.sanitize('method').trim();
        req.sanitize('path').trim();
        req.sanitize('responsiveness').trim();

        req.assert('url', 'Valid URL required').regex(/^(?=.{1,254}$)((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}$/i);
        if(req.body.port != "")
        	req.assert('port', 'Valid port required').regex(/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/);
        req.assert('frequency', 'Frequency should be an integer greater than 0').regex(/^[1-9]\d*$/);
        if(req.body.responsiveness != '')
        	req.assert('responsiveness', 'Responsiveness should be an integer greater than 0').regex(/^[1-9]\d*$/);
		return q.fcall(function () {
            var errors = req.validationErrors();
            if (errors) {
                return q.reject(errors);
            } else {
                return req.body;
            }
        }).then(function(body){
        	return i.userService().getById(req.session.userId).then(function(user){
	        	return i.siteService().getByUsername(user.username).then(function(userSites){
	        		console.log(userSites);
	        		if(user.subscription == null || user.subscription.state != 'active'){ //new user
	        			if(userSites.length < 3){
	        				console.log('three free checks');
	        				body.username = user.username;
	        				body.active = true;
	        				body.averageResponseTime = 0;
	        				return q.nbind(sites.addSite, sites)(body);
	        			} else {
	        				return q.reject('Site limit Reached. Upgrade your plan from the <a href="/profile">profile</a> page');
	        			}	        			
	        		}
	        		return i.planService().getByPlanId(user.subscription.subscription_plan_id).then(function(plan){
	        			console.log(userSites.length);
	        			if(userSites.length >= plan.limit){
	        				return q.reject('Site limit Reached. Upgrade your plan from the <a href="/profile">profile</a> page');
	        			} else {
	        				//TODO
	        				//return q.nbind(sites.insert, sites)({url:body.site, frequency:5, account:req.user.username, active:true});
	        			}
	        		});
	        	});
        	});
        	
        }).then(function(site){
        	console.log(site);
            	var job = agenda.create('ping', {_id:site._id});
            	job.repeatEvery(site.frequency+' minutes');
            	q.nbind(job.save, job)();
            	q.nbind(activity.save, activity)({date:Date.now(), username:site.username, activity:'Check Created for '+site.url});
            	return site;
        });
	},
	
	deleteSite: function(id){
		return q.fcall(function () {
        	return q.nbind(sites.findAndModify, sites)({_id:ObjectId(id)}, [ ['_id', 'asc'] ],{$set:{active:false}}, {new:true});
        }).then(function(site){
        	q.nbind(activity.save, activity)({date:Date.now(), username:site[0].username, activity:'Check deleted for '+site[0].url});
        	return q.nbind(jobs.remove, jobs)({'data._id':site[0]._id});
        });
	},
	
	getSiteByUrlAndAccount: function(url, account){
		return q.nbind(sites.getByUrlAndAccount, sites)(url, account);
	},
	
	getByUsername: function(username){
		return q.nbind(sites.getByUsername, sites)(username);
	},
	getActivity: function(username){
		return q.nbind(activity.getByUsername, activity)(username);
	},
	updateSite: function(req){
		req.sanitize('protocol').trim();
        req.sanitize('url').trim();
        req.sanitize('port').trim();
        req.sanitize('frequency').trim();
        req.sanitize('path').trim();
        req.sanitize('responsiveness').trim();

        req.assert('url', 'Valid URL required').regex(/^(?=.{1,254}$)((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}$/i);
        if(req.body.port != "")
        	req.assert('port', 'Valid port required').regex(/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/);
        req.assert('frequency', 'Frequency should be an integer greater than 0').regex(/^[1-9]\d*$/);
        if(req.body.responsiveness != '')
        	req.assert('responsiveness', 'Responsiveness should be an integer greater than 0').regex(/^[1-9]\d*$/);
		return q.fcall(function () {
            var errors = req.validationErrors();
            if (errors) {
                return q.reject(errors);
            } else {
                return req.body;
            }
        }).then(function(body){
        	return q.nbind(sites.findAndModify, sites)({_id:ObjectId(body.id)}, [ ['_id', 'asc'] ],{$set:{protocol:body.protocol, url:body.url, port:body.port, path:body.path, frequency:body.frequency, responsiveness:body.responsiveness}}, {new:true});
        	
        }).then(function(site){
            	q.nbind(jobs.findAndModify, jobs)({'data._id':site[0]._id}, [ ['_id', 'asc'] ],{$set:{repeatInterval:site[0].frequency+" minutes"}}, {new:true});
            	q.nbind(activity.save, activity)({date:Date.now(), username:site[0].username, activity:'Check Updated for '+site[0].url});
            	return site[0];
        });
	}
}