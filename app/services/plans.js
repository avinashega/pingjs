var i = require('../interface');
var plans = i.db().plans;
var ObjectID = require('mongoskin').ObjectID;
var q = require('q');

module.exports={
		getPlans: function(){
			return q.nbind(plans.findItems, plans)();
		},
		
		getById: function(id){
			return q.nbind(plans.findOne, plans)({_id:ObjectID.createFromHexString(id)});
		},
		
		getByPlanId: function(id){
			return q.nbind(plans.findOne, plans)({planId:id});
		},
		savePlan: function(plan){
			return q.nbind(plans.save, plans)(plan);
		}
}