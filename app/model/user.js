/*eslint-disable*/
import Db from '../database';

const ObjectId = Db.Schema.ObjectId;
const schema = Db.Schema({
  username: String,
  password: String,
  email: String,
  group: { type: Number, default: 2, }, // 1 for Administrator, 2 for Editor.
  about: { type: String, default: 'Sorry, nothing about me yet!' },
  avatar: { type: String, default: 'default.png' },
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
  posts: [{ type: ObjectId, ref: 'Post' }],
});

let User = Db.model('User', schema);

User.findByEmail = (email, /*cb*/) => {
  return User.find({ email });
  // return User.find({ email }, cb);
};

User.list = (/*cb*/) => {
  const fields = ['username', 'email', 'group', 'about', 'avatar', 'created_at', 'last_updated', '_id'];
  const query = User.find({}).select(fields.join(' '));

  return query;
  //return query.exec(cb);
};

User.get = (id, /*cb*/) => {
  const fields = ['username', 'email', 'about', 'created_at', 'avatar', '_id'];
  const query = User.findOne({ _id: id }).select(fields.join(' '));

  return query;
  //return query.exec(cb);
};

export default User;