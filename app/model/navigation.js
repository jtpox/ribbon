/*eslint-disable*/
import Db from '../database';

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

let Navigation = Db.model('Navigation', schema);

Navigation.list = (cb) => {
  const fields = ['title', 'page', 'post', 'link', 'tag', 'use', 'created_at', 'last_updated', '_id'];
  const query = Navigation.find({}).select(fields.join(' '))
    .populate('page').populate('post')
    .populate('tag')
    .populate('user', '-password');
  return query.exec(cb);
};

export default Navigation;
