/*
 * Instantiating the entire system.
 */
const Config     = require('../config/server');
const BodyParser = require('body-parser');
const FileUpload = require('express-fileupload');

class Ribbon {

    constructor(express, app, log)
    {
        this.express = express;
        this.app     = app;
        this.log     = log;
        this.routes  = null;

        //Start the Express server.
        this.app.use(BodyParser.urlencoded({ extended: true }));
        this.app.use(BodyParser.json());
        this.app.use(FileUpload());

        //Enable CORS
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        this.routes = require('./route')(this.app);
        this.start();
    }

    start()
    {
        //Declaring static files in the public folder.
        //The path is from the Root directory as Express was instantiated there.
        this.app.use(this.express.static('public'));

        this.app.listen(Config.port, () => {
            this.log.log(['etc'], 'ribbon server started at port ' + Config.port + '.');
        });
    }

}

module.exports = Ribbon;