const Express = require('express');
const Log     = require('./app/console');
const Ribbon  = require('./app/ribbon');

var ribbon = new Ribbon(Express, Express(), new Log());
