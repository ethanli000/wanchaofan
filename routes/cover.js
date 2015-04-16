var express = require('express');
var router = express.Router();
var path = require('path');
var series = require(path.join(__dirname, '../modules/series'));

router.use(function (req, res, next) {
  series.getList(function (series_list) {
    req.menu = series_list;
    next();
  });
});

/* GET home page. */
router.get('/', function (req, res) {
  res.render('cover', { title: 'Wan Chaofan - FOTO', list: req.menu });
});

module.exports = router;
