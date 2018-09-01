/*eslint-disable*/
import Db from '../database';

import Showdown from 'showdown';

import Moment from 'moment';

const ObjectId = Db.Schema.ObjectId;
const schema = Db.Schema({
  post: { type: ObjectId, ref: 'Post' },
  page: { type: ObjectId, ref: 'Page' },
  address: String,
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
}, {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  });

let Stat = Db.model('Stat', schema);

/*
 * Statics
 * Forced to break airnbn here as well.
 */
Stat.post = (id, /*cb*/) => {
  const fields = ['post', 'address', 'created_at', 'last_updated'];
  const query = Stat.find({ post: id }).select(fields.join(' '))
    .populate('post');
  
  return query;
  // return query.exec(cb);
};

Stat.page = (id) => {
  const fields = ['page', 'address', 'created_at', 'last_updated'];
  const query = Stat.find({ page: id }).select(fields.join(' '))
    .populate('page');

  return query;
};

export default Stat;