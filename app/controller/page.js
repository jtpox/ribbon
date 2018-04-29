/*
 * Controller for Blog.
 */
import Slugify from 'slugify';

import Page from '../model/page';

import Content from '../model/content';

import Db from '../database';// Soley used for the ObjectId type.

class PageC {
  async list(req, res) {
    try {
      res.json(await Page.list(false));
    } catch (err) {
      req.log.error(err);
      res.json({
        error: 1,
      });
    }
  }

  async admin_list(req, res) {
    try {
      res.json(await Page.list(true));
    } catch (err) {
      req.log.error(err);
      res.json({
        error: 1,
      });
    }
  }

  async get(req, res) {
    // Get page details.
    try {
      const page = await Page.get(req.params.id);
      if (page.length > 0) {
        const content_fields = ['title', 'content', 'content_column', '_id'];
        const content_query = await Content.find({ page_id: req.params.id }).select(content_fields.join(' '));
        res.json({
          details: page[0],
          boxes: content_query,
        });
      } else {
        throw new Error('Page does not exist.');
      }
    } catch (err) {
      req.log.error(err);
      res.json({
        error: 1,
      });
    }
  }

  async from_url(req, res) {
    // Get page details.
    try {
      const page = await Page.from_url(req.params.url);
      if (page.length > 0) {
        const content_fields = ['title', 'content', 'content_column', '_id'];
        const content_query = await Content.find({ page_id: page[0]._id }).select(content_fields.join(' '));
        res.json({
          error: 0,
          details: page[0],
          boxes: content_query,
        });
      } else {
        throw new Error('Page does not exist.');
      }
    } catch (err) {
      req.log.error(err);
      res.json({
        error: 1,
      });
    }
  }

  async insert(req, res) {
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
      try {
        const new_page = await page.save();

        const boxes = [];
        const contents = JSON.parse(req.body.boxes);
        for (let i = 0; i < contents.length; i++) {
          boxes.push({
            title: contents[i].title,
            content: contents[i].content,
            content_column: contents[i].content_column,
            created_by: Db.Types.ObjectId(req.currentUser),
            page_id: Db.Types.ObjectId(new_page._id),
          });
        }

        const save_boxes = await Content.collection.insert(boxes);
        res.json({
          error: 0,
          page_id: new_page._id,
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

  async update(req, res) {
    // Update a page.
    // console.log(req.body);
    if (req.body.title && req.body.content && req.body.boxes) {
      try {
        const update = await Page.update({ _id: req.params.id }, {
          title: req.body.title,
          url: (req.body.url) ? Slugify(req.body.url) : Slugify(req.body.title),
          description: req.body.content,
          image: (req.body.image !== null) ? Db.Types.ObjectId(req.body.image) : null,
          hidden: (req.body.hidden) ? req.body.hidden : false,
        });

        // Remove all content boxes.
        const remove = await Content.remove({ page_id: req.params.id });

        // Adding new boxes.
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
        const insert_boxes = await Content.collection.insertMany(boxes);

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
