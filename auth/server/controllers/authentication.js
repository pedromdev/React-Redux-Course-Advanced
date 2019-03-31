const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = Date.now();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

module.exports.signin = function(req, res, next) {
  res.send({ token: tokenForUser(req.user) });
};

module.exports.signup = function(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({
      error: 'You must provide email and password'
    });
  }

  User.findOne({ email }, function(err, user) {
    if (err) {
      return next(err);
    }

    if (user) {
      return res.status(422).send({
        error: 'Email is in user'
      });
    }

    const newUser = new User({ email, password });
    newUser.save(function(err) {
      if (err) {
        return next(err);
      }

      res.json({ token: tokenForUser(newUser) });
    });
  });
}