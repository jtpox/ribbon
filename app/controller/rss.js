import RssGen from '../rss';

import Post from '../model/post';

import Tag from '../model/tag';

import User from '../model/user';

class Rss {
  async index(req, res) {
    try {
      const latest = await Post.find({ hidden: false }).sort('-createdAt').limit(10);

      /*
       * Constructing the feed.
       */

      const feed = new RssGen(
        `RSS feed for ${process.env.SITE_NAME}`,
        `${process.env.SITE_DOMAIN}/rss`,
      );
      let lastUpdate = null;

      latest.forEach((post, index) => {
        lastUpdate = (lastUpdate == null) ? post.createdAt : lastUpdate;
        feed.item({
          title: post.title,
          description: post.no_tags_short,
          link: `${process.env.SITE_DOMAIN}/post/${post.url}`,
          guid: `${process.env.SITE_DOMAIN}/post/${post.url}`,
        });
      });
      // res.json(latest);

      /*
       * Setting header and replying the request.
       */
      res.setHeader('Content-Type', 'application/rss+xml');
      res.send(feed.output());
    } catch (err) {
      req.log.error(err);
    }
  }

  async user(req, res) {
    try {
      // const latest = await Post.find({ created_by: req.params.user }).sort('createdAt').limit(10);
      const fields = ['username', 'email', 'about', 'created_at', 'avatar', '_id'];
      const user = await User
        .findOne({ username: req.params.user })
        .select(fields.join(' '))
        .populate('posts');
      if (user) {
        const latest = await Post.find({ hidden: false, created_by: user._id }).sort('-createdAt').limit(10);

        /*
         * Constructing the feed.
         */
        const feed = new RssGen(
          `User RSS feed for ${user.username}`,
          `${process.env.SITE_DOMAIN}/rss/user/${user.username}`,
        );
        let lastUpdate = null;

        latest.forEach((post, index) => {
          lastUpdate = (lastUpdate == null) ? post.createdAt : lastUpdate;
          feed.item({
            title: post.title,
            description: post.no_tags_short,
            link: `${process.env.SITE_DOMAIN}/post/${post.url}`,
            guid: `${process.env.SITE_DOMAIN}/post/${post.url}`,
          });
        });
        // res.json(latest);

        /*
         * Setting header and replying the request.
         */
        res.setHeader('Content-Type', 'application/rss+xml');
        res.send(feed.output());
      } else {
        res.redirect('/');
      }
    } catch (err) {
      req.log.error(err);
    }
  }

  async tag(req, res) {
    try {
      // const latest = await Post.find({ created_by: req.params.user }).sort('createdAt').limit(10);
      const tag = await Tag
        .findOne({ url: req.params.tag });
      if (tag) {
        const latest = await Post.find({ hidden: false, tag: tag._id }).sort('-createdAt').limit(10);

        /*
         * Constructing the feed.
         */
        const feed = new RssGen(
          `Tag RSS feed for ${tag.title}`,
          `${process.env.SITE_DOMAIN}/rss/tag/${tag.title}`,
        );

        let lastUpdate = null;

        latest.forEach((post, index) => {
          lastUpdate = (lastUpdate == null) ? post.createdAt : lastUpdate;
          feed.item({
            title: post.title,
            description: post.no_tags_short,
            link: `${process.env.SITE_DOMAIN}/post/${post.url}`,
            guid: `${process.env.SITE_DOMAIN}/post/${post.url}`,
          });
        });
        // res.json(latest);

        /*
         * Setting header and replying the request.
         */
        res.setHeader('Content-Type', 'application/rss+xml');
        res.send(feed.output());
      } else {
        res.redirect('/');
      }
    } catch (err) {
      req.log.error(err);
    }
  }
}

export default Rss;
