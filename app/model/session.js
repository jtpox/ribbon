/*eslint-disable*/
const Db = require('../database');

const ObjectId = Db.Schema.ObjectId;
const schema = Db.Schema({
  token: String,
  user: { type: ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

schema.statics.findBySessionId = function (session_id, cb) {
  return this.find({ _id: session_id }, cb);
};

const Session = Db.model('Session', schema);

module.exports = Session;
