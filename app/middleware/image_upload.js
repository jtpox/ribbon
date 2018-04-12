/*
 * Image upload middleware for avatar and image management.
 */
const Crypto = require('crypto');
const Path = require('path');

function filterExtension(file) {
  const extension_extract = /(?:\.([^.]+))?$/;
  const extension = extension_extract.exec(file.name);
  // console.log(extension[1]);

  const allowed_extensions = [
    'png',
    'gif',
    'jpg',
    'jpeg',
    'bmp',
  ];

  if (allowed_extensions.indexOf(extension[1]) === -1) {
    return {
      extension: extension[1],
      output: false,
    };
  }

  return {
    extension: extension[1],
    output: true,
  };
}

function avatar(req, res, next) {
  if (req.files) {
    const filter = filterExtension(req.files.file); // Check the file extension.
    if (filter.output) {
      // Generate a random string to be used as a file name.
      const file_name = Crypto.randomBytes(12).toString('hex');
      const directory = Path.join(__dirname, '..', '..', 'public', 'uploads', 'profile', `${file_name}.${filter.extension}`);
      req.files.file.mv(directory, (mv_err) => {
        if (mv_err) {
          res.json({
            error: 1,
          });
        } else {
          req.upload = `${file_name}.${filter.extension}`;
          next();
        }
      });
    } else {
      res.json({
        error: 1,
      });
    }
  } else {
    res.json({
      error: 1,
    });
  }
}

function library(req, res, next) {
  if (req.files) {
    const filter = filterExtension(req.files.file); // Check the file extension.
    if (filter.output) {
      const file_name = Crypto.randomBytes(12).toString('hex');
      const directory = Path.join(__dirname, '..', '..', 'public', 'uploads', 'images', `${file_name}.${filter.extension}`);
      req.files.file.mv(directory, (mv_err) => {
        if (mv_err) {
          res.json({
            error: 1,
          });
        } else {
          req.upload = `${file_name}.${filter.extension}`;
          next();
        }
      });
    } else {
      res.json({
        error: 1,
      });
    }
  } else {
    res.json({
      error: 1,
    });
  }
}

module.exports = { avatar, library };
