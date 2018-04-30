import Express from 'express';

import Moment from 'moment';

import { createLogger, format, transports } from 'winston';

import Ribbon from './app/ribbon';

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
  }),
);
