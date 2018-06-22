import Express from 'express';

import Moment from 'moment';

import DotEnv from 'dotenv';

import { createLogger, format, transports } from 'winston';

import Ribbon from './app/ribbon';

DotEnv.config();

const {
  combine,
  timestamp,
  printf,
} = format;

const newFormat = printf((info) => {
  const moment = Moment(info.timestamp).format('YYYY-MM-DD HH:mm');
  return `[${moment}] ${info.level}: ${info.message}`;
});

const ribbon = new Ribbon(
  Express,
  Express(),
  createLogger({
    format: combine(
      timestamp(),
      newFormat,
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'combined.log' }),
    ],
    levels: {
      error: 0,
      warn: 1,
      info: 2,
      plugin: 2,
      verbose: 3,
      debug: 4,
      silly: 5,
    },
  }),
);
