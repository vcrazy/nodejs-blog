var databaseUrl = "blogdb",
	collections = ["blog"],
	db = require("mongojs").connect(databaseUrl, collections);

exports.findAll = function(req, res){
	db.blog.find({}, function(err, posts){
		console.log(posts);
		res.send({name: 'We are here'});
	});
};
