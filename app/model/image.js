/*eslint-disable*/
import Db from '../database';

const ObjectId = Db.Schema.ObjectId;
const schema = Db.Schema({
  title: String,
  file_name: String,
  created_by: { type: ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

const Image = Db.model('Image', schema);

Image.list = (/*cb*/) => {
  const fields = ['title', 'file_name', 'created_by', 'created_at', 'last_updated', '_id'];
  const query = Image.find({}).select(fields.join(' '))
    .populate('created_by');
  return query;
  // return query.exec(cb);
};

export default Image;
