import Rss from '../controller/rss';

module.exports = (app) => {
  const RssController = new Rss();

  app.get('/rss', RssController.index);
};
