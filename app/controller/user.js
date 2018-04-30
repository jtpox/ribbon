/*
 * Controller for Blog.
 */
import Bcrypt from 'bcrypt';

import Post from '../model/post';

import User from '../model/user';

import Config from '../../../config/server.json';

class UserC {
  async list(req, res) {
    try {
      res.json(await User.list());
    } catch (err) {
      req.log.error(err);
      res.json({
        error: 1,
      });
    }
  }

  async posts(req, res) {
    const page = (req.params.page != null) ? req.params.page : 1;
    try {
      const user = await User.get(req.params.id);

      if (user.length > 0) {
        const options = {
          select: 'title url content image created_by tag created_at last_updated _id',
          sort: { created_at: 'descending' },
          populate: [
            {
              path: 'created_by',
              select: '-password',
            },
            {
              path: 'tag',
            },
            {
              path: 'image',
            },
          ],
          lean: false,
          limit: 10,
          page,
        };
        res.json({
          user: user[0],
          posts: await Post.paginate({ created_by: user[0]._id, hidden: false, created_at: { $lte: new Date() } }, options),
        });
      } else {
        throw new Error('User does not exist.');
      }
    } catch (err) {
      req.log.error(err);
      res.json({
        error: 1,
      });
    }
  }

  async insert(req, res) {
    // Add a user.
    if (req.body.username && req.body.password && req.body.email) {
      try {
        const emailCheck = await User.find({ email: req.body.email });
        const usernameCheck = await User.find({ username: req.body.username });

        if (usernameCheck.length < 1 && emailCheck.length < 1) {
          const newUser = new User({
            username: req.body.username,
            password: await Bcrypt.hash(req.body.password, Config.hash.salt_rounds),
            email: req.body.email,
          });

          res.json({
            error: 0,
            user: await newUser.save(),
          });
        } else {
          throw new Error('Username or Email is already taken.');
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

  async update(req, res) {
    // Update a tag.
    // console.log('here');
    if (req.body.username && req.body.email) {
      // Check if password field is there.
      if (req.body.password && req.body.password !== null) {
        try {
          const update = await User.update(
            { _id: req.params.id },
            {
              username: req.body.username,
              email: req.body.email,
              password: await Bcrypt.hash(req.body.password, Config.hash.salt_rounds),
            },
          );
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
        try {
          const update = await User.update(
            { _id: req.params.id },
            {
              username: req.body.username,
              email: req.body.email,
            },
          );

          res.json({
            error: 0,
          });
        } catch (err) {
          req.log.error(err);
          res.json({
            error: 1,
          });
        }
      }
    } else {
      res.json({
        error: 1,
      });
    }
  }

  delete(req, res) {
    // Delete a blog post.
    User.find({ _id: req.params.id }).remove().exec();
    res.json({
      error: 0,
    });
  }
}

export default UserC;
