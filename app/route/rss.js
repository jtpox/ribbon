import Rss from '../controller/rss';

module.exports = (app) => {
  const RssController = new Rss();

  app.get('/rss', RssController.index);
  app.get('/rss/user/:user', RssController.user);
  app.get('/rss/tag/:tag', RssController.tag);
};
