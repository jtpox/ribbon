import Post from '../model/post';

class Rss {
  async index(req, res) {
    try {
      const latest = await Post.find({ hidden: false }).sort('-createdAt').limit(10);

      /*
       * Constructing the feed.
       */

      let posts = '';
      let lastUpdate = null;

      latest.forEach((post, index) => {
        lastUpdate = (lastUpdate == null) ? post.createdAt : lastUpdate;
        posts += `<item>
        <title>${post.title}</title>
        <description>${post.no_tags_short}</description>
        <link>${process.env.SITE_DOMAIN}/post/${post.url}</link>
        <guid>${process.env.SITE_DOMAIN}/post/${post.url}</guid>
    </item>`;
      });
      // res.json(latest);

      const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${process.env.SITE_NAME}</title>
    <description>${process.env.SITE_NAME}</description>
    <link>${process.env.SITE_DOMAIN}</link>
    <atom:link href="${process.env.SITE_DOMAIN}/rss" rel="self" type="application/rss+xml" />
    ${posts}
  </channel>
</rss>`;

      /*
       * Setting header and replying the request.
       */
      res.setHeader('Content-Type', 'application/rss+xml');
      res.send(feed);
    } catch (err) {
      req.log.error(err);
    }
  }
}

export default Rss;
