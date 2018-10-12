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
      const query = await Page.findOne({ url: req.params.url }).select(fields.join(' '))
        .populate('created_by', '-password').populate('image');

      if (query) {
        const contentFields = ['title', 'content', 'content_column', 'content_offset', '_id'];
        const contentQuery = await Content.find({ page_id: query._id }).select(contentFields.join(' '));

        /*
         * Add to statistics.
         */
        Stat.record('page', query._id, req, req.useragent);

        res.render(`themes/${process.env.SITE_THEME}/page`, {
          route: `page:${query._id}`,
          title: query.title,
          page: query,
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
      if (post) {
        /*
         * Add to statistics.
         */
        Stat.record('post', post._id, req, req.useragent);

        res.render(`themes/${process.env.SITE_THEME}/post`, {
          route: `post:${post._id}`,
          title: post.title,
          post,
          previous: await Post.findPrevious(post.created_at),
          next: await Post.findNext(post.created_at),
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
      const query = await Tag.findOne({ url: req.params.url }).select(fields.join(' '));

      if (query) {
        // If the tag exists.
        res.render(`themes/${process.env.SITE_THEME}/tag`, {
          route: `tag:${query._id}`,
          title: query.title,
          tag: query,
          posts: await Post.page(page, { tag: query._id, hidden: false, created_at: { $lte: new Date() } }),
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
      const query = await User.findOne({ _id: req.params.id }).select(fields.join(' '));

      if (query) {
        res.render(`themes/${process.env.SITE_THEME}/user`, {
          route: `user:${query._id}`,
          title: query.username,
          user: query,
          posts: await Post.page(page, { created_by: query._id, hidden: false, created_at: { $lte: new Date() } }),
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
