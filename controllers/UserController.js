//UserController.js
'use strict';

var jwt = require('jwt-simple');
var UserModel = require('../models/UserModel');

// route middleware to ensure user is logged in


module.exports = function(){

var config = {secret: 'secretKey'};
    

    return {

        isLoggedIn: function isLoggedIn(req, res, next) {
            console.log(req);
            if (req.isAuthenticated())
                return next();
         
            res.sendStatus(401);
        },

        login: function login(req, res) {
             UserModel.findOne({email: req.body.email}, function(err, user) {
                if (err) throw err;

                if (!user) {
                  res.send({success: false, msg: 'Authentication failed. User not found.'});
                } else {
                  // check if password matches
                  user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                      // if user is found and password is right create a token
                      var token = jwt.encode(user, config.secret);
                      // return the information including token as JSON
                      res.json({success: true, token: 'JWT ' + token});
                    } else {
                      res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                    }
                  });
                }
            });
        },

        getContent: function getContent(req, res) {
             res.json({success: true, message: 'You are authorized'});
        },

        logout: function logout(req, res) {
            req.logout();
            res.send("logout success!");
            /*
            req.session.destroy(function (err) {
                res.redirect('/'); //Inside a callback… bulletproof!
              });
            */
        },

        signup: function(req, res) {
          if (!req.body.email || !req.body.password) {
            res.json({success: false, msg: 'Please enter email and password.'});
          } else {
            var newUser = new UserModel({
              email: req.body.email,
              password: req.body.password
            });
            // save the user
            newUser.save(function(err) {
              if (err) {
                return res.json({success: false, msg: 'Email already exists.'});
              }
              res.json({success: true, msg: 'Successful created new user.'});
            });
          }
        }
    }
};