var databaseUrl = "blogdb",
	collections = ["blog"],
	db = require("mongojs").connect(databaseUrl, collections);

exports.getAllPosts = function(req, res){
	db.blog.find({}, function(err, posts){
		res.send(posts);
	});
};

exports.getOnePost = function(req, res){
	db.blog.findOne({_id: req.params.id}, function(err, post){
		res.send(post);
	});
};

exports.createPost = function(req, res){
	db.blog.save({data: 'n/a'}, function(err, post){
		res.send(post);
	});
};

exports.updatePost = function(req, res){
	db.blog.save({_id: req.params.id, data: 'update data n/a'}, function(err, post){
		res.send('postsdada');
	});
};

exports.deletePost = function(req, res){
	db.blog.remove({_id: req.params.id}, true, function(err, post){
		res.send(post);
	});
};

exports.createComment = function(req, res){
	db.blog.save({data: 'comment', postId: req.params.id}, function(err, comment){
		res.send(comment);
	});
};
