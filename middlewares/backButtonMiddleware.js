const backButtonMiddleware = (req, res, next) => {
  if (req.session && req.session.previousUrl) {
    // The user has a previous URL stored in the session
    // Set the previous URL to the referrer if it is not already set
    if (!req.session.previousUrl) {
      req.session.previousUrl = req.header('Referer') || '/';
    }
  } else {
    // No previous URL stored, set it to the current URL
    req.session.previousUrl = req.originalUrl;
  }
  next();
};

module.exports = backButtonMiddleware;
