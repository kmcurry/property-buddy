var path = require('path'),
  bodyParser = require('body-parser'),
  express = require('express'),
  fs = require('fs'),
  locations = require('./locations/locations');

  require('dotenv').config();

var app = express();

app.locations = locations;

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



// default to port 3000, but allow custom env PORT to override
var port = process.env.PORT || 3000;

app.listen(port, function() {
  require('./routes')(app);
  console.log('App listening on port ' + port);
});
