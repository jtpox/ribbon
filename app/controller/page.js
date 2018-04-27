/*
 * Controller for Blog.
 */
import Slugify from 'slugify';

import Page from '../model/page';

import Content from '../model/content';

import Db from '../database';// Soley used for the ObjectId type.

class PageC {
  list(req, res) {
    Page.list(false, (err, results) => {
      // console.log(results);
      res.json(results);
    });
  }

  admin_list(req, res) {
    Page.list(true, (err, results) => {
      // console.log(results);
      res.json(results);
    });
  }

  get(req, res) {
    // Get page details.
    Page.get(req.params.id, (err, results) => {
      // res.json(results);

      const content_fields = ['title', 'content', 'content_column', '_id'];
      const content_query = Content.find({ page_id: req.params.id }).select(content_fields.join(' '));

      content_query.exec((content_query_err, content_results) => {
        // results[0].boxes = content_results;

        res.json({
          details: results[0],
          boxes: content_results,
        });
      });
    });
  }

  from_url(req, res) {
    // Get page details.
    Page.from_url(req.params.url, (err, results) => {
      // res.json(results);

      if (results.length > 0) {
        Content.get(results[0]._id, (content_query_err, content_results) => {
          // results[0].boxes = content_results;

          res.json({
            error: 0,
            details: results[0],
            boxes: content_results,
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
    // console.log(req.body);
    if (req.body.title && req.body.content && req.body.boxes) {
      const page = new Page({
        title: req.body.title,
        url: (req.body.url) ? Slugify(req.body.url) : Slugify(req.body.title),
        description: req.body.content,
        created_by: Db.Types.ObjectId(req.currentUser),
        image: (req.body.image !== null) ? Db.Types.ObjectId(req.body.image) : null,
        hidden: (req.body.hidden) ? req.body.hidden : false,
      });

      page.save((err, new_page) => {
        const boxes = [];
        const contents = JSON.parse(req.body.boxes);
        // console.log(contents);
        for (let i = 0; i < contents.length; i++) {
          boxes.push({
            title: contents[i].title,
            content: contents[i].content,
            content_column: contents[i].content_column,
            created_by: Db.Types.ObjectId(req.currentUser),
            page_id: Db.Types.ObjectId(new_page._id),
          });
        }

        Content.collection.insert(boxes, (insert_err, docs) => {
          res.json({
            error: 0,
            page_id: new_page._id,
          });
        });
      });
    } else {
      res.json({
        error: 1,
      });
    }
  }

  update(req, res) {
    // Update a page.
    // console.log(req.body);
    if (req.body.title && req.body.content && req.body.boxes) {
      // console.log(image);

      Page.update({ _id: req.params.id }, {
        title: req.body.title,
        url: (req.body.url) ? Slugify(req.body.url) : Slugify(req.body.title),
        description: req.body.content,
        image: (req.body.image !== null) ? Db.Types.ObjectId(req.body.image) : null,
        hidden: (req.body.hidden) ? req.body.hidden : false,
      }, (err) => {
        if (err) {
          res.json({
            error: 1,
          });
        } else {
          // Delete all content box from the DB.
          Content.remove({ page_id: req.params.id }, (remove_err, result) => {
            const boxes = [];
            const contents = JSON.parse(req.body.boxes);
            // console.log(contents);
            for (let i = 0; i < contents.length; i++) {
              boxes.push({
                title: contents[i].title,
                page_id: Db.Types.ObjectId(req.params.id),
                content: contents[i].content,
                content_column: contents[i].content_column,
                created_by: Db.Types.ObjectId(req.currentUser),
              });
            }

            Content.collection.insertMany(boxes, (insert_err, docs) => {
              res.json({
                error: 0,
              });
            });
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
    Page.find({ _id: req.params.id }).remove().exec();
    Content.find({ page_id: req.params.id }).remove().exec();
    res.json({
      error: 0,
    });
  }
}

export default PageC;
