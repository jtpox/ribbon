const Db = require('../database');

var ObjectId = Db.Schema.ObjectId;
var schema = Db.Schema({
    title: String,
    url: String,
    content: String,
    created_at: { type: Date, default: Date.now },
    last_updated: { type: Date, default: Date.now },
    posts: [{ type: ObjectId, ref: 'Post' }]
});

var Tag = Db.model('Tag', schema);

module.exports = Tag;
