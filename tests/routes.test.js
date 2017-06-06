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
