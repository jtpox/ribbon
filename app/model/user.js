const Db = require('../database');

var ObjectId = Db.Schema.ObjectId;
var schema = Db.Schema({
    username: String,
    password: String,
    email: String,
    about: { type: String, default: 'Sorry, nothing about me yet!' },
    avatar: { type: String, default: 'default.png' },
    created_at: { type: Date, default: Date.now },
    last_updated: { type: Date, default: Date.now },
    posts: [{ type:  ObjectId, ref: 'Post' }]
});

schema.statics.findByEmail = function(email, cb) {
    return this.find({ email: email }, cb);
};

var User = Db.model('User', schema);

module.exports = User;
