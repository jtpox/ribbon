const Db = require('../database');

const ObjectId = Db.Schema.ObjectId;
const schema = Db.Schema({
  title: String,
  file_name: String,
  created_by: { type: ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

schema.statics.list = function(cb) {
  const fields = ['title', 'file_name', 'created_by', 'created_at', 'last_updated', '_id'];
  const query = this.find({}).select(fields.join(' '))
    .populate('created_by');
  return query.exec(cb);
};

const Image = Db.model('Image', schema);

module.exports = Image;
