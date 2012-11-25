$(document).ready(function(){
	$.get('/posts', {}, function(posts){
		$.get('/comments', {}, function(comments){
			setPosts(posts);
			setComments(comments);
		})
	});

	function setPosts(posts){
//		$('#posts').empty();

		$.each(posts, function(index, post){
			$('#posts').append('<div class="post" id="post_' + post._id + '">' + post.text + '<div class="comments"></div></div>');
		});
	}

	function setComments(comments){
//		$('.comments').empty();

		$.each(comments, function(index, comment){
			$('#post_' + comment.postId + ' .comments').append('<div class="comment">' + comment.text + '</div>');
		});
	}
});
