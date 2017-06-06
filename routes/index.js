var express = require('express')
var router = express.Router()
var passport = require('passport')
var helpers = require('../lib/helpers')
var db = require('../lib/db')

router.get('/', (req, res) => {
  db.getUsers(req.app.get('connection'))
  .then((users) => {
    res.render('index', {users: users})
  })
  .catch(function (err) {
    res.status(500).send('DATABASE ERROR: ' + err.message)
  })
})

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.post('/signup', (req, res) => {
  db.createUser(req.body, req.app.get('connection'))
    .then((result) => {
      res.status(201).send('User created')
    })
    .catch(function (err) {
      res.status(500).send('DATABASE ERROR: ' + err.message)
    })
})

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/resource',
    failureRedirect: '/login'
  })
)

router.get('/logout', (req, res) => {
  res.status(200).send('Logged out')
})

module.exports = router
