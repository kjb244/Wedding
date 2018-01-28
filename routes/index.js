'use strict';

let express = require('express');
let router = express.Router();
let path = require('path');
let content = require('../copy/content.json');
let dbutils = require('../utils/dbutils.js');

//GETS
router.get('/', function(req, res, next) {
  res.render('index', {});

});

router.get('/partials/:name', function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
});

router.get('/directive_templates/:name', function (req, res) {
  var name = req.params.name;
  res.sendFile(path.join(__dirname, '../', 'views', 'directive_templates', name));
});

router.get('/getContent', function(req, res){
  return res.json(content);
});

router.get('/lookupByEmail', function(req, res){
  let email = req.query['email'] || '';
  console.log('email', email);
  let prom = dbutils.getByEmail(email);
  prom.then(function(payload){
    res.json(payload);
  })

});









module.exports = router;
