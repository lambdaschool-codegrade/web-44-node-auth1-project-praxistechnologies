
const { checkUsernameFree, checkUsernameExists, checkPasswordLength } = require('./auth-middleware')
const router = require('express').Router()
const Users = require('../users/users-model')
const bcrypt = require('bcryptjs')

router.post('/register', checkUsernameFree, checkPasswordLength, async (req, res, next) => { //[POST] /api/auth/register
  const { username, password } = req.body
  const hash = bcrypt.hashSync(password, 8)
  const newUser = {
    username: username,
    password: hash
  }
  const dbUser = await Users.add(newUser)
  res.status(201).json(dbUser)
})

router.post('/login', checkUsernameExists, async (req, res, next) => { //[POST] /api/auth/login
  const { username, password } = req.body
  const [user] = await Users.findBy(username)
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = user
    res.json({
      status: 200,
      message: `Welcome ${username}!`
    })
  } else {
    next({
      status: 401,
      message: 'Invalid credentials'
    })
  }
})

router.get('/logout', (req, res) => { //[GET] /api/auth/logout
  if (req.session && req.session.user) {
    req.session.destroy(err => {
      if (err) {
        res.json({
          message: 'error logging out'
        });
      } else {
        res.json({
          message: 'logged out'
        });
      }
    });
  } else {
    res.json({
      message: 'no session'
    });
  }
});

module.exports = router


// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!


/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

 
// Don't forget to add the router to the `exports` object so it can be required in other modules
