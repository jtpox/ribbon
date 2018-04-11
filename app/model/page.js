const Db = require('../database');

const ObjectId = Db.Schema.ObjectId;
const schema = Db.Schema({
  title: String,
  url: String,
  description: String,
  image: { type: ObjectId, ref: 'Image', default: null },
  hidden: { type: Boolean, default: false },
  created_by: { type: ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

const Page = Db.model('Page', schema);

module.exports = Page;
