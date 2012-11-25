var db = require('mongojs').connect('blogdb', ['posts', 'comments']); // dbName, collections

exports.getAllPosts = function(req, res){
	db.posts.find({}, function(err, posts){
		res.send(posts);
	});
};

exports.getOnePost = function(req, res){
	db.posts.findOne({_id: req.params.id}, function(err, post){
		res.send(post);
	});
};

exports.createPost = function(req, res){
	db.posts.save(req.body, function(err, post){
		res.send(post);
	});
};

exports.updatePost = function(req, res){
	db.posts.save({_id: req.params.id, data: 'update data n/a'}, function(err, post){
		res.send('postsdada');
	});
};

exports.deletePost = function(req, res){
	db.posts.remove({_id: req.params.id}, true);
	db.comments.remove({postId: req.params.id}, true);
};

exports.getAllComments = function(req, res){
	db.comments.find({}, function(err, comments){
		res.send(comments);
	}).sort({date: 1});
};

exports.createComment = function(req, res){
	var data = req.body;
	data.postId = req.params.id;
	data.date = new Date;

	db.comments.save(data, function(err, comment){
		res.send(comment);
	});
};

exports.deleteComment = function(req, res){
	db.comments.remove({_id: req.params.id}, true);
};
