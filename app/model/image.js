const Db = require('../database');

var ObjectId = Db.Schema.ObjectId;
var schema = Db.Schema({
    title: String,
    url: String,
    description: String,
    created_by: { type: ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now },
    last_updated: { type: Date, default: Date.now }
});

var Image = Db.model('Image', schema);

module.exports = Image;
