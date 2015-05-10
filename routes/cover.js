var express = require('express');
var router = express.Router();
var path = require('path');
var admin = require(path.join(__dirname, '../modules/admin'));
var series = require(path.join(__dirname, '../modules/series'));

router.use(function setMenu(req, res, next) {
  var display = { title: 'Wan Chaofan - FOTO' };
  series.getList(function (series_list) {
    display.list = series_list;
    req.display = display;
    next();
  });
});

/* GET home page. */
router.get('/', function (req, res) {
  admin.getInfo(function (user_info) {
    req.display.user_info = user_info;
    res.render('cover', req.display);
  });
});

module.exports = router;
