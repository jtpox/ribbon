/*
 * Instantiating the entire system.
 */
const Config     = require('../config/server');
const BodyParser = require('body-parser');
const FileUpload = require('express-fileupload');

const Fs         = require('fs');
const Http       = require('http');
const Https      = require('https');

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

        this.set_headers();
        this.routes = require('./route')(this.app);
        this.start();
    }

    start()
    {
        //Declaring static files in the public folder.
        //The path is from the Root directory as Express was instantiated there.
        this.app.use(this.express.static('public'));

        if( Config.key.private && Config.key.cert )
        {
            var options = {
                key: Fs.readFileSync(Config.key.private),
                cert: Fs.readFileSync(Config.key.cert)
            };

            var server = Https.createServer(options, this.app).listen(Config.port, () => {
                this.log.log(['etc'], 'ribbon server started at port ' + Config.port + '.');
            });
        }
        else
        {
            this.app.listen(Config.port, () => {
                this.log.log(['etc'], 'ribbon server started at port ' + Config.port + '.');
            });
        }
    }

    set_headers()
    {
        this.app.use((req, res, next) => {
            //Enable CORS
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

            res.header('X-Powered-By', 'ribbon');
            next();
        });
    }

}

module.exports = Ribbon;