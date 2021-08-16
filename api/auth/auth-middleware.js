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

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted() {

}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
function checkUsernameFree() {

}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
function checkUsernameExists() {

}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength() {

}

// Don't forget to add these to the `exports` object so they can be required in other modules
