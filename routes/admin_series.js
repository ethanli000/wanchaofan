var express = require('express');
var router = express.Router();
var path = require('path');
var series = require(path.join(__dirname, '../modules/series'));

router.use(function checkLogin(req, res, next) {
  var sess = req.session;
  if (!sess.login_flg) {
    res.redirect('/admin/login');
    return;
  }
  next();
});

router.param('key', function (req, res, next, series_key) {
  var display = { title: 'Wan Chaofan - admin/series', section: "series" };
  series.getInfo(series_key, function (result) {
    if (result !== "error") {
      display.series = result;
      req.display = display;
      //get photo_list
      next();
    } else {
      res.redirect('/404');
    }
  });

});

router.get('/', function (req, res) {
  series.getList(function (series_list) {
    res.render('admin/series', { section: "series", title: 'Wan Chaofan - admin/series', series_list: series_list });
  });
});

router.post('/add', function (req, res) {
  if (req.body.name) {
    series.add(req.body.name, function (result) {
      res.json(result);
    });
  } else {
    res.json({ result: "error", message: "no name" });
  }
});

router.post('/delete', function (req, res) {
  if (req.body.series_key) {
    var update_data = {is_delete: 1};
    series.update(req.body.series_key, update_data, function (result) {
      res.json(result);
    });
  } else {
    res.json({ result: "error", message: "no selected series" });
  }
});

router.post('/edit', function (req, res) {
  if (req.body.series_key && req.body.update_data) {
    var update_data = JSON.parse(req.body.update_data);
    series.update(req.body.series_key, update_data, function (result) {
      res.json(result);
    });
  } else {
    res.json({ result: "error", message: "no selected series or data incorrect" });
  }
});

router.get('/:key', function (req, res) {
  res.render('admin/series_photo', req.display);
});

module.exports = router;
