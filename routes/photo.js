var express = require('express');
var router = express.Router();
var path = require('path');
var series = require(path.join(__dirname, '../modules/series'));
var photo = require(path.join(__dirname, '../modules/photo'));

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
  //console.log(name);
  req.display.section = name;
  list.forEach(function (series) {
    if (name === res.locals.makeUrl(series.name)) {
      series_key = series.series_key;
      req.display.series = series;
      next();
    }
  });
  if (!series_key) {
    res.redirect('/series_not_found');
  }
});

router.get('/', function (req, res) {
  res.redirect('/photo/' + res.locals.makeUrl(req.display.list[0].name));
});

router.get('/:name', function (req, res) {
  photo.getInfo(req.display.series.series_key, 1, function (photo_info) {
    //console.log(photo_info);
    if (photo_info.url) {
      req.display.photo = photo_info;
    }
    res.render('photo', req.display);
  });
});

router.post('/:name', function (req, res) {
  if (req.body.sort) {
    console.log(req.body.sort);
    photo.getInfo(req.display.series.series_key, req.body.sort, function (photo_info) {
      if (photo_info !== "error") {
        res.json({ result: "success", data: photo_info });
      } else {
        res.json({ result: "error", message: "no photo" });
      }
    });
  } else {
    res.json({ result: "error", message: "no sort" });
  }
});

module.exports = router;
