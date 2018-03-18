/*
 * Controller for Blog.
 */
const Page    = require('../model/page');
const User    = require('../model/user');
const Content = require('../model/content');

const Config  = require('../../config/server');

const Db      = require('../database');//Soley used for the ObjectId type.

const Bcrypt  = require('bcrypt');
const Slugify = require('slugify');

class PageC {

    list(req, res) {
        //List the blog posts with pagination.
        //https://stackoverflow.com/questions/42700884/select-all-the-fields-in-a-mongoose-schema
        var fields = ['title', 'url', 'description'];
        var query = Page.find({}).select(fields.join(' '));

        query.exec((err, results) => {
            //console.log(results);
            res.json(results);
        });
    }

    get(req, res) {
        //Get page details.
        var fields = ['title', 'url', 'description','created_at', 'last_updated', '_id'];
        var query  = Page.find({ _id: req.params.id }).select(fields.join(' '));
        
        query.exec((err, results) => {
            //res.json(results);

            var content_fields = ['title', 'content', 'content_column', '_id'];
            var content_query  = Content.find({ page_id: req.params.id }).select(content_fields.join(' '));

            content_query.exec((err, content_results) => {
                //results[0].boxes = content_results;

                res.json({
                    details: results[0],
                    boxes: content_results
                });
            });
        });
    }

    insert(req, res) {
        //console.log('Here');
        if( req.body.title && req.body.content && req.body.boxes )
        {
            var page = new Page({
                title: req.body.title,
                url: Slugify(req.body.title),
                description: req.body.content,
                created_by: Db.Types.ObjectId(req.currentUser)
            });

            page.save((err, new_page) => {
                var boxes    = [];
                var contents = JSON.parse(req.body.boxes);
                //console.log(contents);
                for( var i = 0; i < contents.length; i++ )
                {
                    boxes.push({
                        title: contents[i].title,
                        content: contents[i].content,
                        content_column: contents[i].content_column,
                        created_by: Db.Types.ObjectId(req.currentUser),
                        page_id: Db.Types.ObjectId(new_page._id)
                    });
                }

                Content.collection.insert(boxes, (err, docs) => {
                    if( err )
                    {
                        res.json({
                            error: 1
                        });
                    }
                    else
                    {
                        res.json({
                            error: 0,
                            page_id: new_page._id
                        });
                    }
                });
            });
        }
        else
        {
            res.json({
                error: 1
            });
        }
    }

    update(req, res) {
        //Update a page.
        if( req.body.title && req.body.content && req.body.boxes )
        {
            Page.update({ id: req.params.id }, { title: req.body.title, url: Slugify(req.body.title), description: req.body.content }, (err) => {
                if( err )
                {
                    res.json({
                        error: 1
                    });
                }
                else
                {
                    //Delete all content boxes from the db.
                    Content.find({ page_id: req.params.id }).remove((err) => {

                        //Add the new ones in.
                        var boxes    = [];
                        var contents = JSON.parse(req.body.boxes);
                        //console.log(contents);
                        for( var i = 0; i < contents.length; i++ )
                        {
                            boxes.push({
                                title: contents[i].title,
                                content: contents[i].content,
                                content_column: contents[i].content_column,
                                created_by: Db.Types.ObjectId(req.currentUser),
                                page_id: Db.Types.ObjectId(req.params.id)
                            });
                        }

                        Content.collection.insert(boxes, (err, docs) => {
                            if( err )
                            {
                                res.json({
                                    error: 1
                                });
                            }
                            else
                            {
                                res.json({
                                    error: 0
                                });
                            }
                        });

                    });
                }
            });
        }
        else
        {
            res.json({
                error: 1
            });
        }
    }

    delete(req, res) {
        //Delete a blog post.
        Page.find({ _id: req.params.id }).remove().exec();
        Content.find({ page_id: req.params.id }).remove().exec();
        res.json({
            error: 0
        });
    }

}

module.exports = PageC;