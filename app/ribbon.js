/*
 * Instantiating the entire system.
 */
const Config = require('../config/server');
const Analytics = require('../config/analytics');
const BodyParser = require('body-parser');
const FileUpload = require('express-fileupload');
const Pug = require('pug').__express;

const Fs = require('fs');
// const Http = require('http');
const Https = require('https');

const Routes = require('./route');

class Ribbon {
  constructor(express, app, log) {
    this.express = express;
    this.server = null;
    this.app = app;
    this.log = log;
    this.routes = null;

    // Start the Express server.
    this.app.use(BodyParser.urlencoded({ extended: true }));
    this.app.use(BodyParser.json());
    this.app.use(FileUpload());

    // Set the template engine. Mustache is used.
    app.set('views', './'); // Set to root as we choosing a directory would be more dynamic.
    app.set('view engine', 'html');// Use the same old HTML extension.
    app.engine('html', Pug);

    // Redirect the route to the theme directory.
    this.app.use('/theme', this.express.static(`themes/${Config.theme}`));
    this.app.use('/ribbon', this.express.static(`admin/${Config.admin}`));
    this.app.use('/', this.express.static('public'));

    this.set_locals();
    this.set_headers();
    this.routes = Routes.routes(this.app);
    this.start();
  }

  start() {
    // Declaring static files in the public folder.
    // The path is from the Root directory as Express was instantiated there.
    this.app.use(this.express.static('public'));

    if (Config.key.private && Config.key.cert) {
      const options = {
        key: Fs.readFileSync(Config.key.private),
        cert: Fs.readFileSync(Config.key.cert),
      };

      /*
       * Force HTTPS on all routes.
       */
      this.app.use('*', (req, res, next) => {
        if (!req.secure) {
          const secure_url = `https://${req.headers.host}${req.url}`;
          res.writeHead(301, { Location: secure_url });
          res.end();
        }

        next();
      });

      /*
       * Start secure server.
       */
      this.server = Https.createServer(options, this.app).listen(Config.secure_port, () => {
        this.log.log(['etc'], `ribbon secure server started at port ${Config.secure_port}.`);
      });

      /*
       * Start normal server.
       */
      this.app.listen(Config.port, () => {
        this.log.log(['etc'], `Redirecting all traffic to ${Config.secure_port}.`);
      });
    } else {
      this.app.listen(Config.port, () => {
        this.log.log(['etc'], `ribbon server started at port ${Config.port}.`);
      });
    }
  }

  set_headers() {
    this.app.use((req, res, next) => {
      // Enable CORS
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, session_id, session_token');

      res.header('X-Powered-By', 'ribbon');
      next();
    });
  }

  set_locals() {
    this.app.locals = {
      site: Config.site,
      analytics: Analytics,
    };
  }
}

module.exports = Ribbon;
