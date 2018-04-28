/*eslint-disable*/
import Showdown from 'showdown';

import Db from '../database';

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

/*
 * Forced to break airbnb
 * https://stackoverflow.com/questions/35794418/virtuals-in-mongoose-this-is-empty-object
 */
schema.virtual('html_description').get(function() {
  const converter = new Showdown.Converter({
    simpleLineBreaks: true,
  });
  return converter.makeHtml(`${this.description}`);
});

let Page = Db.model('Page', schema);

/*
 * Statics
 */
Page.list = (hidden, /*cb*/) => {
  const find = (hidden) ? {} : { hidden: false };
  const fields = (hidden) ? ['title', 'url', 'description', 'hidden'] : ['title', 'url', 'description'];
  const query = Page.find(find).select(fields.join(' '));
  return query;
  // return query.exec(cb);
};

Page.get = (id, /*cb*/) => {
  const fields = ['title', 'url', 'description', 'created_at', 'last_updated', '_id', 'created_by', 'image', 'hidden'];
  const query = Page.find({ _id: id }).select(fields.join(' '))
    .populate('created_by', '-password').populate('image');
  return query;
  // return query.exec(cb);
};

Page.from_url = (url, /*cb*/) => {
  const fields = ['title', 'url', 'description', 'created_at', 'last_updated', '_id', 'created_by', 'image'];
  const query = Page.find({ url }).select(fields.join(' '))
    .populate('created_by', '-password').populate('image');
  return query;
  // return query.exec(cb);
};



export default Page;
