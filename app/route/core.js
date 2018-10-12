import { isLogged, notLogged } from '../middleware/auth';

import { avatar } from '../middleware/image_upload';

import { isAdmin } from '../middleware/group';

import navigationMiddleware from '../middleware/navigation';

import Auth from '../controller/authenticate';

import Blog from '../controller/blog';

import Navigation from '../controller/navigation';

module.exports = (app) => {
  const auth = new Auth();
  const blog = new Blog();
  const navigation = new Navigation();

  app.use(navigationMiddleware);

  app.post('/api/auth', notLogged, auth.signin);
  app.post('/api/auth/check', auth.check);
  app.post('/api/auth/logout', isLogged, auth.logout);

  app.post('/api/auth/update/about', isLogged, auth.updateAbout);
  app.post('/api/auth/update/avatar', [isLogged, avatar], auth.updateAvatar);
  app.post('/api/auth/update/password', isLogged, auth.updatePassword);
  app.post('/api/auth/details', isLogged, auth.details);

  app.get('/api', blog.site);

  app.get('/api/nav', navigation.list);
  app.post('/api/nav', [isLogged, isAdmin], navigation.update);
};
