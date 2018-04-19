const Db = require('../database');

const ObjectId = Db.Schema.ObjectId;
const schema = Db.Schema({
  username: String,
  password: String,
  email: String,
  about: { type: String, default: 'Sorry, nothing about me yet!' },
  avatar: { type: String, default: 'default.png' },
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
  posts: [{ type: ObjectId, ref: 'Post' }],
});

schema.statics.findByEmail = function (email, cb) {
  return this.find({ email }, cb);
};

schema.statics.list = function (cb) {
  const fields = ['username', 'email', 'about', 'avatar', 'created_at', 'last_updated', '_id'];
  const query = this.find({}).select(fields.join(' '));

  return query.exec(cb);
};

schema.statics.get = function (id, cb) {
  const fields = ['username', 'email', 'about', 'created_at', 'avatar', '_id'];
  const query = this.find({ _id: id }).select(fields.join(' '));

  return query.exec(cb);
};

const User = Db.model('User', schema);

module.exports = User;
