var express = require('express')
var router = express.Router()
var passport = require('passport')
var helpers = require('../lib/helpers')
var db = require('../lib/db')

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/')
  }
}

function isAuthorisedUser (req, res, next) {
  if (!req.user){
  res.redirect('/')
  } else if (req.user.id == req.params.id ) {
    return next()
  } else {
    res.redirect('/not-authorised')
  }
}

router.get('/', (req, res) => {
  db.getUsers(req.app.get('connection'))
  .then((users) => {
    res.render('index', {users: users, message: req.flash('error')})
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
    failureRedirect: '/',
    failureFlash: true
  })
)

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

router.get('/resource', ensureAuthenticated, function (req, res) {
    res.render('resource', {user: req.user})
})

module.exports = router
