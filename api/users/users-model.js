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