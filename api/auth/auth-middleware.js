const Users = require('../users/users-model')

function restricted(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    next({
      status: 401,
      message: "You shall not pass!"
    })
  }
}

async function checkUsernameFree(req, res, next) {
  try {
    const isTaken = await Users.findBy(req.body.username)
    if (isTaken.length !== 0) {
      next({
        status: 422,
        message: "Username taken"
      })
    } else {
      next()
    }
  } catch(err) {
    next(err)
  }
}

async function checkUsernameExists(req, res, next) {
  const exists = await Users.findBy(req.body.username)
  if (exists.length !== 0) {
    next()
  } else {
    next({
      status: 401,
      message: 'invalid credentials'
    })
  }
}

function checkPasswordLength(req, res, next) {
  const { password } = req.body
  if(!password || password.length < 4) {
    next({
      status: 422,
      message: "Password must be longer than 3 chars"
    })
  } else {
    next()
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}