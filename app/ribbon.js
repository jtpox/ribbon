/*
 * Instantiating the entire system.
 */
import Fs from 'fs';
// const Http = require('http');
import Https from 'https';

import BodyParser from 'body-parser';

import FileUpload from 'express-fileupload';

import Pug from 'pug';
// const Pug = require('pug').__express;

import Moment from 'moment';

import Routes from './route';

import Navigation from './model/navigation';

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
    app.engine('html', Pug.__express);

    this.app.use((req, res, next) => {
      // req.env = env;
      req.log = this.log;
      next();
    });

    // Redirect the route to the theme directory.
    this.app.use('/theme', this.express.static(`themes/${process.env.SITE_THEME}`));
    this.app.use('/ribbon', this.express.static(`admin/${process.env.ADMIN_THEME}`));
    this.app.use('/', this.express.static('public'));

    this.set_locals();
    this.set_headers();
    // this.routes = Routes.routes(this.app);
    this.routes = Routes(this.app);
    this.load_plugins();
    this.start();
  }

  start() {
    // Declaring static files in the public folder.
    // The path is from the Root directory as Express was instantiated there.
    this.app.use(this.express.static('public'));

    if (process.env.SECURE_PRIVATE_KEY && process.env.SECURE_PRIVATE_CERT) {
      const options = {
        key: Fs.readFileSync(process.env.SECURE_PRIVATE_KEY),
        cert: Fs.readFileSync(process.env.SECURE_PRIVATE_CERT),
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
      this.server = Https.createServer(options, this.app).listen(process.env.SECURE_PORT, () => {
        // this.log.log(['etc'], `ribbon secure server started at port ${Config.secure_port}.`);
        this.log.info(`ribbon secure server started at port ${process.env.SECURE_POST}.`);
      });

      /*
       * Start normal server.
       */
      this.app.listen(process.env.PORT, () => {
        // this.log.log(['etc'], `Redirecting all traffic to ${Config.secure_port}.`);
        this.log.info(`Redirecting all traffic to ${process.env.PORT}.`);
      });
    } else {
      this.app.listen(process.env.PORT, () => {
        // this.log.log(['etc'], `ribbon server started at port ${Config.port}.`);
        this.log.info(`ribbon server started at port ${process.env.PORT}.`);
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
      site: {
        name: process.env.SITE_NAME,
      },
      analytics: {
        site: {
          domain: process.env.SITE_DOMAIN,
        },
        google: {
          tracking_id: process.env.GOOGLE_TRACKING_ID,
        },
        twitter: {
          username: process.env.TWITTER_USERNAME,
        },
      },
      navigation: [],
      functions: {
        moment: Moment,
      },
    };

    // Get Navigation.
    const fields = ['title', 'post', 'page', 'tag', 'user', 'link', 'created_at', '_id'];
    const nav = Navigation.find({}).select(fields.join(' '))
      .populate('page post tag').populate('user', '-password');
    nav.exec((err, results) => {
      this.app.locals.navigation = results;
    });
  }

  /*
   * If there is a better way to do it, please do a request.
   */
  load_plugins() {
    const plugins = this.get_plugin_directories();
    const enabled = process.env.plugins.split(',');

    plugins.forEach((file) => {
      // Retrieve package.json.
      /* eslint-disable */
      const plugin_info = require(`./plugin/${file}/package.json`);
      if (enabled.indexOf(plugin_info.name) !== -1) {
        require(`./plugin/${file}`)(this.app, this.log); // eslint-disable-line global-require

        this.log.plugin(`${plugin_info.name} (${plugin_info.version})`);
      }
      /* eslint-enable */
    });
  }

  get_plugin_directories() {
    return Fs.readdirSync('./app/plugin').filter(file => Fs.statSync(`./app/plugin/${file}`).isDirectory());
  }
}

export default Ribbon;
