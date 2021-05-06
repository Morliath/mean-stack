const bcrypt = require('bcryptjs');
const authService = require('../utils/authservice');

const User = require('../models/User');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });

      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created',
            result: result
          });
        })
        .catch(err => {
          res.status(400).json({
            message: 'Invalid authentication credentials'
          });
        });
    });
}

exports.userLogin = (req, res, next) => {
  let userFound;

  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Authentication fail' });
      }
      userFound = user;
      return bcrypt.compare(req.body.password, userFound.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({ message: 'Authentication fail' });
      }

      const tokenData = authService.getToken(userFound.email, userFound._id)

      res.status(200).json({
        token: tokenData.token,
        expiresIn: tokenData.expiresIn,
        userID: userFound._id
      });
    })
    .catch(err => {
      console.log(err);

      return res.status(401).json({ message: 'Authentication fail' });
    });
}
