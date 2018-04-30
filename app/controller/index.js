/*
 * Controller for Index.
 */
import Path from 'path';

import Config from '../../../config/server.json';

import Post from '../model/post';

import Page from '../model/page';

import Content from '../model/content';

import Tag from '../model/tag';

import User from '../model/user';

class Index {
  async index(req, res) {
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
    try {
      const posts = await Post.paginate({
        hidden: false,
        created_at: {
          $lte: new Date(),
        },
      }, options);

      res.render(`themes/${Config.theme}/index`, {
        route: 'index',
        posts,
      });
    } catch (err) {
      req.log.error(err);
    }
  }

  async page(req, res) {
    // Get page details.
    try {
      const fields = ['title', 'url', 'description', 'created_at', 'last_updated', '_id', 'created_by', 'image'];
      const query = await Page.find({ url: req.params.url }).select(fields.join(' '))
        .populate('created_by', '-password').populate('image');

      if (query.length > 0) {
        const contentFields = ['title', 'content', 'content_column', '_id'];
        const contentQuery = await Content.find({ page_id: query[0]._id }).select(contentFields.join(' '));

        res.render(`themes/${Config.theme}/page`, {
          route: `page:${query[0]._id}`,
          page: query[0],
          boxes: contentQuery,
        });
      } else {
        res.redirect('/');
      }
    } catch (err) {
      req.log.error(err);
    }
  }

  async post(req, res) {
    try {
      const post = await Post.from_url(req.params.url);
      if (post.length > 0) {
        res.render(`themes/${Config.theme}/post`, {
          route: `post:${post[0]._id}`,
          post: post[0],
        });
      } else {
        res.redirect('/');
      }
    } catch (err) {
      req.log.error(err);
    }
  }

  async tag(req, res) {
    const page = (req.params.page != null) ? req.params.page : 1;

    try {
      const fields = ['title', 'url', 'content', 'created_at'];
      const query = await Tag.find({ url: req.params.url }).select(fields.join(' '));

      if (query.length > 0) {
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

        res.render(`themes/${Config.theme}/tag`, {
          route: `tag:${query[0]._id}`,
          tag: query[0],
          posts: await Post.paginate({ tag: query[0]._id, hidden: false, created_at: { $lte: new Date() } }, options),
        });
      } else {
        res.redirect('/');
      }
    } catch (err) {
      req.log.error(err);
    }
  }

  async user(req, res) {
    const page = (req.params.page != null) ? req.params.page : 1;
    try {
      const fields = ['username', 'email', 'about', 'created_at', 'avatar', '_id'];
      const query = await User.find({ _id: req.params.id }).select(fields.join(' '));

      if (query.length > 0) {
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

        res.render(`themes/${Config.theme}/user`, {
          route: `user:${query[0]._id}`,
          user: query[0],
          posts: await Post.paginate({ created_by: query[0]._id, hidden: false, created_at: { $lte: new Date() } }, options),
        });
      } else {
        res.redirect('/');
      }
    } catch (err) {
      req.log.error(err);
    }
  }

  admin(req, res) {
    // res.sendFile(Path.join(__dirname, '..', '..', 'public', 'admin.html'));
    res.sendFile(Path.join(__dirname, '..', '..', 'admin', Config.admin, 'index.html'));
  }
}

export default Index;
