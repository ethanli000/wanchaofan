var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('cover', { title: 'Wan Chaofan - FOTO' });
});

module.exports = router;
