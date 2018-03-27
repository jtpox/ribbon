const Db = require('../database');

let ObjectId = Db.Schema.ObjectId;
const schema = Db.Schema({
  title: String,
  url: String,
  content: String,
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
  posts: [{ type: ObjectId, ref: 'Post' }],
});

const Tag = Db.model('Tag', schema);

module.exports = Tag;
