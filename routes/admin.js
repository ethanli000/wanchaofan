var express = require('express');
var router = express.Router();
var Mongolian = require("mongolian");
var db = new Mongolian("mongodb://wcfadmin:8ffae097a0@ds029960.mongolab.com:29960/wanchaofan");
//var db = server.db("");


/* GET users listing. */
router.get('/', function (req, res, next) {
  var sess = req.session;
  if (!sess.login_flg) {
    res.redirect('/admin/login');
  } else {
    res.render('admin/index', { title: 'Wan Chaofan - admin' });
  }
});

router.get('/login', function (req, res, next) {
  var sess = req.session;
  if (sess.login_flg) {
    res.redirect('/admin/');
  } else {
    res.render('admin/login', { title: 'Wan Chaofan - admin login' });
  }
});

router.post('/login', function (req, res, next) {
  var sess = req.session;
  console.log(req.body);
  if (req.body.login) {
    var info = db.collection('info');
    info.findOne({ admin_id: "wanchaofan" }, function (err, site_info) {
      console.log(err);
      console.log(site_info);
      if (!err && site_info) {
        if (req.body.user !== site_info.admin_id || req.body.pass !== site_info.password) {
          res.render('admin/login', { title: 'Wan Chaofan - admin login', message: 'username/password wrong' });
        } else {
          sess.login_flg = 1;
          res.redirect('/admin/');
        }
      } else {
        res.render('admin/login', { title: 'Wan Chaofan - admin login', message: 'unexpect way to login' });
      }
    });
  } else {
    res.render('admin/login', { title: 'Wan Chaofan - admin login', message: 'unexpect way to login' });
  }
});

router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/admin/login');
});

module.exports = router;
