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

router.param('name', function (req, res, next, name) {
  var list = req.display.list;
  var series_key;
  console.log(name);
  req.display.section = name;
  list.forEach(function (series) {
    if (name === res.locals.makeUrl(series.name)) {
      series_key = series.series_key;
      return;
    }
  });
  if (!series_key) {
    res.redirect('/404');
  }
  next();
});

router.get('/', function (req, res) {
  res.redirect('/photo/' + res.locals.makeUrl(req.display.list[0].name));
});

router.get('/:name', function (req, res) {
  res.render('photo', req.display);
});

module.exports = router;
