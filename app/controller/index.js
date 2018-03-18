/*
 * Controller for Index.
 */
const Post = require('../model/post');
const User = require('../model/user');
const Tag  = require('../model/tag');

const Config = require('../../config/server');

const Bcrypt = require('bcrypt');

 class Index {

    index(req, res)
    {
        /*var post = new Post({
            title: 'First!',
            content: 'First!',
            url: 'first',
            created_by: 1
        });

        post.save((err, results) => {
            res.send(results._id);
        });*/

        Post.find({ created_by:1 }).exec((err, result) => {
            if( result == null )
            {
                res.json({
                    error: 1
                });
            }
            else
            {
                res.json({
                    error: 0,
                    data: result
                });
            }
        });
    }

    temp(req, res)
    {
        /*Bcrypt.hash('password', Config.hash.salt_rounds, (err, hash) => {
            var user = new User({
                username: 'admin',
                password: hash,
                email: 'admin@admin.com'
            });

            user.save((err, results) => {
                res.send(results._id);
            });
        });*/

        var tag = new Tag({
            title: 'Example',
            url: 'example',
            content: 'Example tag.',
        });

        tag.save((err, results) => {
            res.send(results._id);
        });
    }

 }

 module.exports = Index;