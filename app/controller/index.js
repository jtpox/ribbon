/*
 * Controller for Index.
 */
const Path = require('path');
const Config = require('../../config/server');

const Post = require('../model/post');
const Page = require('../model/page');
const Content = require('../model/content');
const Tag = require('../model/tag');
const User = require('../model/user');

class Index {
  index(req, res) {
    // res.sendFile(Path.join(__dirname, '..', '..', 'themes', Config.theme, 'index.html'));
    const page = (req.params.page != null) ? req.params.page : 1;
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
    Post.paginate({
      hidden: false,
      created_at: {
        $lte: new Date(),
      },
    }, options).then((result) => {
      res.render(`themes/${Config.theme}/index`, {
        route: 'index',
        posts: result,
      });
    });
  }

  page(req, res) {
    // Get page details.
    const fields = ['title', 'url', 'description', 'created_at', 'last_updated', '_id', 'created_by', 'image'];
    const query = Page.find({ url: req.params.url }).select(fields.join(' '))
      .populate('created_by', '-password').populate('image');

    query.exec((err, results) => {
      // res.json(results);

      if (results.length > 0) {
        const content_fields = ['title', 'content', 'content_column', '_id'];
        const content_query = Content.find({ page_id: results[0]._id }).select(content_fields.join(' '));

        content_query.exec((content_query_err, content_results) => {
          // results[0].boxes = content_results;
          res.render(`themes/${Config.theme}/page`, {
            route: `page:${results[0]._id}`,
            page: results[0],
            boxes: content_results,
          });
        });
      } else {
        res.redirect('/');
      }
    });
  }

  post(req, res) {
    const fields = ['title', 'url', 'content', 'image', 'created_by', 'tag', 'created_at', 'last_updated', 'hidden'];
    const query = Post.find({ url: req.params.url }).select(fields.join(' '))
      .populate('created_by', '-password').populate('tag image');
    query.exec((err, result) => {
      // console.log(result);
      if (result.length > 0) {
        res.render(`themes/${Config.theme}/post`, {
          route: `post:${result[0]._id}`,
          post: result[0],
        });
      } else {
        res.redirect('/');
      }
    });
  }

  tag(req, res) {
    const page = (req.params.page != null) ? req.params.page : 1;

    const fields = ['title', 'url', 'content', 'created_at'];
    const query = Tag.find({ url: req.params.url }).select(fields.join(' '));

    query.exec((err, results) => {
      if (results.length > 0) {
        // If the tag exists.
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
        Post.paginate({ tag: results[0]._id, hidden: false, created_at: { $lte: new Date() } }, options).then((post_results) => {
          // console.log(result);
          res.render(`themes/${Config.theme}/tag`, {
            route: `tag:${results[0]._id}`,
            tag: results[0],
            posts: post_results,
          });
        });
      } else {
        res.redirect('/');
      }
    });
  }

  user(req, res) {
    const page = (req.params.page != null) ? req.params.page : 1;

    const fields = ['username', 'email', 'about', 'created_at', 'avatar', '_id'];
    const query = User.find({ _id: req.params.id }).select(fields.join(' '));

    query.exec((err, results) => {
      if (results.length > 0) {
        // If the tag exists.
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
        Post.paginate({ created_by: results[0]._id, hidden: false, created_at: { $lte: new Date() } }, options).then((post_results) => {
          // console.log(result);
          res.render(`themes/${Config.theme}/user`, {
            route: `user:${results[0]._id}`,
            user: results[0],
            posts: post_results,
          });
        });
      } else {
        res.redirect('/');
      }
    });
  }

  admin(req, res) {
    // res.sendFile(Path.join(__dirname, '..', '..', 'public', 'admin.html'));
    res.sendFile(Path.join(__dirname, '..', '..', 'admin', Config.admin, 'index.html'));
  }
}

module.exports = Index;
