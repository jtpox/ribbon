import { isLogged } from '../middleware/auth';

import { isEditor } from '../middleware/group';

import Page from '../controller/page';

import Stat from '../controller/stat';

module.exports = (app) => {
  const page = new Page();
  const stat = new Stat();

  app.get('/api/pages', page.list);
  app.get('/api/pages/admin', [isLogged, isEditor], page.adminList);
  app.post('/api/pages', [isLogged, isEditor], page.insert);

  app.get('/api/pages/:id', [isLogged, isEditor], page.get);// Only viewable by admin.
  app.get('/api/pages/:id/stat', [isLogged, isEditor], stat.page);
  app.get('/api/pages/:id/stat/:days', [isLogged, isEditor], stat.page);
  app.get('/api/pages/:id/stat/:days/number', [isLogged, isEditor], stat.pageArray);
  app.get('/api/pages/:id/stat/:days/browser', [isLogged, isEditor], stat.pageBrowser);
  app.get('/api/pages/:id/stat/:days/os', [isLogged, isEditor], stat.pageOs);
  app.get('/api/pages/:id/stat/:days/platform', [isLogged, isEditor], stat.pagePlatform);
  app.get('/api/pages/:id/stat/:days/log', [isLogged, isEditor], stat.pageLog);
  app.get('/api/pages/url/:url', page.fromUrl);
  app.put('/api/pages/:id', [isLogged, isEditor], page.update);
  app.delete('/api/pages/:id', [isLogged, isEditor], page.delete);
  app.post('/api/pages/delete/:id', [isLogged, isEditor], page.delete);
};
