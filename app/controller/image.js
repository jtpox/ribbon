/*
 * Controller for Blog.
 */
import Crypto from 'crypto';

import Path from 'path';

import Fs from 'fs';

import Image from '../model/image';

import Db from '../database';// Soley used for the ObjectId type.

class ImageC {
  list(req, res) {
    Image.list((err, results) => {
      // console.log(results);
      res.json(results);
    });
  }

  insert(req, res) {
    // Add an image.
    const image = new Image({
      title: req.files.file.name,
      file_name: req.upload,
      created_by: Db.Types.ObjectId(req.currentUser),
    });

    image.save((save_err, new_image) => {
      if (save_err) {
        res.json({
          error: 1,
        });
      } else {
        res.json({
          error: 0,
          image: new_image,
        });
      }
    });
  }

  delete(req, res) {
    // Delete an image.
    /* Tag.find({ _id: req.params.id }).remove().exec();
        res.json({
            error: 0
        }); */
    const image = Image.find({ _id: req.params.id });

    image.exec((err, results) => {
      if (results.length > 0) {
        const directory = Path.join(__dirname, '..', '..', 'public', 'uploads', 'images', results[0].file_name);

        Fs.unlink(directory, (unlink_err) => {
          if (unlink_err) {
            res.json({
              error: 1,
            });
          } else {
            image.remove().exec();
            res.json({
              error: 0,
            });
          }
        });
      } else {
        res.json({
          error: 1,
        });
      }
    });
  }
}

export default ImageC;
