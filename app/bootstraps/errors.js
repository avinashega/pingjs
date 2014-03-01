module.exports = function (app) {
    app.use(function (req, resp, next) {
        resp.status(404);
        resp.render('error/404');
    });

    app.use(function (err, req, res, next) {

//        if (err.errorCode == 401) {
////            res.redirect('/');
//        } else {
            res.status(err.status || 500);
            res.render('error/500', { error: err });
//        }

        console.error(err);
        console.dir(err.stack);
    });
};