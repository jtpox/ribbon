/*
 * Controller for Index.
 */

import Bcrypt from 'bcrypt';

import Crypto from 'crypto';

import Path from 'path';

import Fs from 'fs';

import User from '../model/user';

import Session from '../model/session';

import Config from '../../../config/server.json';

import Db from '../database';// Soley used for the ObjectId type.

class Authenticate {
  async signin(req, res) {
    if (req.body.email && req.body.password) {
      try {
        const find_by_email = await User.find_by_email(req.body.email);
        if (find_by_email.length > 0) {
          const password_compare = await Bcrypt.compare(req.body.password, find_by_email[0].password);
          if (password_compare) {
            const session_token = await Crypto.randomBytes(48).toString('hex');
            const session_hash = await Bcrypt.hash(session_token, Config.hash.salt_rounds);

            const session = new Session({
              token: session_hash,
              user: Db.Types.ObjectId(find_by_email[0]._id),
            });
            const new_session = await session.save();

            res.json({
              error: 0,
              session_id: new_session._id,
              session_token,
              username: find_by_email[0].username,
              user_id: find_by_email[0]._id,
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
        const find_by_id = await Session.find_by_id(req.body.session_id);

        if (find_by_id.length > 0) {
          const token_compare = Bcrypt.compare(req.body.session_token, find_by_id[0].token);

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
  async update_about(req, res) {
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
  async update_avatar(req, res) {
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
}

export default Authenticate;
