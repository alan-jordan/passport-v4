var express = require('express')
var router = express.Router()
var passport = require('passport')
var helpers = require('../lib/helpers')
var db = require('../lib/db')

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/signup', (req, res) => {
  res.render('signup')
})


module.exports = router
