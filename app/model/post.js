/*eslint-disable*/
import Db from '../database';

import Showdown from 'showdown';

import Moment from 'moment';

const ObjectId = Db.Schema.ObjectId;
const schema = Db.Schema({
  title: String,
  url: String,
  content: String,
  image: { type: ObjectId, ref: 'Image', default: null },
  hidden: { type: Boolean, default: false },
  created_by: { type: ObjectId, ref: 'User' },
  tag: { type: ObjectId, ref: 'Tag' },
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

/*
 * Forced to break airbnb
 * https://stackoverflow.com/questions/35794418/virtuals-in-mongoose-this-is-empty-object
 */
schema.virtual('html_content').get(function () {
  const converter = new Showdown.Converter({
    simpleLineBreaks: true,
  });
  return converter.makeHtml(this.content);
});

schema.virtual('shorten_html_content').get(function () {
  const converter = new Showdown.Converter({
    simpleLineBreaks: true,
  });

  const content = this.content.split(' ').splice(0, 50).join(' ');
  return converter.makeHtml(content);
});

schema.virtual('no_tags_short').get(function() {
  return this.content.split(' ').splice(0, 50).join(' ');
});

let Post = Db.model('Post', schema);

/*
 * Statics
 * Forced to break airnbn here as well.
 */
Post.list = (/*cb*/) => {
  const fields = ['title', 'url', 'content', 'image', 'created_by', 'tag', 'created_at', 'last_updated', '_id', 'hidden'];
  const query = Post.find({}).select(fields.join(' ')).sort({ created_at: 'descending' })
    .populate('created_by', '-password')
    .populate('tag image');
  return query;  
  // return query.exec(cb);
};

Post.view = (id, /*cb*/) => {
  const fields = ['title', 'url', 'content', 'image', 'created_by', 'tag', 'created_at', 'last_updated', 'hidden'];
  const query = Post.findOne({ _id: id }).select(fields.join(' '))
    .populate('created_by', '-password').populate('tag image');
  
  return query;
  // return query.exec(cb);
};

Post.fromUrl = (url, /*cb*/) => {
  const fields = ['title', 'url', 'content', 'image', 'created_by', 'tag', 'created_at', 'last_updated', 'hidden'];
  const query = Post.findOne({ url: url }).select(fields.join(' '))
    .populate('created_by', '-password').populate('tag image');
  return query;
};

Post.findNext = (date) => {
  const fields = ['title', 'url', 'content', 'image', 'created_by', 'tag', 'created_at', 'last_updated', 'hidden'];
  const query = Post.findOne({
    created_at: {
      '$gt': date,
      '$lt': new Date(),
    },
    hidden: false,
  })
    .limit(1)
    .select(fields.join(' '))
    .populate('created_by', '-password')
    .populate('tag image');
  
    return query;
};

Post.findPrevious = (date) => {
  const fields = ['title', 'url', 'content', 'image', 'created_by', 'tag', 'created_at', 'last_updated', 'hidden'];
  const query = Post.findOne({
    created_at: {
      '$lt': date,
    },
    hidden: false,
  })
    .sort({ created_at: -1 })
    .limit(1)
    .select(fields.join(' '))
    .populate('created_by', '-password')
    .populate('tag image');
  
    return query;
};

Post.page = (page, query) => {
  const options = {
    select: 'title url content image created_by tag created_at last_updated _id converted_content',
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
  return Post.paginate(query, options);
};

export default Post;