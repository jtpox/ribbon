/*
 * Controller for Blog.
 */
import Slugify from 'slugify';

import Moment from 'moment';

import Post from '../model/post';

import Stat from '../model/stat';

import Package from '../../package.json';

import Db from '../database';// Soley used for the ObjectId type.

class Blog {
  site(req, res) {
    // Config.site.ribbon_version = Package.version;
    // Config.site.url = `${req.protocol}://${req.get('host')}`;
    // Config.site.analytics = Analytic;
    // res.json(Config.site);
    res.json({
      name: process.env.SITE_NAME,
      ribbon_version: Package.version,
      analytics: {
        site: {
          domain: process.env.SITE_DOMAIN,
        },
        google: {
          tracking_id: process.env.GOOGLE_TRACKING_ID,
        },
        twitter: {
          username: process.env.TWITTER_USERNAME,
        },
      },
    });
  }

  async paginate(req, res) {
    const page = (req.params.page != null) ? req.params.page : 1;
    // List the blog posts with pagination.
    // https://stackoverflow.com/questions/42700884/select-all-the-fields-in-a-mongoose-schema
    try {
      res.json(await Post.page(page, {
        hidden: false,
        created_at: {
          $lte: new Date(),
        },
      }));
    } catch (err) {
      req.log.error(err);
      res.json({
        error: 1,
      });
    }
  }

  async list(req, res) {
    try {
      res.json(await Post.list());
    } catch (err) {
      req.log.error(err);
      res.json({
        error: 1,
      });
    }
  }

  async view(req, res) {
    // View post by id.
    try {
      res.json(await Post.view(req.params.id));
    } catch (err) {
      req.log.error(err);
      res.json({
        error: 1,
      });
    }
  }

  async fromUrl(req, res) {
    try {
      const post = await Post.fromUrl(req.params.url);

      /*
       * Add to statistics.
       */
      Stat.record('post', post[0]._id, req.ip, req.useragent);

      res.json({
        post,
        previous: await Post.findPrevious(post[0].created_at),
        next: await Post.findNext(post[0].created_at),
      });
    } catch (err) {
      req.log.error(err);
      res.json({
        error: 1,
      });
    }
  }

  async insert(req, res) {
    // console.log(req.currentUser);
    // Add a blog post.
    if (req.body.title && req.body.content && req.body.tag && req.body.schedule) {
      // console.log(req.body.image);
      const post = new Post({
        title: req.body.title,
        url: (req.body.url) ? Slugify(req.body.url) : Slugify(req.body.title),
        content: req.body.content,
        image: (req.body.image !== null) ? Db.Types.ObjectId(req.body.image) : null,
        created_by: Db.Types.ObjectId(req.currentUser),
        tag: Db.Types.ObjectId(req.body.tag),
        created_at: new Date(req.body.schedule),
        hidden: (req.body.hidden) ? req.body.hidden : false,
      });
      try {
        const save = await post.save();
        res.json({
          error: 0,
          post_id: save._id,
        });
      } catch (err) {
        req.log.error(err);
        res.json({
          error: 1,
        });
      }
    } else {
      res.json({
        error: 1,
      });
    }
  }

  delete(req, res) {
    // Delete a blog post.
    Post.find({ _id: req.params.id }).remove().exec();
    res.json({
      error: 0,
    });
  }

  async update(req, res) {
    // Update a blog post.
    if (req.body.title && req.body.content && req.body.tag && req.body.schedule) {
      try {
        const update = await Post.update({ _id: req.params.id }, {
          title: req.body.title,
          url: (req.body.url) ? Slugify(req.body.url) : Slugify(req.body.title),
          content: req.body.content,
          tag: Db.Types.ObjectId(req.body.tag),
          image: (req.body.image !== null) ? Db.Types.ObjectId(req.body.image) : null,
          created_at: new Date(req.body.schedule),
          hidden: (req.body.hidden) ? req.body.hidden : false,
        });
        res.json({
          error: 0,
        });
      } catch (err) {
        req.log.error(err);
        res.json({
          error: 1,
        });
      }
    } else {
      res.json({
        error: 1,
      });
    }
  }
}

export default Blog;
