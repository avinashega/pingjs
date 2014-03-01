var fs = require('fs'),
	q = require('q'),
	i = require('../i'),
	c = require('../c'),
	agenda = i.agenda(),
	config = require('getconfig'),
	handlebars = require('handlebars');
var welcome, reset, success, error, authErr, locationErr, alert, postAlert;
module.exports = {
		welcomeEmail: function(user){
			if(!welcome) {
				var templateFile = fs.readFileSync('app/views/emails/welcome.hbs', 'utf8');
			 	welcome = handlebars.compile( templateFile );
			}
			var html = welcome({user:user, host:config.http.host});
        	var jobData = {
                    html: html,
                    text: 'Welcome to Schedugram',
                    subject: 'Welcome to Schedugram',
                    from_email: config.emails.info,
                    from_name: 'Schedugram',
                    to:[{
                    	email: user.email,
                    	name: user.firstName+' '+user.lastName,
                    	type: 'to'
                    }]                        
                },
                job;
            console.log('saving welcome email job');
            job = agenda.create(c.JOB_TYPE.CONFIRMATION_EMAIL, jobData);
            q.nbind(job.save, job)();
		},
		resetEmail: function(user){
			if(!reset){
				var templateFile = fs.readFileSync('app/views/emails/resetPassword.hbs', 'utf8');
			 	reset = handlebars.compile( templateFile );
			}
			var html = reset({user:user});
			var jobData = {
                    html: html,
                    text: 'Reset Password',
                    subject: 'Schedugram Password Reset Request',
                    from_email: config.emails.info,
                    from_name: 'Schedugram',
                    to:[{
                    	email: user.email,
                    	name: user.firstName+' '+user.lastName,
                    	type: 'to'
                    }]                        
                },
                job;
            console.log('saving reset email job');
            job = agenda.create(c.JOB_TYPE.CONFIRMATION_EMAIL, jobData);
            return q.nbind(job.save, job)();
		},
		
		postSuccess: function(user, job, link){
			console.log('Successful post email');
            if(!success){
				var templateFile = fs.readFileSync('app/views/emails/postPhotoSuccess.hbs', 'utf8');
				success = handlebars.compile( templateFile );
			}
			var html = success({user:user, job:job, link: link});
			var jobData = {
                    html: html,
                    text: 'Post Successful',
                    subject: 'Schedugram: your post was successful',
                    from_email: config.emails.info,
                    from_name: 'Schedugram',
                    to:[{
                    	email: user.email,
                    	name: user.firstName+' '+user.lastName,
                    	type: 'to'
                    }]                        
                },
                job;
            console.log('saving successful post job');
            job = agenda.create(c.JOB_TYPE.CONFIRMATION_EMAIL, jobData);
            q.nbind(job.save, job)();
		},
		
		postError: function(user, job){
            console.log('Error post email');
			if(!error){
				var templateFile = fs.readFileSync('app/views/emails/postPhotoError.hbs', 'utf8');
				error = handlebars.compile( templateFile );
			}
			var html = error({user:user, job:job});
			var jobData = {
                    html: html,
                    text: 'Error in Posting to Instagram',
                    from_email: config.emails.info,
                    subject: '[IMP] Error posting your Schedugram image',
                    from_name: 'Schedugram',
                    to:[{
                    	email: user.email,
                    	name: user.firstName+' '+user.lastName,
                    	type: 'to'
                    },
                        {
                            email: config.emails.error,
                            name: 'Schedugr.am',
                            type: 'cc'
                        }]
                },
                job;
            console.log('saving post error job');
            job = agenda.create(c.JOB_TYPE.CONFIRMATION_EMAIL, jobData);
            q.nbind(job.save, job)();
		},
		
		postAuthenticationError: function(user, job){
            console.log('Post authentication email error.');
			if(!authErr){
				var templateFile = fs.readFileSync('app/views/emails/authenticationError.hbs', 'utf8');
				authErr = handlebars.compile( templateFile );
			}
			console.log(user);
			var html = authErr({user:user, job:job});
			var jobData = {
                    html: html,
                    text: 'You have entered an incorrect Instagram login',
                    subject: 'Schedugram error: Incorrect login',
                    from_email: config.emails.info,
                    from_name: 'Schedugram',
                    to:[{
                    	email: user.email,
                    	name: user.firstName+' '+user.lastName,
                    	type: 'to'
                    }]                        
                },
                job;
            console.log('saving post auth error job');
            job = agenda.create(c.JOB_TYPE.CONFIRMATION_EMAIL, jobData);
            q.nbind(job.save, job)();
		},
		
		postInsecureLoginLocationError: function(user, job){
            console.log('Post insecure login location email');
			if(!locationErr){
				var templateFile = fs.readFileSync('app/views/emails/insecureLocationError.hbs', 'utf8');
				locationErr = handlebars.compile( templateFile );
			}
			var html = locationErr({user:user, job:job});
			var jobData = {
                    html: html,
                    text: 'Your Instagram password was reset.',
                    subject: 'Schedugram error: Password reset',
                    from_email: config.emails.info,
                    from_name: 'Schedugram',
                    to:[{
                    	email: user.email,
                    	name: user.firstName+' '+user.lastName,
                    	type: 'to'
                    }]                        
                },
                job;
            console.log('saving job');
            job = agenda.create(c.JOB_TYPE.CONFIRMATION_EMAIL, jobData);
            q.nbind(job.save, job)();
		},

		alertEmail: function(user, job, params){
			if(!alert){
				var templateFile = fs.readFileSync('app/views/emails/alert.hbs', 'utf8');
				alert = handlebars.compile( templateFile );
			}
			var html = alert({user:user, job:job, link:params[0], caption:params[1]});
			var jobData = {
                    html: html,
                    text: 'Captions do not match',
                    subject: 'Media Update error',
                    from_email: config.emails.info,
                    from_name: 'Schedugram',
                    to:[{
                    	email: config.emails.error,
                    	name: 'Schedugr.am',
                    	type: 'to'
                    }]                        
                },
                job;
            console.log('saving job');
            job = agenda.create(c.JOB_TYPE.CONFIRMATION_EMAIL, jobData);
            q.nbind(job.save, job)();
		},
		
		postAlert: function(user, job, params){
			if(!postAlert){
				var templateFile = fs.readFileSync('app/views/emails/postAlert.hbs', 'utf8');
				postAlert = handlebars.compile( templateFile );
			}
			var html = postAlert({user:user, job:job});
			var jobData = {
                    html: html,
                    text: 'Job still posting after 10 minutes',
                    subject: 'Post error',
                    from_email: config.emails.info,
                    from_name: 'Schedugram',
                    to:[{
                    	email: config.emails.error,
                    	name: 'Schedugram',
                    	type: 'to'
                    }]                        
                },
                job;
            console.log('saving job');
            job = agenda.create(c.JOB_TYPE.CONFIRMATION_EMAIL, jobData);
            q.nbind(job.save, job)();
		},
        otherError: function(msg){
            var subject = 'Generic error: ' + msg;
            var jobData = {
                    html: msg,
                    text: 'Generic error',
                    subject: subject,
                    from_email: config.emails.info,
                    from_name: 'Schedugram',
                    to:[{
                        email: config.emails.error,
                        name: 'Schedugram',
                        type: 'to'
                    }]
                },
                job;
            console.log('saving job');
            job = agenda.create(c.JOB_TYPE.CONFIRMATION_EMAIL, jobData);
            q.nbind(job.save, job)();
        }
};