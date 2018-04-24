/*eslint-disable*/
const Db = require('../database');

const ObjectId = Db.Schema.ObjectId;
const schema = Db.Schema({
  title: String,
  url: String,
  content: String,
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
  posts: [{ type: ObjectId, ref: 'Post' }],
});

/*
 * statics
 */
schema.statics.list = function (cb) {
  const fields = ['title', 'url', 'content', 'created_at', 'last_updated', '_id'];
  const query = this.find({}).select(fields.join(' '));
  return query.exec(cb);
};

schema.statics.get = function (id, cb) {
  const fields = ['title', 'url', 'content', 'created_at', 'last_updated', '_id', 'posts'];
  const query = this.find({ _id: id }).select(fields.join(' '))
    .populate({
      path: 'posts',
      match: {
        hidden: false,
        created_at: {
          $lte: new Date(),
        },
      },
    });
  
    return query.exec(cb);
};

schema.statics.from_url = function (url, cb) {
  const fields = ['title', 'url', 'content', 'created_at'];
  const query = this.find({ url }).select(fields.join(' '));

  return query.exec(cb);
};

const Tag = Db.model('Tag', schema);

module.exports = Tag;
