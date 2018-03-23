const Mongoose = require('mongoose');
const DbConfig = require('../config/database.json');

Mongoose.connect(`mongodb://${DbConfig.host}/${DbConfig.auth_database}`, {
    user: DbConfig.username,
    pass: DbConfig.password,
    dbName: DbConfig.database,
});

module.exports = Mongoose;
