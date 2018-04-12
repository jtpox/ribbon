/*
 * snake_case for variables and file names.
 * camelCase for functions, classes, constants.
 */
const Express = require('express');
const Log = require('./app/console');
const Ribbon = require('./app/ribbon');

const ribbon = new Ribbon(Express, Express(), new Log());
