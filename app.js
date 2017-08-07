var path = require('path'),
    express = require('express'),
    config = require('./config');

var app = express();

app.use(express.static('public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.set('view engine', 'pug');
app.set('views', path.resolve('public/views'));

app.get('/', function (req, res) {
  res.render('index', {
    config: JSON.stringify(config)
  });
});

app.get('/iconic', function (req, res) {
  res.render('iconic', {
    config: JSON.stringify(config)
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});
