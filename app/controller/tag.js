/*
 * Controller for Blog.
 */
const Post = require('../model/post');
const User = require('../model/user');
const Tag  = require('../model/tag');

const Config = require('../../config/server');

const Slugify = require('slugify');

 class TagC {

    list(req, res)
    {
        //List the blog posts with pagination.
        //https://stackoverflow.com/questions/42700884/select-all-the-fields-in-a-mongoose-schema
        var fields = ['title', 'url', 'content','created_at', 'last_updated', '_id'];
        var query  = Tag.find({}).select(fields.join(' '));

        query.exec((err, results) => {
            //console.log(results);
            res.json(results);
        });
    }

    get(req, res)
    {
        //Get tag details.
        var fields = ['title', 'url', 'content','created_at', 'last_updated', '_id', 'posts'];
        var query  = Tag.find({ _id: req.params.id }).select(fields.join(' '))
            .populate('posts');
        
        query.exec((err, results) => {
            res.json(results);
        });
    }

    insert(req, res)
    {
        //Add a tag.
        if( req.body.title && req.body.content )
        {
            var tag = new Tag({
                title: req.body.title,
                url: Slugify(req.body.title),
                content: req.body.content
            });

            tag.save((err, new_tag) => {
                res.json({
                    error: 0,
                    tag: new_tag
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

    update(req, res)
    {
        //Update a tag.
        if( req.body.title && req.body.content )
        {
            Tag.update({ _id: req.params.id }, { title: req.body.title, url: Slugify(req.body.title), content: req.body.content }, (err) => {
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
        }
        else
        {
            res.json({
                error: 1
            });
        }
    }

    delete(req, res)
    {
        //Delete a blog post.
        Tag.find({ _id: req.params.id }).remove().exec();
        res.json({
            error: 0
        });
    }

 }

 module.exports = TagC;