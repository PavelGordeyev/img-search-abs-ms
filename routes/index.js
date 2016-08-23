const express = require('express');
const router = express.Router();


// Get home page
router.get('/', function(req, res) {
  res.render('index');
});

// Get url submitted by user
router.get('/api/imagesearch/*:offset',function(req,res){
	var protocol = req.params.protocol,
		uri = req.params['0'],
		fullURL = protocol + uri,
		shortenedURL = '',
		results,
		db = req.db,
		collection = db.get('urlcollection');

	res.setHeader('Content-Type', 'application/json');

	res.send(JSON.stringify(results));
});

router.get('/*',function(req,res){
	var id = req.params['0'],
		db = req.db,
		collection = db.get();
	
});

module.exports = router;