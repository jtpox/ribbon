/*
 * Controller for Index.
 */
const User = require('../model/user');
const Session = require('../model/session');

const Config = require('../../config/server');

const Bcrypt = require('bcrypt');
const Crypto = require('crypto');
const Path = require('path');
const Fs = require('fs');

const Db = require('../database');// Soley used for the ObjectId type.

class Index {
  signin(req, res) {
    if (req.body.email && req.body.password) {
      // If the email and password fields are not empty, proceed with check.
      User.findByEmail(req.body.email, (err, results) => {
        // console.log(results);

        if (results.length > 0) {
          Bcrypt.compare(req.body.password, results[0].password, (check_err, check) => {
            if (check) {
              // Generate a random string for session.
              Crypto.randomBytes(48, (cryptErr, buffer) => {
                const token = buffer.toString('hex');

                // Encrypt the token to be stored in the database.
                Bcrypt.hash(token, Config.hash.salt_rounds, (hash_err, hash) => {
                  // console.log(results[0]._id);
                  // Insert said token into the database.
                  const session = new Session({
                    token: hash,
                    user: Db.Types.ObjectId(results[0]._id),
                  });

                  session.save((session_save_err, new_session) => {
                    res.json({
                      error: 0,
                      session_id: new_session._id,
                      session_token: token,
                      username: results[0].username,
                      user_id: results[0]._id,
                    });
                  });
                });
              });
            } else {
              // If password do not match.
              res.json({
                error: 1,
              });
            }
          });
        } else {
          res.json({
            error: 1,
          });
        }
      });
    } else {
      res.json({
        error: 1,
      });
    }
  }

  /*
    * Logs the user out.
     */
  logout(req, res) {
    Session.find({ _id: req.body.session_id }).remove().exec();
    res.json({
      error: 0,
    });
  }

  /*
     * Check if session ID and token is valid.
     */
  check(req, res) {
    if (req.body.session_id && req.body.session_token) {
      Session.findBySessionId(req.body.session_id, (err, results) => {
        if (results.length > 0) {
          // Check if the token is valid.
          Bcrypt.compare(req.body.session_token, results[0].token, (compare_err, check) => {
            if (check) {
              /*
                             * Token checks out and session exists.
                             * Tells the client that the auth is valid and can be used.
                             */
              res.json({
                error: 0,
              });
            } else {
              res.json({
                error: 1,
              });
            }
          });
        } else {
          res.json({
            error: 1,
          });
        }
      });
    } else {
      res.json({
        error: 1,
      });
    }
  }

  /*
   * Get user details.
   */
  details(req, res) {
    const fields = ['username', 'email', 'about', 'avatar', 'created_at', 'last_updated'];
    const user = User.find({ _id: req.currentUser }).select(fields.join(' '));

    user.exec((err, results) => {
      res.json(results);
    });
  }

  /*
   * Updating user details.
   */
  update_about(req, res) {
    if (req.body.about) {
      User.update({ _id: req.currentUser }, { about: req.body.about }, (err) => {
        if (err) {
          res.json({
            error: 1,
          });
        } else {
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
  }

  /*
   * Updating user display image.
   * Image upload has been done via middleware.
   * File name is sent to req.upload.
   */
  update_avatar(req, res) {
    // Get current user to check if the avatar is default.
    const fields = ['username', 'email', 'about', 'avatar', 'created_at', 'last_updated'];
    const user = User.find({ _id: req.currentUser }).select(fields.join(' '));
    user.exec((err, results) => {
      User.update({ _id: req.currentUser }, { avatar: req.upload }, (update_err) => {
        if (update_err) {
          res.json({
            error: 1,
          });
        } else {
          if (results[0].avatar !== 'default.png') {
            // Delete the image if it's not default.png.
            const current_avatar = Path.join(__dirname, '..', '..', 'public', 'uploads', 'profile', results[0].avatar);
            Fs.unlink(current_avatar, () => { });
          }

          res.json({
            error: 0,
            image: req.upload,
          });
        }
      });
    });
  }
}

module.exports = Index;
