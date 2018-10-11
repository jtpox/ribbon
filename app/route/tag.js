import { isLogged } from '../middleware/auth';

import { isAdmin } from '../middleware/group';

import Tag from '../controller/tag';

module.exports = (app) => {
  const tag = new Tag();

  app.get('/api/tags', tag.list);
  app.post('/api/tags', [isLogged, isAdmin], tag.insert);// Inserting a new tag.

  app.get('/api/tags/:id', tag.get);
  app.get('/api/tags/:url/page/:page', tag.posts);// Get posts from tags.
  app.put('/api/tags/:id', [isLogged, isAdmin], tag.update);
  app.delete('/api/tags/:id', [isLogged, isAdmin], tag.delete);
  app.post('/api/tags/delete/:id', [isLogged, isAdmin], tag.delete);// Deleting a blog post. Non RESTFUL method.
};