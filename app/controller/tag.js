/*
 * Controller for Blog.
 */
const Post = require('../model/post');
const Tag = require('../model/tag');

const Slugify = require('slugify');

class TagC {
  list(req, res) {
    Tag.list((err, results) => {
      // console.log(results);
      res.json(results);
    });
  }

  get(req, res) {
    Tag.get(req.params.id, (err, results) => {
      res.json(results);
    });
  }

  posts(req, res) {
    const page = (req.params.page != null) ? req.params.page : 1;
    Tag.from_url(req.params.url, (err, results) => {
      if (results.length > 0) {
        // If the tag exists.
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
        Post.paginate({ tag: results[0]._id, hidden: false, created_at: { $lte: new Date() } }, options).then((post_results) => {
          // console.log(result);
          res.json({
            tag: results[0],
            posts: post_results,
          });
        });
      } else {
        res.json({
          error: 1,
        });
      }
    });
  }

  insert(req, res) {
    // Add a tag.
    if (req.body.title && req.body.content) {
      const tag = new Tag({
        title: req.body.title,
        url: Slugify(req.body.title),
        content: req.body.content,
      });

      tag.save((err, new_tag) => {
        res.json({
          error: 0,
          tag: new_tag,
        });
      });
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

module.exports = TagC;
