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
	db.posts.remove({_id: objId(req.params.id)}, true, function(err, success){
		db.comments.remove({postId: req.params.id}, function(err, success){
			res.send({success: 1});
		});
	});
};

// Show a post with its comments
exports.getOnePostWithComments = function(req, res){
	var data = {post: {}, comments: []};

	db.posts.findOne({_id: objId(req.params.id)}, function(err, post){
		if(err){
			res.send(data);
			return;
		}

		data.post = post;

		db.comments.find({postId: req.params.id}, function(err, comments){
			data.comments = comments;

			res.send(data);
		}).sort({date: 1});
	});
};

// Comment post
exports.createComment = function(req, res){
	var data = req.body,
		parentId = data.parentId;

	data.postId = req.params.id;
	data.date = new Date;

	if(validate(data.text, res)){
		if(parentId){
			db.comments.findOne({_id: objId(parentId)}, function(err, comment){
				if(err){
					res.send({});
					return;
				}

				if(parentId){
					data.parentIds = comment ? (comment.parentIds || []) : [];
					data.parentIds.push(parentId);
				}

				db.comments.save(data, function(err, comment){
					res.send(comment);
				});
			});
		}else{
			db.comments.save(data, function(err, comment){
				res.send(comment);
			});
		}
	}
};

// Delete comment
exports.deleteComment = function(req, res){
	db.comments.remove({_id: objId(req.params.id)}, function(err, success){
		if(err){
			res.send({});
			return;
		}

		db.comments.remove({$in: {parentIds: req.params.id}}, function(err, success){
			res.send({success: 1});
		});
	});
};

function validate(field, res){
	var valid = typeof field != 'undefined' && field != '';

	if(!valid){
		res.send({error: true});
	}

	return valid;
}

function objId(id){
	return new db.bson.ObjectID(id.substr(0, 24));
}
