import Index from '../controller/index';

module.exports = (app) => {
  const index = new Index();

  app.get('/', index.index);
  app.get('/p/:page', index.index); // Pagination for the blog posts.
  app.get('/page/:url', index.page);
  app.get('/post/:url', index.post);

  app.get('/tag/:url', index.tag);
  app.get('/tag/:url/:page', index.tag);

  app.get('/user/:id', index.user);
  app.get('/user/:id/:page', index.user);
};
