var test = require('ava')

var configureDatabase = require('./helpers/database-config')
configureDatabase(test)

var db = require('../lib/db')
var helpers = require('../lib/helpers')

test('getUsers returns correct number of users', t => {
  return db.getUsers(t.context.connection)
    .then((result) => {
      t.is(result.length, 2)
    })
})

test('getUser by ID returns the correct user', t => {
  return db.getUser (99901, t.context.connection)
    .then((result) => {
      t.is(result.name, 'Ambitious Aardvark')
    })
})

test('getUserByEmail returns the correct user', t => {
  return db.getUserByEmail ('aardvark@example.org', t.context.connection)
    .then((result) => {
      t.is(result.name, 'Ambitious Aardvark')
    })
})

test('getUserByTwitter returns the correct user', t => {
  return db.getUserByTwitter ('alice', t.context.connection)
    .then((result) => {
      t.is(result.name, 'Ambitious Aardvark')
    })
})

test('createUser creates a user', t => {
  const userObj = {
    name: 'Cecil',
    email: 'cecil@crap.com',
    twitter_id: 'serious_ceril',
    password: 'thisisacrappassword'
  }
  return db.createUser (userObj, t.context.connection)
    .then((result) => {
      t.is(result[0], 99903)
    })
})

test('can compare hashed passwords', t => {
  let newUser = {
    name: 'Creepy Cecil',
    email: 'cecil@creepy.org',
    twitter_id: 'cecil',
    password: 'test'
  }
  return db.createUser(newUser, t.context.connection)
    .then((result) => {
      return db.getUser(result[0], t.context.connection)
        .then((user) => {
          db.checkPassword('test', user.password)
            .then(res => {
              t.is(res, true)
            })
        })
    })
})
