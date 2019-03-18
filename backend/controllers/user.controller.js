const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');

exports.signup = (req, res, next) => {
  // TODO install bcrypt and use it here to hash the user password 
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new UserModel({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(200).json({
            message: 'User created',
            user: result
          });
        })
        .catch(err => {
          res.status(500).json({
            message: 'Invalid credentials, try other thing'
          });
        });
    }).catch(err => {
      res.status(500).json({
        error: err
      });
    });

};

exports.login = (req, res, next) => {
  let userFinded;
  UserModel.findOne({
      email: req.body.email
    })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Invalid authentication credential'
        });
      }
      userFinded = user;
      return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Login fail. Ckeck your credentials'
        });
      }

      const webtoken = jwt.sign({
          email: userFinded.email,
          _id: userFinded._id
        },
        process.env.TOKEN_SECRET, {
          expiresIn: '1h'
        }
      );

      res.status(200).json({
        token: webtoken,
        userId: userFinded._id,
        expiresIn: 3600
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Invalid authentication credentials!',
      });
    });
};
