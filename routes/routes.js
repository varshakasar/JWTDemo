//routes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/model.js');
const jwt = require('jsonwebtoken');
var app = express();


router.post('/signup', function(req, res) {

   if ((typeof req.body.email == undefined) || req.body.email == "") {
      res.json({
         success:false,
         message:'Email not defined..'
      })

  }
  if ((typeof req.body.password == undefined) || req.body.password == "") {
    res.json({
      success: false,
      message: ' Password Not Defined..'
    })
  }
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    if (err) {
      return res.status(500).json({
        error: err
      });
    } else {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash
      });
      user.save().then(function(result) {
        console.log(result);
        res.status(200).json({
          success: 'New user has been created'
        });
      }).catch(error => {
        res.status(500).json({
          error: err
        });
      });
    }
  });
});
router.post('/signin', function(req, res) {

   if ((typeof req.body.email == undefined) || req.body.email == "") {
      res.json({
         success:false,
         message:'Email not defined..'
      })

  }
  if ((typeof req.body.password == undefined) || req.body.password == "") {
    res.json({
      success: false,
      message: ' Password Not Defined..'
    })
  }
  User.findOne({
      email: req.body.email
    })
    .exec()
    .then(function(user) {
      bcrypt.compare(req.body.password, user.password, function(err, result) {
        if (err) {
          return res.status(401).json({
            failed: 'Unauthorized Access'
          });
        }
        if (result) {
          const JWTToken = jwt.sign({
              email: user.email,
              _id: user._id
            },
            'secret', {
              expiresIn: '2h'
            });
          return res.status(200).json({
            success: 'Welcome to the JWT Auth',
            token: JWTToken
          });
        }
        return res.status(401).json({
          failed: 'Unauthorized Access'
        });
      });
    })
    .catch(error => {
      res.status(500).json({
        error: error
      });
    });;
});
module.exports = router;