/*
    * Obtaining middlewares.
    */
import { isLogged, notLogged } from './middleware/auth';

import { avatar, library } from './middleware/image_upload';

import navigationMiddleware from './middleware/navigation';

/*
 * Instantiating all controller classes.
 */
import Index from './controller/index';

import Blog from './controller/blog';

import Auth from './controller/authenticate';

import Tag from './controller/tag';

import User from './controller/user';

import Page from './controller/page';

import Image from './controller/image';

import Navigation from './controller/navigation';

import Stat from './controller/stat';

function routes(app) {
  const index = new Index();
  const blog = new Blog();
  const auth = new Auth();
  const tag = new Tag();
  const user = new User();
  const page = new Page();
  const image = new Image();
  const navigation = new Navigation();
  const stat = new Stat();

  app.use(navigationMiddleware);

  app.get('/', index.index);
  app.get('/p/:page', index.index);// Pagination for the blog posts.
  app.get('/page/:url', index.page);
  app.get('/post/:url', index.post);

  app.get('/tag/:url', index.tag);
  app.get('/tag/:url/:page', index.tag);

  app.get('/user/:id', index.user);
  app.get('/user/:id/:page', index.user);
  // app.get('/ribbon', index.admin);
  // app.get('/ribbon/', index.admin);

  app.post('/api/auth', notLogged, auth.signin);
  app.post('/api/auth/check', auth.check);
  app.post('/api/auth/logout', isLogged, auth.logout);

  app.post('/api/auth/update/about', isLogged, auth.updateAbout);
  app.post('/api/auth/update/avatar', [isLogged, avatar], auth.updateAvatar);
  app.post('/api/auth/update/password', isLogged, auth.updatePassword);
  app.post('/api/auth/details', isLogged, auth.details);

  app.get('/api', blog.site);

  app.get('/api/nav', navigation.list);
  app.post('/api/nav', isLogged, navigation.update);

  app.get('/api/blog', isLogged, blog.list);// Only viewable by admin.
  app.post('/api/blog', isLogged, blog.insert);// Inserting a new blog post.

  app.get('/api/blog/page/:page', blog.paginate);

  app.get('/api/blog/:id', blog.view);
  app.get('/api/blog/:id/stat', isLogged, stat.post);
  app.get('/api/blog/:id/stat/:days', isLogged, stat.post);
  app.get('/api/blog/:id/stat/:days/number', isLogged, stat.postArray);
  app.get('/api/blog/:id/stat/:days/browser', isLogged, stat.postBrowser);
  app.get('/api/blog/:id/stat/:days/os', isLogged, stat.postOs);
  app.get('/api/blog/:id/stat/:days/platform', isLogged, stat.postPlatform);
  app.get('/api/blog/url/:url', blog.fromUrl);
  app.delete('/api/blog/:id', isLogged, blog.delete);// Deleting a blog post. For some reason, it is not working with Angular. But it works with Postman.
  // https://stackoverflow.com/questions/37796227/body-is-empty-when-parsing-delete-request-with-express-and-body-parser
  app.post('/api/blog/delete/:id', isLogged, blog.delete);// Deleting a blog post. Non RESTFUL method.
  app.put('/api/blog/:id', isLogged, blog.update);// Updating a blog post.

  app.get('/api/tags', tag.list);
  app.post('/api/tags', isLogged, tag.insert);// Inserting a new tag.

  app.get('/api/tags/:id', tag.get);
  app.get('/api/tags/:url/page/:page', tag.posts);// Get posts from tags.
  app.put('/api/tags/:id', isLogged, tag.update);
  app.delete('/api/tags/:id', isLogged, tag.delete);
  app.post('/api/tags/delete/:id', isLogged, tag.delete);// Deleting a blog post. Non RESTFUL method.

  app.get('/api/users', user.list);
  app.post('/api/users', isLogged, user.insert);
  app.get('/api/users/:id/page/:page', user.posts);// Get user info and posts.

  app.put('/api/users/:id', isLogged, user.update);
  app.delete('/api/users/:id', isLogged, user.delete);
  app.post('/api/users/delete/:id', isLogged, user.delete);

  app.get('/api/pages', page.list);
  app.get('/api/pages/admin', isLogged, page.adminList);
  app.post('/api/pages', isLogged, page.insert);

  app.get('/api/pages/:id', isLogged, page.get);// Only viewable by admin.
  app.get('/api/pages/:id/stat', isLogged, stat.page);
  app.get('/api/pages/:id/stat/:days', isLogged, stat.page);
  app.get('/api/pages/:id/stat/:days/number', isLogged, stat.pageArray);
  app.get('/api/pages/:id/stat/:days/browser', isLogged, stat.pageBrowser);
  app.get('/api/pages/:id/stat/:days/os', isLogged, stat.pageOs);
  app.get('/api/pages/:id/stat/:days/platform', isLogged, stat.pagePlatform);
  app.get('/api/pages/url/:url', page.fromUrl);
  app.put('/api/pages/:id', isLogged, page.update);
  app.delete('/api/pages/:id', isLogged, page.delete);
  app.post('/api/pages/delete/:id', isLogged, page.delete);

  // app.put('/api/images', isLogged, image.list);// PUT as GET doesn't allow body.
  app.get('/api/images', isLogged, image.list);
  app.post('/api/images', [isLogged, library], image.insert);

  app.delete('/api/images/:id', isLogged, image.delete);
  app.post('/api/images/delete/:id', isLogged, image.delete);
}

export { routes as default };
