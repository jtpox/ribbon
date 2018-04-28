import MongoosePaginate from 'mongoose-paginate';

import Mongoose from 'mongoose';

import DbConfig from '../../config/database.json';

Mongoose.connect(`mongodb://${DbConfig.host}/${DbConfig.auth_database}`, {
  user: DbConfig.username,
  pass: DbConfig.password,
  dbName: DbConfig.database,
});

/*
 * Include required plugins for Mongoose.
 */
Mongoose.plugin(MongoosePaginate);

export { Mongoose as default };
