const jwt = require('jsonwebtoken');

const expiration = 5 * 60;
const JWT_KEY = process.env.JWT_KEY || 'ABCDEFG123456789'

module.exports = {
  verify: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, JWT_KEY );

      console.log(decodedToken);

      req.userData = { email: decodedToken.email, userId: decodedToken.userId };

      next();
    } catch (error) {
      console.error('Authentication fail');
      console.error(error);
      res.status(401).json({ message: 'Authentication failed' });
    }
  },
  getToken: (email, userId) => {
    console.log('Login: ' + email + '|' + userId);

    const token = jwt.sign({ email: email, userId: userId },
      JWT_KEY,
      { expiresIn: '' + (expiration * 1000) }
    );
    return { token: token, expiresIn: expiration * 1000 }
  }
};
