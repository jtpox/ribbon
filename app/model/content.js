/*eslint-disable*/
const Db = require('../database');

const Showdown = require('showdown');

const ObjectId = Db.Schema.ObjectId;
const schema = Db.Schema({
  title: String,
  page_id: { type: ObjectId, ref: 'Page' },
  content: String,
  content_column: Number,
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

/*
 * Statics
 */
schema.statics.get = function (page_id, cb) {
  const content_fields = ['title', 'content', 'content_column', '_id'];
  const query = this.find({ page_id }).select(content_fields.join(' '));

  return query.exec(cb);
};

const Content = Db.model('Content', schema);

module.exports = Content;
