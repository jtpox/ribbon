/*
 * Controller for Blog.
 */
import Slugify from 'slugify';

import Post from '../model/post';

import Tag from '../model/tag';

class TagC {
  async list(req, res) {
    try {
      res.json(await Tag.list());
    } catch (err) {
      req.log.error(err);
      res.json({
        error: 1,
      });
    }
  }

  async get(req, res) {
    try {
      res.json(await Tag.get(req.params.id));
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
      const fromUrl = await Tag.fromUrl(req.params.url);

      if (fromUrl.length > 0) {
        // If the tag exists.
        const paginate = await Post.page(
          page,
          {
            tag: fromUrl[0]._id,
            hidden: false,
            created_at: { $lte: new Date() },
          },
        );
        res.json({
          tag: fromUrl[0],
          posts: paginate,
        });
      } else {
        throw new Error('Tag does not exist.');
      }
    } catch (err) {
      req.log.error(err);
      res.json({
        error: 1,
      });
    }
  }

  async insert(req, res) {
    // Add a tag.
    if (req.body.title && req.body.content) {
      const tag = new Tag({
        title: req.body.title,
        url: Slugify(req.body.title),
        content: req.body.content,
      });

      try {
        const save = await tag.save();
        res.json({
          error: 0,
          tag: save,
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

  update(req, res) {
    // Update a tag.
    if (req.body.title && req.body.content) {
      Tag.update({ _id: req.params.id }, { title: req.body.title, url: Slugify(req.body.title), content: req.body.content }, (err) => {
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

  delete(req, res) {
    // Delete a blog post.
    Tag.find({ _id: req.params.id }).remove().exec();
    res.json({
      error: 0,
    });
  }
}

export default TagC;
