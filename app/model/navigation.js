const Db = require('../database');

const ObjectId = Db.Schema.ObjectId;
const schema = Db.Schema({
  title: String,
  page: { type: ObjectId, ref: 'Page', default: null },
  post: { type: ObjectId, ref: 'Post', default: null },
  tag: { type: ObjectId, ref: 'Tag', default: null },
  user: { type: ObjectId, ref: 'User', default: null },
  link: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

const Navigation = Db.model('Navigation', schema);

module.exports = Navigation;
