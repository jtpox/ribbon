/*
 * Controller for Blog.
 */
const User  = require('../model/user');
const Image = require('../model/image');

const Config = require('../../config/server');

const Db     = require('../database');//Soley used for the ObjectId type.

const Crypto  = require('crypto');
const Slugify = require('slugify');
const Path    = require('path');
const Fs      = require('fs');

 class ImageC {

    list(req, res)
    {
        //List the blog posts with pagination.
        //https://stackoverflow.com/questions/42700884/select-all-the-fields-in-a-mongoose-schema
        var fields = ['title', 'file_name', 'created_by','created_at', 'last_updated', '_id'];
        var query  = Image.find({}).select(fields.join(' '))
            .populate('created_by');

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
        //Add an image.
        if( req.files )
        {
            var extension_extract = /(?:\.([^.]+))?$/;
            var extension         = extension_extract.exec(req.files.file.name);
            //console.log(extension[1]);

            var allowed_extensions = [
                'png',
                'gif',
                'jpg',
                'jpeg',
                'bmp'
            ];

            if( allowed_extensions.indexOf(extension[1]) == -1 )
            {
                res.json({
                    error: 1
                });
            }
            else
            {
                Crypto.randomBytes(12, (err, buffer) => {
                    //Generate directory to move the image to.
                    var directory = Path.join(__dirname, '..', '..', 'public', 'uploads', 'images', buffer.toString('hex') + '.' + extension[1]);
                    //console.log(directory);
    
                    req.files.file.mv(directory, (mv_err) => {
                        //console.log(mv_err);
                        if( mv_err )
                        {
                            res.json({
                                error: 1
                            });
                        }
                        else
                        {
                            var image = new Image({
                                title: req.files.file.name,
                                file_name: buffer.toString('hex') + '.' + extension[1],
                                created_by: Db.Types.ObjectId(req.currentUser)
                            });
    
                            image.save((save_err, new_image) => {
                                if( save_err )
                                {
                                    res.json({
                                        error: 1
                                    });
                                }
                                else
                                {
                                    res.json({
                                        error: 0,
                                        image: new_image
                                    });
                                }
                            });
                        }
                    });
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
        //Delete an image.
        /*Tag.find({ _id: req.params.id }).remove().exec();
        res.json({
            error: 0
        });*/
        var image = Image.find({ _id: req.params.id });

        image.exec((err, results) => {
            if( results.length > 0 )
            {
                var directory = Path.join(__dirname, '..', '..', 'public', 'uploads', 'images', results[0].file_name);

                Fs.unlink(directory, (err) => {
                    if( err )
                    {
                        res.json({
                            error: 1
                        });
                    }
                    else
                    {
                        image.remove().exec();
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
        });
    }

 }

 module.exports = ImageC;