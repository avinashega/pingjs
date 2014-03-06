module.exports={
		privacy: function(req, res){
			res.render('privacy');
		},
		tos: function(req, res){
			res.render('tos');
		},
		contact: function(req, res){
			res.render('contact');
		},
		routes: function(app){
			app.get('/privacy', this.privacy);
			app.get('/tos', this.tos);
			app.get('/contact', this.contact);
		}
}