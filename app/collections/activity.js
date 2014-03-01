
module.exports = function (db) {

    db.bind('activity', { 
    	getByUsername: function(username, cb){
    		this.findItems({username:username}, {sort:[['date',-1]]}, cb);
    	}
    });

};