/*
 * snake_case for variables and file names.
 * camelCase for functions, classes, constants.
 */
import Express from 'express';
import Log from './app/console';
import Ribbon from './app/ribbon';

const ribbon = new Ribbon(Express, Express(), new Log());
