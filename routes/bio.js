var express = require('express');
var router = express.Router();
var path = require('path');
var admin = require(path.join(__dirname, '../modules/admin'));

/* GET home page. */
router.get('/', function (req, res) {
  admin.getInfo(function (user_info) {
    res.render('bio', {section: "bio", title: 'Wan Chaofan - FOTO', user_info: user_info });
  });
});

module.exports = router;
