/*
 * Controller for Blog.
 */
const Post = require('../model/post');
const User = require('../model/user');
const Tag  = require('../model/tag');

const Config = require('../../config/server');

const Bcrypt  = require('bcrypt');
const Slugify = require('slugify');

const Db = require('../database');//Soley used for the ObjectId type.

 class Blog {

    paginate(req, res)
    {
        var page = 1;
        if( req.params.page != null )
        {
            page = req.params.page;
        }
        //List the blog posts with pagination.
        //https://stackoverflow.com/questions/42700884/select-all-the-fields-in-a-mongoose-schema
        var fields = ['title', 'url', 'content', 'image', 'created_by', 'tag', 'created_at', 'updated_at', '_id'];
        var query  = Post.find({}).select(fields.join(' ')).sort({ date: 'descending' })
            .populate('image').populate('created_by', '-password').populate('tag image');

        query.exec((err, results) => {
            res.json(results);
        });
    }

    list(req, res)
    {
        var page = 1;
        if( req.params.page != null )
        {
            page = req.params.page;
        }
        //List the blog posts with pagination.
        //https://stackoverflow.com/questions/42700884/select-all-the-fields-in-a-mongoose-schema
        var fields = ['title', 'url', 'content', 'image', 'created_by', 'tag', 'created_at', 'updated_at', '_id'];
        var query  = Post.find({}).select(fields.join(' ')).sort({ created_at: 'descending' })
            .populate('created_by', '-password').populate('tag');

        query.exec((err, results) => {
            //console.log(results);
            res.json(results);
        });
    }

    view(req, res)
    {
        //View post by id.
        var fields = ['title', 'url', 'content', 'image', 'created_by', 'tag', 'created_at', 'updated_at'];
        var query = Post.find({ '_id': req.params.id }).select(fields.join(' '))
            .populate('created_by', '-password').populate('tag');
        query.exec((err, result) => {
            //console.log(result);
            res.json(result);
        });
    }

    insert(req, res)
    {
        //console.log(req.currentUser);
        //Add a blog post.
        if( req.body.title && req.body.content && req.body.tag )
        {
            var post = new Post({
                title: req.body.title,
                url: Slugify(req.body.title),
                content: req.body.content,
                image: Db.Types.ObjectId('5aad3461318533ae44eefbcf'),
                created_by: Db.Types.ObjectId(req.currentUser),
                tag: Db.Types.ObjectId(req.body.tag)
            });

            post.save((err, new_post) => {
                res.json({
                    error: 0,
                    post_id: new_post._id
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

    delete(req, res)
    {
        //Delete a blog post.
        Post.find({ _id: req.params.id }).remove().exec();
        res.json({
            error: 0
        });
    }

    update(req, res)
    {
        //Update a blog post.
        if( req.body.title && req.body.content && req.body.tag )
        {
            Post.update({ _id: req.params.id }, { title: req.body.title, url: Slugify(req.body.title), content: req.body.content, tag: Db.Types.ObjectId(req.body.tag) }, (err) => {
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

 }

 module.exports = Blog;