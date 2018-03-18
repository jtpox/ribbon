/*
 * Controller for Blog.
 */
const Post = require('../model/post');
const User = require('../model/user');
const Tag  = require('../model/tag');

const Config = require('../../config/server');

const Bcrypt = require('bcrypt');

 class Blog {

    list(req, res)
    {
        //List the blog posts with pagination.
        //https://stackoverflow.com/questions/42700884/select-all-the-fields-in-a-mongoose-schema
        var fields = ['title', 'url', 'content','created_at', 'updated_at', '_id'];
        var query  = Tag.find({}).select(fields.join(' '));

        query.exec((err, results) => {
            //console.log(results);
            res.json(results);
        });
    }

    get(req, res)
    {
        //Get tag details.
        var fields = ['title', 'url', 'content','created_at', 'updated_at', '_id', 'posts'];
        var query  = Tag.find({ _id: req.params.id }).select(fields.join(' '))
            .populate('posts');
        
            query.exec((err, results) => {
                res.json(results);
            });
    }

    insert(req, res)
    {
        //Add a blog post.
    }

    delete(req, res)
    {
        //Delete a blog post.
    }

 }

 module.exports = Blog;