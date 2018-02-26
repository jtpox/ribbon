const Db = require('../database');

var ObjectId = Db.Schema.ObjectId;
var schema = Db.Schema({
    title: String,
    page_id: { type: ObjectId, ref: 'Page' },
    content: String,
    content_column: Number,
    created_by: { type: ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now },
    last_updated: { type: Date, default: Date.now }
});

var Content = Db.model('Content', schema);

module.exports = Content;
