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

    const User  = require('./controller/user');
    var user    = new User();
    
    const Page  = require('./controller/page');
    var page    = new Page();

    const Image = require('./controller/image');
    var image   = new Image();

    app.get('/', index.index);
    app.get('/ribbon', index.admin);
    app.get('/install', index.install);

    app.post('/api/auth', AuthMid.notLogged, auth.signin);
    app.post('/api/auth/check', auth.check);
    app.post('/api/auth/logout', AuthMid.isLogged, auth.logout);

    app.get('/api', blog.site);
    
    app.get('/api/blog', blog.list);
    app.post('/api/blog', AuthMid.isLogged, blog.insert);//Inserting a new blog post.

    app.get('/api/blog/page/:page', blog.paginate);

    app.get('/api/blog/:id', blog.view);
    app.get('/api/blog/url/:url', blog.from_url);
    app.delete('/api/blog/:id', AuthMid.isLogged, blog.delete);//Deleting a blog post. For some reason, it is not working with Angular. But it works with Postman.
    //https://stackoverflow.com/questions/37796227/body-is-empty-when-parsing-delete-request-with-express-and-body-parser
    app.post('/api/blog/delete/:id', AuthMid.isLogged, blog.delete);//Deleting a blog post. Non RESTFUL method.
    app.put('/api/blog/:id', AuthMid.isLogged, blog.update);//Updating a blog post.

    app.get('/api/tags', tag.list);
    app.post('/api/tags', AuthMid.isLogged, tag.insert);//Inserting a new tag.

    app.get('/api/tags/:id', tag.get);
    app.get('/api/tags/:url/page/:page', tag.posts);//Get posts from tags.
    app.put('/api/tags/:id', AuthMid.isLogged, tag.update);
    app.delete('/api/tags/:id', AuthMid.isLogged, tag.delete);
    app.post('/api/tags/delete/:id', AuthMid.isLogged, tag.delete);//Deleting a blog post. Non RESTFUL method.

    app.get('/api/users', user.list);
    app.post('/api/users', AuthMid.isLogged, user.insert);
    app.get('/api/users/:id/page/:page', user.posts);//Get user info and posts.

    app.put('/api/users/:id', AuthMid.isLogged, user.update);
    app.delete('/api/users/:id', AuthMid.isLogged, user.delete);
    app.post('/api/users/delete/:id', AuthMid.isLogged, user.delete);

    app.get('/api/pages', page.list);
    app.post('/api/pages', AuthMid.isLogged, page.insert);

    app.get('/api/pages/:id', page.get);
    app.get('/api/pages/url/:url', page.from_url);
    app.put('/api/pages/:id', AuthMid.isLogged, page.update);
    app.delete('/api/pages/:id', AuthMid.isLogged, page.delete);
    app.post('/api/pages/delete/:id', AuthMid.isLogged, page.delete);

    app.put('/api/images', AuthMid.isLogged, image.list);//PUT as GET doesn't allow body.
    app.post('/api/images', AuthMid.isLogged, image.insert);

    app.delete('/api/images/:id', AuthMid.isLogged, image.delete);
    app.post('/api/images/delete/:id', AuthMid.isLogged, image.delete);

};