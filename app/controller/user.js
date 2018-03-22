/*
 * Controller for Blog.
 */
const Post    = require('../model/post');
const User    = require('../model/user');

const Config  = require('../../config/server');

const Bcrypt  = require('bcrypt');
const Slugify = require('slugify');

class UserC {

    list(req, res) {
        //List the blog posts with pagination.
        //https://stackoverflow.com/questions/42700884/select-all-the-fields-in-a-mongoose-schema
        var fields = ['username', 'email', 'about', 'avatar', 'created_at', 'last_updated', '_id'];
        var query = User.find({}).select(fields.join(' '));

        query.exec((err, results) => {
            //console.log(results);
            res.json(results);
        });
    }

    posts(req, res) {
        var page = 1;
        if( req.params.page != null )
        {
            page = req.params.page;
        }

        var fields = ['username', 'email', 'about', 'created_at', 'avatar', '_id'];
        var query  = User.find({ _id: req.params.id }).select(fields.join(' '));

        query.exec((err, results) => {

            if( results.length > 0 )
            {
                //If the tag exists.
                var options = {
                    select: 'title url content image created_by tag created_at last_updated _id',
                    sort: { created_at: 'descending' },
                    populate: [
                        {
                            path: 'created_by',
                            select: '-password'
                        },
                        {
                            path: 'tag'
                        },
                        {
                            path: 'image'
                        }
                    ],
                    lean: false,
                    limit: 10,
                    page: page
                };
                Post.paginate({ created_by: results[0]._id }, options).then(function(post_results) {
                    //console.log(result);
                    res.json({
                        user: results[0],
                        posts: post_results
                    });
                });

            }
            else
            {
                res.json({
                    error: 1
                });
            }

        });
    }

    insert(req, res) {
        //Add a user.
        if (req.body.username && req.body.password && req.body.email) {
            User.find({ email: req.body.email }).exec((err, results) => {
                if (results.length > 0) {
                    res.json({
                        error: 1
                    });
                }
                else {
                    //Add user as email is not taken.
                    Bcrypt.hash(req.body.password, Config.hash.salt_rounds, (err, hash) => {
                        var user = new User({
                            username: req.body.username,
                            password: hash,
                            email: req.body.email
                        });

                        user.save((err, new_user) => {
                            res.json({
                                error: 0,
                                user: new_user
                            });
                        });
                    });
                }
            });
        }
        else {
            res.json({
                error: 1
            });
        }
    }

    update(req, res) {
        //Update a tag.
        console.log('here');
        if (req.body.username && req.body.email) {
            //Check if password field is there.
            if (req.body.password && req.body.password !== null) {
                Bcrypt.hash(req.body.password, Config.hash.salt_rounds, (err, hash) => {
                    User.update({ _id: req.params.id }, { username: req.body.username, email: req.body.email, password: hash }, (err) => {
                        if (err) {
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
            else
            {
                User.update({ _id: req.params.id }, { username: req.body.username, email: req.body.email }, (err) => {
                    if (err) {
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
        User.find({ _id: req.params.id }).remove().exec();
        res.json({
            error: 0
        });
    }

}

module.exports = UserC;