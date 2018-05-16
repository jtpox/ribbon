import MongoosePaginate from 'mongoose-paginate';

import Mongoose from 'mongoose';

import DotEnv from 'dotenv';

// Call on dotenv
DotEnv.config();

Mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_AUTH}`, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
});

/*
 * Include required plugins for Mongoose.
 */
Mongoose.plugin(MongoosePaginate);

export { Mongoose as default };
