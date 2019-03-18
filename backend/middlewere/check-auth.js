const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken._id
    };
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Invalid autentication credentials!'
    });
  }
};
