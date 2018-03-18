module.exports = function(app) {
    /*
     * Obtaining middlewares.
     */
    const AuthMid = require('./middleware/auth');

    /*
     * Instantiating all controller classes.
     */
    const Index = require('./controller/index');
    var index   = new Index();

    const Blog  = require('./controller/blog');
    var blog    = new Blog();

    const Auth  = require('./controller/authenticate');
    var auth    = new Auth();

    const Tag   = require('./controller/tag');
    var tag     = new Tag();

    app.get('/', index.index);
    app.get('/temp', index.temp);

    app.post('/api/auth', AuthMid.notLogged, auth.signin);
    app.post('/api/auth/check', auth.check);
    app.post('/api/auth/logout', AuthMid.isLogged, auth.logout);
    
    app.get('/api/blog', blog.list);
    app.post('/api/blog', AuthMid.isLogged, blog.insert);//Inserting a new blog post.

    app.get('/api/blog/page/:page', blog.paginate);

    app.get('/api/blog/:id', blog.view);
    app.delete('/api/blog/:id', AuthMid.isLogged, blog.delete);//Deleting a blog post. For some reason, it is not working with Angular. But it works with Postman.
    app.post('/api/blog/delete/:id', AuthMid.isLogged, blog.delete);//Deleting a blog post. Non RESTFUL method.
    app.put('/api/blog/:id', AuthMid.isLogged, blog.update);//Updating a blog post.

    app.get('/api/tags', tag.list);
    app.get('/api/tags/:id', tag.get);

};