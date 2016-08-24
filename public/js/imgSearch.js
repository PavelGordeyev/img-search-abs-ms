const https = require('https');

function getImages(searchQuery,offset,imgSrc,res){

	var bing_options = {
			host: "api.cognitive.microsoft.com",
			path: "/bing/v5.0/images/search?q=" + searchQuery + "&count=10&offset=" + offset + "&mkt=en-us&safeSearch=Moderate",
			method: 'GET',
			headers:{"Ocp-Apim-Subscription-Key": "34fb62237b8446eaa993eb5fa1c99662"}
		},
		imgur_options = {
		  host:"api.imgur.com",
		  path:"/3/gallery/search/?q_all=" + searchQuery,
		  method: 'GET',
		  headers:{"Authorization" : "Client-ID 9718f34ee16c087"}
		},
		options = imgSrc === 'bing' ? bing_options : imgur_options;

	imgEngine(imgSrc,offset,options,res);
}

function imgEngine(imgSrc,offset,options,res){
	var data = '';

	var req = https.request(options,function(_res){
		_res.setEncoding('utf8');

		_res.on('data', function(chunk){
			if(_res.statusCode === 200){
				data += chunk;
			}else{
				console.log("ERROR:", _res.statusCode);
			}
		});

		_res.on('end', function(){
			if(data){
				if(imgSrc === 'bing'){
					var results = JSON.parse(data).value.slice(0,offset).map(function(result){
						return {
							url: result.contentUrl,
							snippet: result.name,
							thumnail: result.thumbnailUrl,
							context: result.hostPageUrl
						};
					});
				}else if(imgSrc === 'imgur'){
					var results = JSON.parse(data).data.slice(0,offset).map(function(result){
					return {
							url: result.link,
							snippet: result.title
						};
					});
				}
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(results));
			}else{
				console.log("No results found...");
				res.send("No results found!");
			}
			
		});

		_res.on('error',function(err){
			console.log("Error on response:", err.message);
		});
	});


	req.on('error',function(err){
		console.log("Error on request:",err.message);
	});

	req.end();
}

module.exports.getImages = getImages;
