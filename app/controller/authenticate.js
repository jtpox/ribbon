/*
 * Controller for Index.
 */

import Bcrypt from 'bcrypt';

import Crypto from 'crypto';

import Path from 'path';

import Fs from 'fs';

import User from '../model/user';

import Session from '../model/session';

import Db from '../database';// Soley used for the ObjectId type.

class Authenticate {
  async signin(req, res) {
    if (req.body.email && req.body.password) {
      try {
        const findByEmail = await User.findByEmail(req.body.email);
        if (findByEmail.length > 0) {
          const passwordCompare = await Bcrypt.compare(req.body.password, findByEmail[0].password);
          if (passwordCompare) {
            const sessionToken = await Crypto.randomBytes(48).toString('hex');
            const sessionHash = await Bcrypt.hash(sessionToken, parseInt(process.env.HASH_SALT_ROUNDS, 10));

            const session = new Session({
              token: sessionHash,
              user: Db.Types.ObjectId(findByEmail[0]._id),
            });
            const newSession = await session.save();

            res.json({
              error: 0,
              session_id: newSession._id,
              session_token: sessionToken,
              username: findByEmail[0].username,
              user_id: findByEmail[0]._id,
              user_group: findByEmail[0].group,
            });
          } else {
            throw new Error('Invalid Authentication Details');
          }
        } else {
          throw new Error('Invalid Authentication Details');
        }
      } catch (err) {
        req.log.error(err);
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
  async check(req, res) {
    if (req.body.session_id && req.body.session_token) {
      try {
        const findById = await Session.findById(req.body.session_id);

        if (findById.length > 0) {
          const token_compare = Bcrypt.compare(req.body.session_token, findById[0].token);

          if (token_compare) {
            res.json({
              error: 0,
            });
          } else {
            throw new Error('Invalid session token.');
          }
        } else {
          throw new Error('Session ID does not exist.');
        }
      } catch (err) {
        req.log.error(err);
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

  /*
   * Get user details.
   */
  async details(req, res) {
    const fields = ['username', 'email', 'about', 'avatar', 'created_at', 'last_updated'];
    try {
      res.json(await User.find({ _id: req.currentUser }).select(fields.join(' ')));
    } catch (err) {
      req.log.error(err);
      res.json({
        error: 1,
      });
    }
  }

  /*
   * Updating user details.
   */
  async updateAbout(req, res) {
    if (req.body.about) {
      try {
        const update = await User.update({ _id: req.currentUser }, { about: req.body.about });
        res.json({
          error: 0,
        });
      } catch (err) {
        req.log.error(err);
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

  /*
   * Updating user display image.
   * Image upload has been done via middleware.
   * File name is sent to req.upload.
   */
  async updateAvatar(req, res) {
    // Get current user to check if the avatar is default.
    try {
      const fields = ['username', 'email', 'about', 'avatar', 'created_at', 'last_updated'];
      const user = await User.find({ _id: req.currentUser }).select(fields.join(' '));

      const update = await User.update({ _id: req.currentUser }, { avatar: req.upload });

      if (user[0].avatar !== 'default.png') {
        // Delete the image if it's not default.png.
        const current_avatar = Path.join(__dirname, '..', '..', 'public', 'uploads', 'profile', user[0].avatar);
        Fs.unlink(current_avatar, () => { });
      }

      res.json({
        error: 0,
        image: req.upload,
      });
    } catch (err) {
      req.log.error(err);
      res.json({
        error: 1,
      });
    }
  }

  /*
   * Update user password.
   */
  async updatePassword(req, res) {
    try {
      if (req.body.old && req.body.new) {
        const user = await User.find({ _id: req.currentUser }).select('username email password');
        const passwordCompare = await Bcrypt.compare(req.body.old, user[0].password);
        if (passwordCompare) {
          const newPassword = await Bcrypt.hash(req.body.new, parseInt(process.env.HASH_SALT_ROUNDS, 10));
          const update = await User.update({ _id: req.currentUser }, { password: newPassword });

          res.json({
            error: 0,
          });
        } else {
          throw new Error('Invalid password.');
        }
      } else {
        throw new Error('Invalid form inputs.');
      }
    } catch (err) {
      req.log.error(err);
      res.json({
        error: 1,
      });
    }
  }
}

export default Authenticate;
