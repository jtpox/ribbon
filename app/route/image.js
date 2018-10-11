import { isLogged } from '../middleware/auth';

import { isEditor, isAdmin } from '../middleware/group';

import { library } from '../middleware/image_upload';

import Image from '../controller/image';

module.exports = (app) => {
  const image = new Image();

  // app.put('/api/images', isLogged, image.list);// PUT as GET doesn't allow body.
  app.get('/api/images', [isLogged, isEditor], image.list);
  app.post('/api/images', [isLogged, isAdmin, library], image.insert);

  app.delete('/api/images/:id', [isLogged, isAdmin], image.delete);
  app.post('/api/images/delete/:id', [isLogged, isAdmin], image.delete);
};
