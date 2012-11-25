var db = require('mongojs').connect('blogdb', ['posts', 'comments']); // dbName, collections

exports.getAllPosts = function(req, res){
	db.posts.find({}, function(err, posts){
		res.send(posts);
	}).sort({date: 1});
};

exports.getOnePost = function(req, res){
	db.posts.findOne({_id: req.params.id}, function(err, post){
		res.send(post);
	});
};

exports.createPost = function(req, res){
	var data = req.body;
	data.date = new Date;

	if(validate(data.text, res)){
		db.posts.save(data, function(err, post){
			res.send(post);
		});
	}
};

exports.updatePost = function(req, res){
	var data = req.body;
	data._id = objId(req.params.id);
	data.date = new Date;

	if(validate(data.text, res)){
		db.posts.save(data, function(){
			res.send({success: 1});
		});
	}
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

	if(validate(data.text, res)){
		db.comments.save(data, function(err, comment){
			res.send(comment);
		});
	}
};

exports.deleteComment = function(req, res){
	db.comments.remove({_id: req.params.id}, true);
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