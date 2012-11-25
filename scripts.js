$(document).ready(function(){
	// in the beginning get all posts & comments
	$.get('/posts', {}, function(posts){
		$.get('/comments', {}, function(comments){
			setPostsAndComments(posts, comments);
		})
	});

	function setPostsAndComments(posts, comments){
		$.each(posts, function(index, post){
			appendPost(post);
			appendComments(comments, post._id);
		});
	}

	function appendPost(post){
		$('#posts').append(
			'<div class="post" id="post_' + post._id + '">' + post.text +
				'<form class="add-comment" method="post" action="/comments/' + post._id + '">' +
					'Add comment: <br />' +
					'<textarea name="text"></textarea> <br />' +
					'<input type="hidden" name="commentLevel" value="1" />' +
					'<input type="submit" />' +
				'</form>' +
				'<div class="comments"></div>' +
			'</div>'
		);
	}

	function appendComments(all_comments, post_id){
		$.each(all_comments, function(index, comment){
			if(post_id == comment.postId){
				appendComment(comment);
			}
		});
	}

	function appendComment(comment){
		if(comment.commentLevel == 1){
			$('#post_' + comment.postId + ' .comments').append(
				'<div class="comment" id="comment_' + comment._id + '">' + comment.text +
					'<form class="add-comment" method="post" action="/comments/' + comment.postId + '">' +
						'Add comment: <br />' +
						'<textarea name="text"></textarea> <br />' +
						'<input type="hidden" name="parentId" value="' + comment._id + '" />' +
						'<input type="hidden" name="commentLevel" value="' + (comment.commentLevel * 1 + 1) + '" />' +
						'<input type="submit" />' +
					'</form>' +
				'</div>'
			);
		}else{
			$('#comment_' + comment.parentId).append(
				'<div class="comment" id="comment_' + comment._id + '">' + comment.text +
					'<form class="add-comment" method="post" action="/comments/' + comment.postId + '">' +
						'Add comment: <br />' +
						'<textarea name="text"></textarea> <br />' +
						'<input type="hidden" name="parentId" value="' + comment._id + '" />' +
						'<input type="hidden" name="commentLevel" value="' + (comment.commentLevel * 1 + 1) + '" />' +
						'<input type="submit" />' +
					'</form>' +
				'</div>'
			);
		}
	}

	// Frontend actions
	$('.add-post').live('submit', function(){
		addPost(
			$(this).attr('action'), {
			text: $(this).find('textarea').val()
		});

		$(this).find('textarea').val('');

		return false;
	});

	$('.add-comment').live('submit', function(){
		addComment(
			$(this).attr('action'), {
			text: $(this).find('textarea').val(),
			parentId: $(this).find('input[name="parentId"]').val(),
			commentLevel: $(this).find('input[name="commentLevel"]').val()
		});

		$(this).find('textarea').val('');

		return false;
	});

	function addPost(url, data){
		$.post(url, data, function(post){
			appendPost(post);
		});
	}

	function addComment(url, data){
		$.post(url, data, function(comment){
			appendComment(comment);
		});
	}
});
