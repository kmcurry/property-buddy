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

    app.get('/easteregg', function (req, res) {
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

    app.get('/search/environment/:loc', function(req, res) {

    });

    app.get('/search/prices/:loc', function(req, res) {
        var position = null;
        if (req.params.loc) {
            // verify min format, i.e., comma separated values
            position = req.params.loc.split(',');
        }

        res.render('prices', {
            position: position,
            geoCoderKey: process.env.GEOCODER_KEY,
            GApisKey: process.env.GOOGLE_APIS_KEY
        });
    });

    app.get('/search/safety/:loc', function(req, res) {
        var position = null;
        if (req.params.loc) {
            // verify min format, i.e., comma separated values
            position = req.params.loc.split(',');
        }

        res.render('safety', {
            locations: JSON.stringify(app.locations),
            position: position,
            geoCoderKey: process.env.GEOCODER_KEY,
            GApisKey: process.env.GOOGLE_APIS_KEY
        });
    });

    app.get('/maps/safety', function(req, res) {
        res.redirect('/maps/safety/incidents');
    });

    app.get('/maps/safety/incidents', function(req, res) {
        res.render('maps/safety/incidents', {
            locations: JSON.stringify(app.locations),
            mapboxKey: process.env.MAPBOX
        });
    });

    app.get('/maps/safety/calls', function(req, res) {
        res.render('maps/safety/calls', {
            locations: JSON.stringify(app.locations),
            mapboxKey: process.env.MAPBOX
        });
    });

    app.get('/maps/safety/calls/subdivision', function(req, res) {
        res.render('maps/safety/callsSubdivision', {
            locations: JSON.stringify(app.locations),
            mapboxKey: process.env.MAPBOX
        });
    });

    app.get('/maps/property/code-enforcement', function(req, res) {
        res.render('maps/property/codeEnforcement', {
            locations: JSON.stringify(app.locations),
            mapboxKey: process.env.MAPBOX
        });
    });

    app.use(function (req, res, next) {
        res.status(404).render('404');
    });
    
};

module.exports = routeLoader;