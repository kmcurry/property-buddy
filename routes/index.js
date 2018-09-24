/*jslint node: true*/
var routeLoader = function (app) {

    app.use(function (req, res, next) {
        console.debug(req.ip + " request for " + req.path);
        next();
    });

    app.get('/', function (req, res) {
        res.render('index', {
            locations: JSON.stringify(app.locations),
            GApisKey: process.env.GOOGLE_APIS_KEY
        });
    });

    app.get('/about', function (req, res) {
        res.render('about');
    });

    app.get('/eastereggs', function (req, res) {
        res.render('easteregg');
    });

    app.get('/search/:loc', function (req, res) {
        var position = null;
        if (req.params.loc) {
            // verify min format, i.e., comma separated values
            position = req.params.loc.split(',');
        }

        res.render('simple', {
            locations: JSON.stringify(app.locations),
            position: position,
            geoCoderKey: process.env.GEOCODER_KEY,
            GApisKey: process.env.GOOGLE_APIS_KEY
        });
    });

    app.use(function (req, res, next) {
        res.status(404).render('404');
    });
    
};

module.exports = routeLoader;