/*
 * Controller for Blog.
 */
const Post = require('../model/post');

const Config = require('../../config/server');
const Package = require('../../package');
const Analytic = require('../../config/analytics');

const Slugify = require('slugify');

const Db = require('../database');// Soley used for the ObjectId type.

class Blog {
  site(req, res) {
    Config.site.ribbon_version = Package.version;
    Config.site.url = `${req.protocol}://${req.get('host')}`;
    Config.site.analytics = Analytic;
    res.json(Config.site);
  }

  paginate(req, res) {
    const page = (req.params.page != null) ? req.params.page : 1;
    // List the blog posts with pagination.
    // https://stackoverflow.com/questions/42700884/select-all-the-fields-in-a-mongoose-schema
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
    Post.paginate({
      hidden: false,
      created_at: {
        $lte: new Date(),
      },
    }, options).then((result) => {
      // console.log(result);
      res.json(result);
    });
  }

  list(req, res) {
    Post.list((err, results) => {
      // console.log(results);
      res.json(results);
    });
  }

  view(req, res) {
    // View post by id.
    Post.view(req.params.id, (err, result) => {
      // console.log(result);
      res.json(result);
    });
  }

  from_url(req, res) {
    Post.from_url(req.params.url, (err, result) => {
      // console.log(result);
      res.json(result);
    });
  }

  insert(req, res) {
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

      post.save((err, new_post) => {
        res.json({
          error: 0,
          post_id: new_post._id,
        });
      });
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

  update(req, res) {
    // Update a blog post.
    if (req.body.title && req.body.content && req.body.tag && req.body.schedule) {
      Post.update({ _id: req.params.id }, {
        title: req.body.title,
        url: (req.body.url) ? Slugify(req.body.url) : Slugify(req.body.title),
        content: req.body.content,
        tag: Db.Types.ObjectId(req.body.tag),
        image: (req.body.image !== null) ? Db.Types.ObjectId(req.body.image) : null,
        created_at: new Date(req.body.schedule),
        hidden: (req.body.hidden) ? req.body.hidden : false,
      }, (err) => {
        if (err) {
          res.json({
            error: 1,
          });
        } else {
          res.json({
            error: 0,
          });
        }
      });
    } else {
      res.json({
        error: 1,
      });
    }
  }
}

module.exports = Blog;
