const express = require('express');
const router = express.Router();
const url = require('url');
const imgSearch = require('../public/js/imgSearch.js');

// Get home page
router.get('/', function(req, res) {
	var db = req.db,
		collection = db.get('imgcollection');

	collection.find({},{},function(err,result){
		if(err){
			console.log("Error loading image searches:",err);
			res.send("Error loading image searches");
		}else{
			res.setHeader('Content-Type', 'application/json');
			if(result){
				res.send(result);
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
		imgSrc = 'imgur';

	// Search for images via specified search engine (Bing Image or Imgur)
	imgSearch.getImages(searchQuery,offset,imgSrc,res);

});

// router.get('/*',function(req,res){
// 	var id = req.params['0'],
// 		db = req.db,
// 		collection = db.get('imgcollection');
	
// });

module.exports = router;