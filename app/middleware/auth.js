import Bcrypt from 'bcrypt';

import Session from '../model/session';

async function isLogged(req, res, next) {
  // console.log(req.headers);
  if (req.headers.session_id && req.headers.session_token) {
    try {
      const find_by_id = await Session.find_by_id(req.headers.session_id);
      if (find_by_id.length > 0) {
        const token_compare = await Bcrypt.compare(req.headers.session_token, find_by_id[0].token);

        if (token_compare) {
          req.currentUser = find_by_id[0].user;
          next();
        } else {
          throw new Error('Session token does not match.');
        }
      } else {
        throw new Error('Session ID does not exist.');
      }
    } catch (err) {
      req.log.error(err);
      res.json({
        error: 1,
      });
    }
  } else {
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

export { isLogged, notLogged };
