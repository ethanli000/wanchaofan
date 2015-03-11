var express = require('express');
var router = express.Router();
var path = require('path');
var admin = require(path.join(__dirname, '../modules/admin'));

router.get('/', function (req, res) {
  var sess = req.session;
  if (!sess.login_flg) {
    res.redirect('/admin/login');
  } else {
    res.render('admin/index', { title: 'Wan Chaofan - admin' });
  }
});

router.get('/login', function (req, res) {
  var sess = req.session;
  if (sess.login_flg) {
    res.redirect('/admin/');
  } else {
    res.render('admin/login', { title: 'Wan Chaofan - admin login' });
  }
});

router.post('/login', function (req, res) {
  var sess = req.session;
  if (req.body.login) {
    admin.login(req.body.user, req.body.pass, function (result) {
      if (result === "error") {
        res.render('admin/login', { title: 'Wan Chaofan - admin login', message: 'login failed unexpectedly' });
      }
      if (result === "failed") {
        res.render('admin/login', { title: 'Wan Chaofan - admin login', message: 'username/password wrong' });
      }
      if (result === "success") {
        sess.login_flg = 1;
        res.redirect('/admin/');
      }
    });
  } else {
    res.render('admin/login', { title: 'Wan Chaofan - admin login', message: 'login failed without push login button' });
  }
});

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/admin/login');
});

module.exports = router;
