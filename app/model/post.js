const Db = require('../database');
const MongoosePaginate = require('mongoose-paginate');

const Showdown = require('showdown');

const ObjectId = Db.Schema.ObjectId;
const schema = Db.Schema({
  title: String,
  url: String,
  content: String,
  image: { type: ObjectId, ref: 'Image', default: null },
  hidden: { type: Boolean, default: false },
  created_by: { type: ObjectId, ref: 'User' },
  tag: { type: ObjectId, ref: 'Tag' },
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

schema.virtual('converted_content').get(() => {
  const converter = new Showdown.Converter();
  return converter.makeHtml(this.content);
});

schema.plugin(MongoosePaginate);

const Post = Db.model('Post', schema);

module.exports = Post;
