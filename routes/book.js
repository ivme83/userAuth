const express         = require('express');
const router          = express.Router();
const mongoose        = require('mongoose');
const Book            = require('../models/Book.js');
const passport        = require('passport');
require('../config/passport')(passport);

/* GET ALL BOOKS */
router.get('/', passport.authenticate('jwt', { session: false}), (req, res) => {
  let token = getToken(req.headers);
  if (token) {
    Book.find((err, books) => {
      if (err) return next(err);
      res.json(books);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

/* SAVE BOOK */
router.post('/', passport.authenticate('jwt', { session: false}), (req, res) => {
  let token = getToken(req.headers);
  if (token) {
    Book.create(req.body, (err, post) => {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

getToken = (headers) => {
  if (headers && headers.authorization) {
    let parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;