var passport = require('passport')
var Strategy = require('passport-local').Strategy
var db = require('./lib/db')
var helpers = require('./lib/helpers')

module.exports = function (app) {
  var connection = app.get("connection")
  app.use(require('cookie-parser')())
  app.use(require('express-session')(
    {
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false
    }
  ))
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new Strategy({
    usernameField: 'email'
  },

  function(email, password, done) {
      db.getUserByEmail(email, connection)
        .then (function(user) {
          if (!user) {
            return done(null, false, {message: 'User is not found'})
          }
          db.checkPassword(password, user.password)
            .then((result) => {
              result ? done(null, user) : done(null, false, {message: 'Incorrect Password'})
            })
        })
  })
  )

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  })

  passport.deserializeUser(function(id, done) {
    db.getUser (id, connection)
      .then(function(user) {
        done(null, user)
      })
      .catch(done)
    })
    return passport
}
