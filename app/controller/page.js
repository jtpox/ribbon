/*
 * Controller for Blog.
 */
import Slugify from 'slugify';

import Page from '../model/page';

import Content from '../model/content';

import Stat from '../model/stat';

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

  async adminList(req, res) {
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
      if (page) {
        const contentFields = ['title', 'content', 'content_column', '_id'];
        const contentQuery = await Content.find({ page_id: req.params.id }).select(contentFields.join(' '));
        res.json({
          details: page,
          boxes: contentQuery,
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

  async fromUrl(req, res) {
    // Get page details.
    try {
      const page = await Page.fromUrl(req.params.url);
      if (page) {
        const contentFields = ['title', 'content', 'content_column', '_id'];
        const contentQuery = await Content.find({ page_id: page._id }).select(contentFields.join(' '));

        /*
         * Add to statistics.
         */
        Stat.record('page', page._id, req, req.useragent);

        res.json({
          error: 0,
          details: page,
          boxes: contentQuery,
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
        const newPage = await page.save();

        const boxes = [];
        const contents = JSON.parse(req.body.boxes);
        for (let i = 0; i < contents.length; i++) {
          boxes.push({
            title: contents[i].title,
            content: contents[i].content,
            content_column: contents[i].content_column,
            created_by: Db.Types.ObjectId(req.currentUser),
            page_id: Db.Types.ObjectId(newPage._id),
          });
        }

        const saveBoxes = await Content.collection.insert(boxes);
        res.json({
          error: 0,
          page_id: newPage._id,
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
        const update = await Page.updateOne({ _id: req.params.id }, {
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
        const insertBoxes = await Content.collection.insertMany(boxes);

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
