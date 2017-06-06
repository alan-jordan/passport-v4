var test = require('ava')
var request = require('supertest')
var cheerio = require('cheerio')

var createServer = require('../server')

var configureDatabase = require('./helpers/database-config')
configureDatabase(test, createServer)

test('GET /', t => {
  return request(t.context.app)
    .get('/')
    .expect(200)
    .then((result) => {
      const $ = cheerio.load(result.text)
      t.is($('h1').first().text(), 'Login')
    })
})

test('Get /signup', t => {
  return request(t.context.app)
    .get('/signup')
    .expect(200)
    .then((result) => {
      const $ = cheerio.load(result.text)
      t.is($('h1').first().text(), 'Sign up')
    })
})

test('Post /signup', t => {
  const addedUser = {
    email: 'cecil@cold.com',
    password: 'itiscold'
  }
  return request(t.context.app)
    .post('/signup')
    .send(addedUser)
    .expect(201)
    .then((result) => {
      t.is(result.text, 'User created')
    })
})

test('Post /login', t => {
  const login = {
    email: 'aardvark@example.org',
    password: 'test123'
  }
  return request(t.context.app)
    .post('/login')
    .send(login)
    .expect(200)
    .then((result) => {
      t.is(result.text, 'Logged in')
    })
})

test('Get /logout', t => {
  return request(t.context.app)
    .get('/logout')
    .expect(200)
    .then((result) => {
      t.is(result.text, 'Logged out')
    })
})
