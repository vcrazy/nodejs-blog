var db = require('mongojs').connect('blogdb', ['posts', 'comments']); // dbName, collections

// List all posts
exports.getAllPosts = function(req, res){
	db.posts.find({}, function(err, posts){
		res.send(posts);
	}).sort({date: 1});
};

// Create post
exports.createPost = function(req, res){
	var data = req.body;
	data.date = new Date;

	if(validate(data.text, res)){
		db.posts.save(data, function(err, post){
			res.send(post);
		});
	}
};

// Update post
exports.updatePost = function(req, res){
	var data = req.body;
	data._id = objId(req.params.id);

	if(validate(data.text, res)){
		db.posts.save(data, function(){
			res.send({success: 1});
		});
	}
};

// Delete post
exports.deletePost = function(req, res){
	var result = 0;

	db.posts.remove({_id: objId(req.params.id)}, true, function(err, success){
		result += !err;

		if(result == 2){
			res.send({success: 1});
		}
	});
	db.comments.remove({postId: req.params.id}, function(err, success){
		result += !err;

		if(result == 2){
			res.send({success: 1});
		}
	});
};

// Show a post with its comments
exports.getOnePostWithComments = function(req, res){
	var result = 0,
		data = {post: {}, comments: []};

	db.posts.findOne({_id: objId(req.params.id)}, function(err, post){
		result += 1;
		data.post = post;

		if(result == 2){
			res.send(data);
		}
	});

	db.comments.find({postId: req.params.id}, function(err, comments){
		result += 1;
		data.comments = comments;

		if(result == 2){
			res.send(data);
		}
	});
};

// Comment post
exports.createComment = function(req, res){
	var data = req.body;
	data.postId = req.params.id;
	data.date = new Date;

	if(validate(data.text, res)){
		db.comments.save(data, function(err, comment){
			res.send(comment);
		});
	}
};

// Delete comment
exports.deleteComment = function(req, res){
	db.comments.remove({_id: objId(req.params.id)}, function(err, success){
		if(!success){
			return finishDeleteComment(res);
		}

		db.comments.find({parentId: req.params.id}, {_id: 1}, function(err, comments){
			return findAndRemove(comments, res);
		});
	});
};

function validate(field, res){
	var valid = field != '';

	if(!valid){
		res.send({error: true});
	}

	return valid;
}

function objId(id){
	return new db.bson.ObjectID(id);
}

function findAndRemove(comments, res){
	if(!comments.length){
		return finishDeleteComment(res);
	}

	var arr = [],
		arrIds = [];

	for(var i in comments){
		arr.push(comments[i]._id);
		arrIds.push(objId(comments[i]._id));
	}

	db.comments.remove({$in: {_id: arrIds}}, function(err, success){
		if(!success){
			return finishDeleteComment(res);
		}

		db.comments.find({$in: {parentId: arr}}, {_id: 1}, function(err, comments){
			findAndRemove(comments, res);
		});
	});
}

function finishDeleteComment(res){
	res.send({});
}