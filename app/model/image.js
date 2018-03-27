const Db = require('../database');

let ObjectId = Db.Schema.ObjectId;
const schema = Db.Schema({
  title: String,
  file_name: String,
  created_by: { type: ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

const Image = Db.model('Image', schema);

module.exports = Image;
