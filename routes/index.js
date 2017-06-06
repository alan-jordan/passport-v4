var express = require('express')
var router = express.Router()
var passport = require('passport')
var helpers = require('../lib/helpers')
var db = require('../lib/db')

router.get('/', function (req, res) {
  res.send('index')
})

module.exports = router
