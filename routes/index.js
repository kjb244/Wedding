'use strict';

let express = require('express');
let router = express.Router();
let path = require('path');
let content = require('../copy/content.json');
let dbutils = require('../utils/dbUtils.js');

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

router.get('/route_templates/:name', function (req, res) {
    var name = req.params.name;
    res.sendFile(path.join(__dirname, '../', 'views', 'route_templates', name));
})

router.get('/getContent', function(req, res){
  return res.json(content);
});

router.get('/lookupByEmail', function(req, res){
  let email = req.query['email'] || '';
  let prom = dbutils.getByEmail(email);
  prom.then(function(payload){
    res.json(payload);
  })

});

router.post('/submitRSVPData', function(req, res){
    const data = req.body.data;
    const email = data.email;
    const formData = data.rsvpFormArray;

    dbutils.updateByEmail(email,formData[0]).then(function(payload){
       if(formData.length > 1){
           dbutils.updateByEmail(email,formData[1]).then(function(payload2){
               res.json({rowsUpdated: payload + payload2});
           })
       }
       else{
           res.json({rowsUpdated: payload});
       }
    });





});









module.exports = router;
