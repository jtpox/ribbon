function isAdmin(req, res, next) {
  try {
    if (req.userDetails.group === 1) {
      next();
    } else {
      throw new Error(`${req.originalUrl} - User (${req.userDetails.username} - ${req.userDetails._id}}) is not admin.`);
    }
  } catch (err) {
    req.log.error((process.env.RECORD_STAT.toLowerCase() === 'true') ? `[${req.ip}]: ${err}` : err);
    res.json({
      error: 1,
    });
  }
}

function isEditor(req, res, next) {
  try {
    if (req.userDetails.group === 1 || req.userDetails.group === 2) {
      next();
    } else {
      throw new Error(`${req.originalUrl} - User (${req.userDetails.username} - ${req.userDetails._id}}) is not editor.`);
    }
  } catch (err) {
    req.log.error((process.env.RECORD_STAT.toLowerCase() === 'true') ? `[${req.ip}]: ${err}` : err);
    res.json({
      error: 1,
    });
  }
}

export { isAdmin, isEditor };
