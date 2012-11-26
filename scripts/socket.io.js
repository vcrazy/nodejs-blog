socket = io.connect('http://localhost:3001');

$('document').ready(function(){
	socket.on('comment.created', function(data){
		window.setComment(data);
	});

	socket.on('comment.deleted', function(id){
		window.deleteComment(id);
	});

	socket.on('post.created', function(posts){
		window.setPostsAndComments(posts);
	});

	socket.on('post.deleted', function(id){
		window.removePost(id);
	});

	socket.on('post.updated', function(data){
		window.updatePost(data);
	});
});
