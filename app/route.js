module.exports = function(app) {

    /*
     * Instantiating all controller classes.
     */
    const Index = require('./controller/index');
    var index   = new Index();

    const Blog  = require('./controller/blog');
    var blog    = new Blog();

    app.get('/', index.index);
    app.get('/temp', index.temp);

    app.route('/api/blog')
        .get(blog.list)
        .put(blog.insert);
    app.route('/api/blog/page/:page')
        .get(blog.list);
    app.route('/api/blog/:id')
        .get(blog.view)
        .delete(blog.delete);

};