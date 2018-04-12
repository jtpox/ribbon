/*
 * Controller for Index.
 */
const Path = require('path');
const Config = require('../../config/server');

class Index {
  index(req, res) {
    res.sendFile(Path.join(__dirname, '..', '..', 'themes', Config.theme, 'index.html'));
  }

  admin(req, res) {
    // res.sendFile(Path.join(__dirname, '..', '..', 'public', 'admin.html'));
    res.sendFile(Path.join(__dirname, '..', '..', 'admin', Config.admin, 'index.html'));
  }
}

module.exports = Index;
