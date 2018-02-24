const Db = require('../database');

var schema = Db.Schema({
    title: String,
    url: String,
    content: String,
    created_by: Number,
    created_at: { type: Date, default: Date.now },
    last_updated: { type: Date, default: Date.now }
});

var Post = Db.model('Post', schema);

module.exports = Post;
