/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  // res.status(401).json({ you: 'shall not pass!' });

  try {
    const token = req.headers.authorization
      ? req.headers.authorization.split(' ')[1]
      : '';

    if (token) {
      jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
          next({
            apiCode: 401,
            apiMessage: 'you shall not pass!',
          });
        } else {
          req.decodedToken = decodedToken;
          next();
        }
      });
    } else {
      next({
        apiCode: 401,
        apiMessage: 'you shall not pass!',
      });
    }
  } catch (err) {
    next({
      apiCode: 500,
      apiMessage: 'error validating credentials',
      ...err,
    });
  }
};
