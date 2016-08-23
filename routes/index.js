const express = require('express');
const router = express.Router();
const url = require('url');

// Get home page
router.get('/', function(req, res) {
  res.render('index');
});

// Get url submitted by user
router.get('/api/imagesearch/*:offset',function(req,res){

	var path = url.parse(req.url).pathname.split('/'),
		searchQuery = path[path.length - 1],
		offset = url.parse(req.url,true).query.offset;

	console.log("searchQuery:",searchQuery);
	console.log("offset:",offset);

	res.setHeader('Content-Type', 'text/plain');

	res.send("hello");
});

router.get('/*',function(req,res){
	var id = req.params['0'],
		db = req.db,
		collection = db.get();
	
});

module.exports = router;