var path = require('path'),
  bodyParser = require('body-parser'),
  express = require('express'),
  fs = require('fs'),
  locations = require('./locations/locations');

var app = express();

// allow custom bower install location with default
var bowerComponents = path.join(__dirname + '/bower_components');
if (process.env.BOWER_PATH) {
    bowerComponents = path.join(process.env.BOWER_PATH + '/bower_components');
};

app.use(express.static('public'));
app.use('/bower_components', express.static(bowerComponents));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'pug');
app.set('views', path.resolve('public/views'));

app.get('/', function(req, res) {
  res.render('index', {
    locations: JSON.stringify(locations)
  });
});

app.get('/about', function(req, res) {
  res.render('about');
});

app.get('/eastereggs', function(req, res) {
  res.render('easteregg');
});

app.get('/search/:loc', function(req, res) {
  var position = null;
  if (req.params.loc) {
    // verify min format, i.e., comma separated values
    position = req.params.loc.split(',');
  }
  res.render('default', {
    locations: JSON.stringify(locations),
    position: position
  });
});

// default to port 3000, but allow custom env PORT to override
var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('App listening on port ' + port);
});
