import { isLogged } from '../middleware/auth';

import { isEditor } from '../middleware/group';

import Blog from '../controller/blog';

import Stat from '../controller/stat';

module.exports = (app) => {
  const blog = new Blog();
  const stat = new Stat();

  app.get('/api/blog', [isLogged, isEditor], blog.list);// Only viewable by admin.
  app.post('/api/blog', [isLogged, isEditor], blog.insert);// Inserting a new blog post.

  app.get('/api/blog/page/:page', blog.paginate);

  app.get('/api/blog/:id', blog.view);
  app.get('/api/blog/:id/stat', [isLogged, isEditor], stat.post);
  app.get('/api/blog/:id/stat/:days', [isLogged, isEditor], stat.post);
  app.get('/api/blog/:id/stat/:days/number', [isLogged, isEditor], stat.postArray);
  app.get('/api/blog/:id/stat/:days/browser', [isLogged, isEditor], stat.postBrowser);
  app.get('/api/blog/:id/stat/:days/os', [isLogged, isEditor], stat.postOs);
  app.get('/api/blog/:id/stat/:days/platform', [isLogged, isEditor], stat.postPlatform);
  app.get('/api/blog/:id/stat/:days/log', [isLogged, isEditor], stat.postLog);
  app.get('/api/blog/url/:url', blog.fromUrl);
  app.delete('/api/blog/:id', [isLogged, isEditor], blog.delete);// Deleting a blog post. For some reason, it is not working with Angular. But it works with Postman.
  // https://stackoverflow.com/questions/37796227/body-is-empty-when-parsing-delete-request-with-express-and-body-parser
  app.post('/api/blog/delete/:id', [isLogged, isEditor], blog.delete);// Deleting a blog post. Non RESTFUL method.
  app.put('/api/blog/:id', [isLogged, isEditor], blog.update);// Updating a blog post.
};
