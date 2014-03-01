module.exports={
		privacy: function(req, res){
			res.render('privacy');
		},
		tos: function(req, res){
			res.render('tos');
		},
		routes: function(app){
			app.get('/privacy', this.privacy);
			app.get('/tos', this.tos);
		}
}