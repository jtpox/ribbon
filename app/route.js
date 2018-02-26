module.exports = function(app) {

    /*
     * Instantiating all controller classes.
     */
    const Index = require('./controller/index');
    var index   = new Index();

    app.get('/', index.index);
    app.get('/temp', index.temp);

};