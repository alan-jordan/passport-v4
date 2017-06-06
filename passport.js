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
            return done(null, false, {message: 'User is not found'});
          }
          if (!db.checkPassword(password, user.password)) {
            return done(null, false, {message: 'Incorrect Password'});
          }
          return done(null, user)
        })
    })
  )

  passport.serializeUser(function(user, done) {
    console.log('seriialize');
    done(null, user.id);
  })

  passport.deserializeUser(function(id, done) {
    console.log('deserialize');
    db.getUser (id, connection)
      .then(function(user) {
        console.log("deserialized user", {user});
        done(null, user)
      })
      .catch(done)
    })
    return passport
}
