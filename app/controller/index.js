/*
 * Controller for Index.
 */
const Post = require('../model/post.js');

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

        res.send('Hello, world!');
    }

 }

 module.exports = Index;