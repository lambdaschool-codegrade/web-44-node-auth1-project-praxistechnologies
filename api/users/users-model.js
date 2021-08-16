

const db = require('../../data/db-config')

async function find() {
  const users = await db('users')
  return users
}

async function findBy(filter) {
  const filteredUsers = await db
    .select('user_id', 'username', 'password')
    .from('users')
    .where('username', filter)
  return filteredUsers
}

async function findById(user_id) {
  const [user] = await db
    .select('user_id', 'username')
    .from('users')
    .where('user_id', user_id)
  return user
}

async function add(user) {
  const [id] = await db('users').insert(user)
  const newUser = await findById(id)
  return newUser
}

module.exports = {
  find,
  findBy,
  findById,
  add
}

 
//   resolves to an ARRAY with all users, each user having { user_id, username }

//   resolves to an ARRAY with all users that match the filter condition

//   resolves to the user { user_id, username } with the given user_id

//   resolves to the newly inserted user { user_id, username }

// Don't forget to add these to the `exports` object so they can be required in other modules