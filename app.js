const express = require('express');
const path = require('path');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
var methodOverride = require('method-override')

let session = require('express-session');
let sessionOptions = {
  secret: "credentials.cookieSecre",
  cookie: {
    maxAge:269999999999
  },
  saveUninitialized: true,
  resave:true
};

const app = express();
app.use(methodOverride('_method'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session(sessionOptions));
app.use('/', routes);
app.use(express.static('public'));

module.exports = app;
