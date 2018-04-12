/*
    * Obtaining middlewares.
    */
const AuthMid = require('./middleware/auth');

const ImageMid = require('./middleware/image_upload');

/*
 * Instantiating all controller classes.
 */
const Index = require('./controller/index');

const Blog = require('./controller/blog');

const Auth = require('./controller/authenticate');

const Tag = require('./controller/tag');

const User = require('./controller/user');

const Page = require('./controller/page');

const Image = require('./controller/image');

const Navigation = require('./controller/navigation');

function routes(app) {
  const index = new Index();
  const blog = new Blog();
  const auth = new Auth();
  const tag = new Tag();
  const user = new User();
  const page = new Page();
  const image = new Image();
  const navigation = new Navigation();

  app.get('/', index.index);
  // app.get('/ribbon', index.admin);
  // app.get('/ribbon/', index.admin);

  app.post('/api/auth', AuthMid.notLogged, auth.signin);
  app.post('/api/auth/check', auth.check);
  app.post('/api/auth/logout', AuthMid.isLogged, auth.logout);

  app.post('/api/auth/update/about', AuthMid.isLogged, auth.update_about);
  app.post('/api/auth/update/avatar', [AuthMid.isLogged, ImageMid.avatar], auth.update_avatar);
  app.post('/api/auth/details', AuthMid.isLogged, auth.details);

  app.get('/api', blog.site);

  app.get('/api/nav', navigation.list);
  app.post('/api/nav', AuthMid.isLogged, navigation.update);

  app.get('/api/blog', AuthMid.isLogged, blog.list);// Only viewable by admin.
  app.post('/api/blog', AuthMid.isLogged, blog.insert);// Inserting a new blog post.

  app.get('/api/blog/page/:page', blog.paginate);

  app.get('/api/blog/:id', blog.view);
  app.get('/api/blog/url/:url', blog.from_url);
  app.delete('/api/blog/:id', AuthMid.isLogged, blog.delete);// Deleting a blog post. For some reason, it is not working with Angular. But it works with Postman.
  // https://stackoverflow.com/questions/37796227/body-is-empty-when-parsing-delete-request-with-express-and-body-parser
  app.post('/api/blog/delete/:id', AuthMid.isLogged, blog.delete);// Deleting a blog post. Non RESTFUL method.
  app.put('/api/blog/:id', AuthMid.isLogged, blog.update);// Updating a blog post.

  app.get('/api/tags', tag.list);
  app.post('/api/tags', AuthMid.isLogged, tag.insert);// Inserting a new tag.

  app.get('/api/tags/:id', tag.get);
  app.get('/api/tags/:url/page/:page', tag.posts);// Get posts from tags.
  app.put('/api/tags/:id', AuthMid.isLogged, tag.update);
  app.delete('/api/tags/:id', AuthMid.isLogged, tag.delete);
  app.post('/api/tags/delete/:id', AuthMid.isLogged, tag.delete);// Deleting a blog post. Non RESTFUL method.

  app.get('/api/users', user.list);
  app.post('/api/users', AuthMid.isLogged, user.insert);
  app.get('/api/users/:id/page/:page', user.posts);// Get user info and posts.

  app.put('/api/users/:id', AuthMid.isLogged, user.update);
  app.delete('/api/users/:id', AuthMid.isLogged, user.delete);
  app.post('/api/users/delete/:id', AuthMid.isLogged, user.delete);

  app.get('/api/pages', page.list);
  app.get('/api/pages/admin', AuthMid.isLogged, page.admin_list);
  app.post('/api/pages', AuthMid.isLogged, page.insert);

  app.get('/api/pages/:id', AuthMid.isLogged, page.get);// Only viewable by admin.
  app.get('/api/pages/url/:url', page.from_url);
  app.put('/api/pages/:id', AuthMid.isLogged, page.update);
  app.delete('/api/pages/:id', AuthMid.isLogged, page.delete);
  app.post('/api/pages/delete/:id', AuthMid.isLogged, page.delete);

  // app.put('/api/images', AuthMid.isLogged, image.list);// PUT as GET doesn't allow body.
  app.get('/api/images', AuthMid.isLogged, image.list);
  app.post('/api/images', [AuthMid.isLogged, ImageMid.library], image.insert);

  app.delete('/api/images/:id', AuthMid.isLogged, image.delete);
  app.post('/api/images/delete/:id', AuthMid.isLogged, image.delete);
}

module.exports = { routes };
