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

schema.virtual('no_tags_short').get(function() {
  return this.description.split(' ').splice(0, 50).join(' ');
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

Page.fromUrl = (url, /*cb*/) => {
  const fields = ['title', 'url', 'description', 'created_at', 'last_updated', '_id', 'created_by', 'image'];
  const query = Page.find({ url }).select(fields.join(' '))
    .populate('created_by', '-password').populate('image');
  return query;
  // return query.exec(cb);
};


Page.page = (page, query) => {
  const options = {
    select: 'title url content image created_by tag created_at last_updated _id',
    sort: { created_at: 'descending' },
    populate: [
      {
        path: 'created_by',
        select: '-password',
      },
      {
        path: 'tag',
      },
      {
        path: 'image',
      },
    ],
    lean: false,
    limit: 10,
    page,
  };
  return Page.paginate(query, options);
};


export default Page;
