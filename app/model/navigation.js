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

schema.statics.list = function(cb) {
  const fields = ['title', 'page', 'post', 'link', 'tag', 'use', 'created_at', 'last_updated', '_id'];
  const query = Navigation.find({}).select(fields.join(' '))
    .populate('page').populate('post')
    .populate('tag')
    .populate('user', '-password');
  return query.exec(cb);
};

const Navigation = Db.model('Navigation', schema);

module.exports = Navigation;
