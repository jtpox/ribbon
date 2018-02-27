/*
 * Controller for Blog.
 */
const Post = require('../model/post');
const User = require('../model/user');

const Config = require('../../config/server');

const Bcrypt = require('bcrypt');

 class Blog {

    list(req, res)
    {
        var page = 1;
        if( req.params.page != null )
        {
            page = req.params.page;
        }
        //List the blog posts with pagination.
        //https://stackoverflow.com/questions/42700884/select-all-the-fields-in-a-mongoose-schema
        var fields = ['title', 'url', 'content', 'image', 'created_by', 'tag', 'created_at', 'updated_at'];
        var query  = Post.find({}).select(fields.join(' '))
            .populate('image').populate('created_by', '-password').populate('tag');

        query.exec((err, results) => {
            res.json(results);
        });
    }

    view(req, res)
    {
        //View post by id.
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