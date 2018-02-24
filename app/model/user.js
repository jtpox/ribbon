const Db = require('../database');

var schema = Db.Schema({
    username: String,
    password: String,
    email: String,
    created_at: { type: Date, default: Date.now },
    last_updated: { type: Date, default: Date.now }
});

var User = Db.model('User', schema);

module.exports = User;
