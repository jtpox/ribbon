const Bcrypt = require('bcrypt');

const Session = require('../model/session.js');

function isLogged(req, res, next) {
  // console.log(req.headers);
  if (req.headers.session_id && req.headers.session_token) {
    Session.findBySessionId(req.headers.session_id, (err, results) => {
      if (results.length > 0) {
        // Check if the token is valid.
        Bcrypt.compare(req.headers.session_token, results[0].token, (bcryptErr, check) => {
          if (check) {
            req.currentUser = results[0].user;
            /*
                         * Token checks out and session exists.
                         * Tells the client that the auth is valid and can be used.
                         */
            next();
          } else {
            // console.log('Here');
            res.json({
              error: 1,
            });
          }
        });
      } else {
        res.json({
          error: 1,
        });
      }
    });
  } else {
    // console.log('There');
    res.json({
      error: 1,
    });
  }
}

function notLogged(req, res, next) {
  // console.log(req.headers);
  if (req.headers.session_id && req.headers.session_token) {
    res.json({
      error: 1,
    });
  } else {
    next();
  }
}

module.exports = { isLogged, notLogged };
