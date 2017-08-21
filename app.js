var path = require('path'),
  bodyParser = require('body-parser'),
  express = require('express'),
  config = require('./config');

var app = express();

app.use(express.static('public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'pug');
app.set('views', path.resolve('public/views'));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/search/:loc', function(req, res) {
  var position = null;
  if (req.params.loc) {
    // verify min format
    position = req.params.loc.split(',');
  }
  res.render('default', {
    config: JSON.stringify(config),
    position: position
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log('Example app listening on port 3000!');
});
