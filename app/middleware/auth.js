import Bcrypt from 'bcrypt';

import Session from '../model/session';

async function isLogged(req, res, next) {
  // console.log(req.headers);
  if (req.headers.session_id && req.headers.session_token) {
    try {
      const findById = await Session.findById(req.headers.session_id);
      if (findById) {
        const tokenCompare = await Bcrypt.compare(req.headers.session_token, findById.token);

        if (tokenCompare) {
          req.currentUser = findById.user._id;
          req.userDetails = findById.user;
          next();
        } else {
          // throw new Error('Session token does not match.');
          throw new Error(`${req.originalUrl} - User (${findById.user.username} - ${findById.user._id}}) session token does not match.`);
        }
      } else {
        // throw new Error('Session ID does not exist.');
        throw new Error(`${req.originalUrl} - Session ID does not exist.`);
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
