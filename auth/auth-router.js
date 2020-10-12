const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = require('express').Router();

const Users = require('../users/users-model.js');
const { isValid } = require('../users/users-service.js');

router.post('/register', async (req, res, next) => {
  // implement registration
  const credentials = req.body;

  try {
    if (isValid(credentials)) {
      const rounds = process.env.BCRYPT_ROUNDS
        ? parseInt(process.env.BCRYPT_ROUNDS)
        : 10;

      const hash = bcryptjs.hashSync(credentials.password, rounds);

      credentials.password = hash;

      const user = await Users.add(credentials);
      const token = generateToken(user);

      res.status(201).json({
        data: user,
        token,
      });
    } else {
      next({
        apiCode: 400,
        apiMessage: 'username or password missing',
      });
    }
  } catch (err) {
    console.log(err);
    next({ apiCode: 500, apiMessage: 'error saving new user', ...err });
  }
});

router.post('/login', async (req, res, next) => {
  // implement login
  const { username, password } = req.body;

  try {
    if (!isValid(req.body)) {
      next({ apiCode: 400, apiMessage: 'you shall not pass!' });
    } else {
      const [user] = await Users.findBy({ username: username });

      if (user && bcryptjs.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          message: 'Welcome to the api',
          token: token,
        });
      } else {
        next({
          apiCode: 401,
          apiMessage: 'invalid credentials',
        });
      }
    }
  } catch (err) {
    next({
      apiCode: 500,
      apiMessage: 'db error loggin in',
      ...err,
    });
  }
});

function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
  };

  const secret = process.env.JWT_SECRET;

  const options = {
    expiresIn: '1d',
  };

  const token = jwt.sign(payload, secret, options);

  return token;
}

module.exports = router;
