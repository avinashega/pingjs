function _first(cb) {
    return function (err, res) {
        cb(err, res && res[0]);
    }
}

module.exports = function (db) {

    db.bind('sites', {
    	getByUrlAndAccount: function(url, username, cb){
    		this.findOne({url:url, username:username, active:true}, cb);
    	},
    	
    	getByUsername: function(username, cb){
    		this.findItems({username:username, active:true}, cb);
    	},
    	
    	addSite: function(params, cb){
    		this.insert(params, _first(cb));
    	}

    });

};