const Db = require('../database');

const Showdown = require('showdown');

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

/*
 * Statics
 */
schema.statics.list = function (hidden, cb) {
  const find = (hidden) ? {} : { hidden: false };
  const fields = (hidden) ? ['title', 'url', 'description', 'hidden'] : ['title', 'url', 'description'];
  const query = this.find(find).select(fields.join(' '));
  return query.exec(cb);
};

schema.statics.get = function (id, cb) {
  const fields = ['title', 'url', 'description', 'created_at', 'last_updated', '_id', 'created_by', 'image', 'hidden'];
  const query = this.find({ _id: id }).select(fields.join(' '))
    .populate('created_by', '-password').populate('image');
  return query.exec(cb);
};

schema.statics.from_url = function (url, cb) {
  const fields = ['title', 'url', 'description', 'created_at', 'last_updated', '_id', 'created_by', 'image'];
  const query = this.find({ url }).select(fields.join(' '))
    .populate('created_by', '-password').populate('image');
  return query.exec(cb);
};

const Page = Db.model('Page', schema);

module.exports = Page;
