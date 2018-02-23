const Mongoose = require('mongoose');
const DbConfig = require('../config/database.json');

Mongoose.connect('mongodb://' + DbConfig.host + '/' + DbConfig.database, {
    user: DbConfig.username,
    pass: DbConfig.password
});

module.exports = Mongoose;