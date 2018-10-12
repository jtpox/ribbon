/*eslint-disable*/
import Showdown from 'showdown';

import Db from '../database';

const ObjectId = Db.Schema.ObjectId;
const schema = Db.Schema({
  title: String,
  page_id: { type: ObjectId, ref: 'Page' },
  content: String,
  content_column: { type: Number, default: 1 },
  content_offset: { type: Number, default: 0 },
  created_by: { type: ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

/*
 * Forced to break airbnb
 * https://stackoverflow.com/questions/35794418/virtuals-in-mongoose-this-is-empty-object
 */
schema.virtual('html_content').get(function() {
  const converter = new Showdown.Converter({
    simpleLineBreaks: true,
  });
  return converter.makeHtml(`${this.content}`);
});

let Content = Db.model('Content', schema);

/*
 * Statics
 */
Content.get = (pageId, /*cb*/) => {
  const content_fields = ['title', 'content', 'content_column', '_id'];
  const query = Content.findOne({ pageId }).select(content_fields.join(' '));

  return query;
  // return query.exec(cb);
};

export default Content;
