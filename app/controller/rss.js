import RssGen from '../rss';

import Post from '../model/post';

class Rss {
  async index(req, res) {
    try {
      const latest = await Post.find({ hidden: false }).sort('-createdAt').limit(10);

      /*
       * Constructing the feed.
       */

      const feed = new RssGen(`${process.env.SITE_DOMAIN}/rss`);
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
}

export default Rss;
