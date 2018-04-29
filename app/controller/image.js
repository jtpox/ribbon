/*
 * Controller for Blog.
 */
import Crypto from 'crypto';

import Path from 'path';

import Fs from 'fs';

import Image from '../model/image';

import Db from '../database';// Soley used for the ObjectId type.

class ImageC {
  async list(req, res) {
    try {
      const images = await Image.list();
      res.json(images);
    } catch (err) {
      req.log.error(err);
      res.json({
        error: 1,
      });
    }
  }

  async insert(req, res) {
    // Add an image.
    const image = new Image({
      title: req.files.file.name,
      file_name: req.upload,
      created_by: Db.Types.ObjectId(req.currentUser),
    });
    try {
      const save = await image.save();
      res.json({
        error: 0,
        image: save,
      });
    } catch (err) {
      req.log.error(err);
      res.json({
        error: 1,
      });
    }
  }

  delete(req, res) {
    const image = Image.find({ _id: req.params.id });

    image.exec((err, results) => {
      if (results.length > 0) {
        const directory = Path.join(__dirname, '..', '..', '..', 'public', 'uploads', 'images', results[0].file_name);

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
