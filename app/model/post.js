const Db               = require('../database');
const MongoosePaginate = require('mongoose-paginate');

var ObjectId = Db.Schema.ObjectId;
var schema = Db.Schema({
    title: String,
    url: String,
    content: String,
    image: { type: ObjectId, ref: 'Image' },
    created_by: { type: ObjectId, ref: 'User' },
    tag: { type: ObjectId, ref: 'Tag' },
    created_at: { type: Date, default: Date.now },
    last_updated: { type: Date, default: Date.now }
});

schema.plugin(MongoosePaginate);

var Post = Db.model('Post', schema);

module.exports = Post;
