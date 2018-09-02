/*
 * Controller for Index.
 */
import Path from 'path';

import Post from '../model/post';

import Page from '../model/page';

import Content from '../model/content';

import Tag from '../model/tag';

import User from '../model/user';

import Stat from '../model/stat';

class Index {
  async index(req, res) {
    // console.log(process.env);
    const page = (req.params.page != null) ? req.params.page : 1;
    try {
      const posts = await Post.page(
        page,
        {
          hidden: false,
          created_at: {
            $lte: new Date(),
          },
        },
      );

      res.render(`themes/${process.env.SITE_THEME}/index`, {
        route: 'index',
        title: 'Home',
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

        /*
         * Add to statistics.
         */
        Stat.record('page', query[0]._id, req.ip, req.useragent);

        res.render(`themes/${process.env.SITE_THEME}/page`, {
          route: `page:${query[0]._id}`,
          title: query[0].title,
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
      const post = await Post.fromUrl(req.params.url);
      if (post.length > 0) {

        /*
         * Add to statistics.
         */
        Stat.record('post', post[0]._id, req.ip, req.useragent);

        res.render(`themes/${process.env.SITE_THEME}/post`, {
          route: `post:${post[0]._id}`,
          title: post[0].title,
          post: post[0],
          previous: await Post.findPrevious(post[0].created_at),
          next: await Post.findNext(post[0].created_at),
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
        res.render(`themes/${process.env.SITE_THEME}/tag`, {
          route: `tag:${query[0]._id}`,
          title: query[0].title,
          tag: query[0],
          posts: await Post.page(page, { tag: query[0]._id, hidden: false, created_at: { $lte: new Date() } }),
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
        res.render(`themes/${process.env.SITE_THEME}/user`, {
          route: `user:${query[0]._id}`,
          title: query[0].username,
          user: query[0],
          posts: await Post.page(page, { created_by: query[0]._id, hidden: false, created_at: { $lte: new Date() } }),
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
    res.sendFile(Path.join(__dirname, '..', '..', 'admin', process.env.ADMIN_THEME, 'index.html'));
  }
}

export default Index;
