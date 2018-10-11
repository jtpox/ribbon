import { isLogged } from '../middleware/auth';

import { isAdmin } from '../middleware/group';

import User from '../controller/user';

module.exports = (app) => {
  const user = new User();

  app.get('/api/users', [isLogged, isAdmin], user.list);
  app.post('/api/users', [isLogged, isAdmin], user.insert);
  app.get('/api/users/:id/page/:page', user.posts);// Get user info and posts.

  app.put('/api/users/:id', [isLogged, isAdmin], user.update);
  app.delete('/api/users/:id', [isLogged, isAdmin], user.delete);
  app.post('/api/users/delete/:id', [isLogged, isAdmin], user.delete);
};
