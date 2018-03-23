/*
 * Controller for Index.
 */
const Post = require('../model/post');
const User = require('../model/user');
const Tag = require('../model/tag');
const Image = require('../model/image');
const Content = require('../model/content');
const Page = require('../model/page');

const Config = require('../../config/server');

const Db = require('../database');
const Bcrypt = require('bcrypt');
const Path = require('path');

class Index {
    index(req, res) {
        res.sendFile(Path.join(__dirname, '..', '..', 'public', 'themes', Config.theme, 'index.html'));
    }

    admin(req, res) {
        res.sendFile(Path.join(__dirname, '..', '..', 'public', 'admin.html'));
    }

    install(req, res) {
        /*
         * Check if a user exists in the database.
         */
        const query = User.find({});

        query.exec((err, results) => {
            if (results.length > 0) {
                // Do not run install if a user exists.
                res.status(404).send('Not Found');
            } else {
                /*
                 * Install the basic database entries to start working.
                 */

                // Adding the admin user.
                // Username: admin, password: password, email: admin@admin.com
                Bcrypt.hash('password', Config.hash.salt_rounds, (hash_err, hash) => {
                    const user = new User({
                        username: 'admin',
                        password: hash,
                        email: 'admin@admin.com',
                    });

                    user.save((user_save_err, new_user) => {
                        // Create a new tag entry.
                        const tag = new Tag({
                            title: 'Example Tag',
                            url: 'Example-Tag',
                            content: 'A tag for blog entries.',
                        });

                        tag.save((tag_save_err, new_tag) => {
                            // Create a new post using this tag.
                            const post = new Post({
                                title: 'First Post',
                                url: 'First-Post',
                                content: 'This is the first post for the blog!',
                                image: null,
                                created_by: Db.Types.ObjectId(new_user._id),
                                tag: Db.Types.ObjectId(new_tag._id),
                            });

                            post.save();
                        });

                        // Create a new page.
                        const page = new Page({
                            title: 'First Page',
                            url: 'First-Page',
                            description: 'This is the first page for the website!',
                            created_by: Db.Types.ObjectId(new_user.id),
                            image: null,
                        });

                        page.save((page_save_err, new_page) => {
                            // Create content for the new page.
                            const content = new Content({
                                title: 'First Box',
                                content: 'First box contents.',
                                page_id: Db.Types.ObjectId(new_page._id),
                                content_column: 3,
                                created_by: Db.Types.ObjectId(new_user.id),
                            });

                            content.save();
                        });

                        // Add an image to the database.
                        const image = new Image({
                            title: 'photo-1499336315816-097655dcfbda.jpg',
                            file_name: 'photo-1499336315816-097655dcfbda.jpg',
                            created_by: Db.Types.ObjectId(new_user.id),
                        });

                        image.save();

                        res.send('You can now login to the administrators panel by visiting `/ribbon` and logging in using the email `admin@admin.com` and password `password`.');
                    });
                });
            }
        });
    }
}

module.exports = Index;
