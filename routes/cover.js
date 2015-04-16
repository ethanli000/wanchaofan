var express = require('express');
var router = express.Router();
var path = require('path');
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
  res.render('photo', req.display);
});

module.exports = router;
