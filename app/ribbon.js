/*
 * Instantiating the entire system.
 */
const Config = require('../config/server');

class Ribbon {

    constructor(express, app, log)
    {
        this.express = express;
        this.app     = app;
        this.log     = log;
        this.routes  = null;

        //Start the Express server.
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