/*eslint-disable*/
import Db from '../database';

const ObjectId = Db.Schema.ObjectId;
const schema = Db.Schema({
  token: String,
  user: { type: ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

let Session = Db.model('Session', schema);

Session.findById = (session_id, /*cb*/) => {
  return Session.find({ _id: session_id });
  // return Session.find({ _id: session_id }, cb);
};

export default Session;
