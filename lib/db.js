var bcrypt = require('bcryptjs')

module.exports = {
  getUsers,
  getUser,
  getUserByEmail,
  getUserByTwitter,
  createUser,
  checkPassword
}

function getUsers (connection) {
  return connection('users').select()
}

function getUser (id, connection) {
  return connection('users').where('id', id).first()
}

function getUserByEmail (email, connection) {
  return connection('users').where('email', email).first()
}

function getUserByTwitter (twitter, connection) {
  return connection('users').where('twitter_id', twitter).first()
}

function createUser (userObj, connection) {
  return bcrypt.hash(userObj.password, 10)
    .then((hash) => {
      userObj.password = hash
      return connection('users')
        .insert(userObj)
    })
}

function checkPassword(plainTextPassword, hashedPassword) {
  return bcrypt.compare(plainTextPassword, hashedPassword)
    .then(res => {
      return res
    })
}
