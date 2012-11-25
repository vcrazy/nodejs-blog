$(document).ready(function(){
	$.get('/posts', {}, function(posts){
		setPosts(posts);
	});

	function setPosts(posts){
		$('#posts').empty();

		$.each(posts, function(index, post){
			$('#posts').append('<div class="post">' + post.text + '<div class="comments"></div></div>');
		});
	}
});
