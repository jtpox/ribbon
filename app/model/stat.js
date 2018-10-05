/*eslint-disable*/
import Db from '../database';

import Showdown from 'showdown';

import Moment from 'moment';

const ObjectId = Db.Schema.ObjectId;
const schema = Db.Schema({
  post: { type: ObjectId, ref: 'Post' },
  page: { type: ObjectId, ref: 'Page' },
  address: String,
  platform: String,
  browser: String,
  os: String,
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
Stat.post = (id, days = 7, populate = false) => {
  const cutOff = new Date();
  cutOff.setDate(cutOff.getDate() - days);

  const fields = ['post', 'address', 'platform', 'browser', 'os', 'created_at', 'last_updated'];
  const query = (populate) ? Stat.findOne({
    post: id,
    created_at: {
      '$gte': cutOff
    },
  }).select(fields.join(' '))
    .populate('post') : Stat.find({
      post: id,
      created_at: {
        '$gte': cutOff
      },
    }).select(fields.join(' '));

  return query;
  // return query.exec(cb);
};

Stat.page = (id, days = 7, populate = false) => {
  const cutOff = new Date();
  cutOff.setDate(cutOff.getDate() - days);
  // console.log(id);

  const fields = ['page', 'address', 'platform', 'browser', 'os', 'created_at', 'last_updated'];
  const query = (populate) ? Stat.findOne({
    page: id,
    created_at: {
      '$gte': cutOff
    },
  }).select(fields.join(' '))
    .populate('page') : Stat.find({
      page: id,
      created_at: {
        '$gte': cutOff
      },
    }).select(fields.join(' '));

  return query;
};

Stat.record = (type = 'post', id, req, useragent) => {
  if (process.env.RECORD_STAT.toLowerCase() == 'true') { // This way because dotenv stores as strings instead of boolean.
    /*
     * Check if IP has access the page or post more than 24 hours ago.
     */
    const cutOff = new Date();
    cutOff.setDate(cutOff.getDate() - 2); // Current day minus 2.

    const find = (type == 'post') ? {
      post: id,
      address: req.ip,
      created_at: {
        '$lt': new Date(),
        '$gte': cutOff,
      }
    } : {
        page: id,
        address: req.ip,
        created_at: {
          '$lt': new Date(),
          '$gte': cutOff,
        }
      };

    Stat.findOne(find, (err, docs) => {
      if (!docs) {
        const newRecord = new Stat({
          post: (type == 'post') ? id : null,
          page: (type == 'page') ? id : null,
          address: req.ip,
          platform: useragent.platform,
          browser: useragent.browser,
          os: useragent.os,
        });
        newRecord.save();
      }
    });
  }
};

export default Stat;