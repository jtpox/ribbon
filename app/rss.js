class Rss {
  /*
   * url = URL of the RSS feed.
   */
  constructor(description, url) {
    this.description = description;
    this.url = url;
    this.items = '';
  }

  /*
   * Add item to feed.
   * Example: item = { title:xxx, description:xxx, link:xxx, guid:xxx }
   */
  item(item) {
    let feed = '<item>';
    Object.keys(item).forEach((key) => {
      feed += `<${key}>${item[key]}</${key}>`;
    });
    feed += '</item>';

    // Add feed into items list.
    this.items += feed;
  }

  output() {
    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${process.env.SITE_NAME}</title>
    <description>${this.description}</description>
    <link>${process.env.SITE_DOMAIN}</link>
    <atom:link href="${this.url}" rel="self" type="application/rss+xml" />
    ${this.items}
  </channel>
</rss>`;
  }
}

export default Rss;
