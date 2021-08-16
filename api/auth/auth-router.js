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