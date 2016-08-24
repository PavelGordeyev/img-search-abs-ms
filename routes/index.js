const express = require('express');
const router = express.Router();
const url = require('url');
const imgSearch = require('../public/js/imgSearch.js');
const moment = require('moment');

// Get home page
router.get('/api/latest/imagesearch/*', function(req, res) {
	var db = req.db,
		collection = db.get('imgcollection');

	// Return all of recent searches
	collection.find({},{},function(err,result){
		if(err){
			console.log("Error loading image searches:",err);
			res.send("Error loading image searches");
		}else{
			res.setHeader('Content-Type', 'application/json');
			if(result){
				res.send(result.slice(0,10));
			}else{
				res.send({"Recent Searches": "none"});
			}
		}
	});
});

// Get url submitted by user
router.get('/api/imagesearch/*:offset',function(req,res){

	var path = url.parse(req.url).pathname.split('/'),
		searchQuery = path[path.length - 1],
		offset = url.parse(req.url,true).query.offset,
		imgSrc = 'bing',
		db = req.db,
		collection = db.get('imgcollection'),
		now = moment();

	// Add search to the db with a timestamp
	collection.insert({
		"term": searchQuery,
		"when": now.format('YYYY-MM-DD HH:mm:ss Z')
	}, function(err, result) {
	    assert.equal(err, null);
	    assert.equal(1, result.ops.length);
	});
	// Search for images via specified search engine (Bing Image or Imgur)
	imgSearch.getImages(searchQuery,offset,imgSrc,res);

});

module.exports = router;