var express = require('express');
var router = express.Router();
var fs = require("fs")



var fireAdmin = require('firebase-admin');

var fireConfig = require('../firebaseData.json');
  // Initialize Firebase
  var config = {
    credential: fireAdmin.credential.cert(fireConfig
    ),
    databaseURL: "https://kcoderguide.firebaseio.com",
    };
  fireAdmin.initializeApp(config);


  /* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', {title:'Algoritmolandia' });
});


router.get('/feedback', function(req, res, next) {
  res.render('feedback',{article:req.query.article,facilidad:req.query.facilidad, sugerencias:req.query.sugerencias} );
});


router.get('/articles', function(req, res, next) {
  res.render('articles', {title:'articles' });
});

router.get('/:code', function(req, res, next) {
    var urlCode=req.params.code;
    if (!(/^[a-zA-Z\-0-9]+$/.test(urlCode))) {
      res.render('invalidurl',{});
    }
    if (!fs.existsSync('./views/articles/'+urlCode+'.hbs')) {
        res.render('error404', {message:urlCode, title:'Error 404'});
        return;
    }
    var q = fireAdmin.database().ref("articles/"+urlCode+"/tags");

    q.on("value",function(snapshot) {

    res.render('articles/'+urlCode, {show_tags:true, tag_info:snapshot.val(), isArticle:true,title:urlCode});
    });
    
  });
module.exports = router;
