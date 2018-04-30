/*eslint-disable*/
import Db from '../database';

const ObjectId = Db.Schema.ObjectId;
const schema = Db.Schema({
  title: String,
  url: String,
  content: String,
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
  posts: [{ type: ObjectId, ref: 'Post' }],
});

let Tag = Db.model('Tag', schema);

/*
 * statics
 */
Tag.list = (/*cb*/) => {
  const fields = ['title', 'url', 'content', 'created_at', 'last_updated', '_id'];
  const query = Tag.find({}).select(fields.join(' '));
  return query;
  // return query.exec(cb);
};

Tag.get = (id, /*cb*/) => {
  const fields = ['title', 'url', 'content', 'created_at', 'last_updated', '_id', 'posts'];
  const query = Tag.find({ _id: id }).select(fields.join(' '))
    .populate({
      path: 'posts',
      match: {
        hidden: false,
        created_at: {
          $lte: new Date(),
        },
      },
    });
  
  return query;
  //return query.exec(cb);
};

Tag.fromUrl = (url, /*cb*/) => {
  const fields = ['title', 'url', 'content', 'created_at'];
  const query = Tag.find({ url }).select(fields.join(' '));

  return query;
  //return query.exec(cb);
};

export default Tag;
