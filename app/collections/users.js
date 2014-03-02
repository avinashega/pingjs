var crypto = require('crypto');
var ObjectId = require('mongoskin').ObjectID;
function _hash(str) {
    var HASH_SALT = "nmjASD(8alma091231";

    return crypto.createHash('md5')
        .update(str)
        .update(HASH_SALT)
        .digest('hex');
}

function _first(cb) {
    return function (err, res) {
        cb(err, res && res[0]);
    }
}

/**
 * User schema {
 *  _id: String,
 *  login: String,
 *  password: String,
 *  email: String,
 *  company: String,
 *  firstName: String,
 *  lastName: String,
 *  active: bool,
 *  key: String
 * }
 *
 * @param {SkinDb} db
 */
module.exports = function (db) {
    db.bind('users', {

        signUp: function (data, cb) {
            data.password = data.password && _hash(data.password);
            data.created_at = Math.round(+new Date()/1000);
            data.passwordRepeat = 0;
            data.active= true;
            data.confirmed = false;
            data.confirm_token = _hash(JSON.stringify(data) + "98asdl)_*(#");
            this.insert(data, _first(cb));
        },

        getByLoginAndPassword: function (login, password, cb) {
            password = password && _hash(password);
            this.findOne({$or:[{username: login},{email:login}], password: password}, cb);
        },

        getByLogin: function (username, email, cb) {
            this.findOne({$or:[{username: username},{email:email}]}, cb);
        },
        
        getById: function (id, cb) {
            this.findOne({_id: ObjectId.createFromHexString(id)}, cb);
        },

        activateUser: function (token, cb) {
            this.findAndModify({confirm_token: token},
                [
                    ['_id', 'asc']
                ],
                {$set: {confirmed: true}}, {}, cb
            );
        },
        updateSubscription: function(id,subscription, cb){
        	this.findAndModify({_id: ObjectId.createFromHexString(id)}, 
        		[
        		 ['_id', 'asc']
        	    ],                 
                {$set: {subscription: subscription, plan: subscription.subscription.plan_id}}, {}, cb);
        },
        cancelSubscription: function(id, cb){
        	this.findAndModify({_id: ObjectId.createFromHexString(id)}, 
            		[
            		 ['_id', 'asc']
            	    ],                 
                    {$set: {subscription: null}}, {}, cb);
        },
        updateUser: function(id, params, cb){
        	this.findAndModify({_id: ObjectId.createFromHexString(id)}, 
            		[
            		 ['_id', 'asc']
            	    ],                 
                    {$set: {email:params.email, firstName:params.firstName, lastName:params.lastName, company:params.company}}, {new:true}, cb);
        },
        
        changePassword: function(id, password, newpassword, cb){
        	password = password && _hash(password);
        	newpassword = newpassword && _hash(newpassword);

        	this.findAndModify({_id: ObjectId.createFromHexString(id), password:password}, 
            		[
            		 ['_id', 'asc']
            	    ],                 
                    {$set: {password:newpassword}}, {new:true}, cb);
        },

        forgotPassword: function(email, token, cb){
        	this.findAndModify({email: email},
            		[
            		 ['_id', 'asc']
            	    ],
                    {$set: {resetToken:token}}, {new:true}, cb);
        },

        resetPassword: function(token, password, cb){
        	password = password && _hash(password);
        	this.findAndModify({resetToken: token},
            		[
            		 ['_id', 'asc']
            	    ],
                    {$set: {password:password, resetToken:null}}, {new:true}, cb);
        },

        getLoginByEmail: function(email, cb){
        	this.findOne({email:email}, cb);
        }
    });
};
