'use strict';

let express = require('express');
let router = express.Router();
let path = require('path');
let homeContent = require('../copy/home.json');

//GETS
router.get('/', function(req, res, next) {
  res.render('index', homeContent);

});

router.get('/partials/:name', function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
});

router.get('/directive_templates/:name', function (req, res) {
  var name = req.params.name;
  res.sendFile(path.join(__dirname, '../', 'views', 'directive_templates', name));
});









module.exports = router;
