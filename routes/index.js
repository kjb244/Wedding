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

router.get('/allData', function(req, res){
   let pw = req.query['password'] || '';
   let prom = dbutils.getAllData(pw);
   prom.then(function(payload){
       res.render('partials/getAllData', {payload: payload});
   }).catch(function(err){
       res.json({'error': 'error'});
   })
});

router.post('/submitRSVPData', function(req, res){
    const data = req.body.data;
    const email = data.email;
    const formData = data.rsvpFormArray;

    dbutils.updateByEmail(email,formData[0]).then(function(payload){
       if(formData.length > 1){
           dbutils.updateByEmail(email,formData[1]).then(function(payload2){
               if(formData.length > 2){
                   dbutils.updateByEmail(email,formData[2]).then(function(payload3){
                       if(formData.length > 3){
                           dbutils.updateByEmail(email,formData[3]).then(function(payload4){
                               res.json({rowsUpdated: payload + payload2 + payload3 + payload4});
                           }).catch(function(err){
                               console.log('update error' + err);
                           });
                       }
                       else{
                           res.json({rowsUpdated: payload + payload2 + payload3});
                       }
                   }).catch(function(err){
                       console.log('update error' + err);
                   });
               }
               else{
                   res.json({rowsUpdated: payload + payload2});
               }

           }).catch(function(err){
               console.log('update error' + err);
           });
       }
       else{
           res.json({rowsUpdated: payload});
       }
    }).catch(function(err){
        console.log('update error' + err);
    });





});









module.exports = router;
