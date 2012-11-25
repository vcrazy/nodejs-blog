var databaseUrl = 'blogdb',
	collections = ['posts', 'comments'],
	db = require('mongojs').connect(databaseUrl, collections);

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
	db.posts.save({data: 'n/a'}, function(err, post){
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
	});
};

exports.createComment = function(req, res){
	db.comments.save({data: 'comment', postId: req.params.id}, function(err, comment){
		res.send(comment);
	});
};
