$(document).ready(function(){
	// in the beginning get all posts
	getAllPosts();

	function setPostsAndComments(posts, comments){
		$.each(posts, function(index, post){
			appendPost(post);
			appendComments(comments, post._id);
		});
	}

	function appendPost(post){
		if(post.error){
			return;
		}

		$('#posts').append(
			'<div class="post" id="post_' + post._id + '">' +
				'<span class="post-text">' + post.text + '</span> ' +
				'<span class="post-id">' + post._id + '</span> ' +
				'<a href="#" class="show-comments">Show this post with its comments</a> ' +
				'<a href="#" class="edit-post">Edit</a> ' +
				'<a href="#" class="delete-post">Delete</a> ' +
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
		if(!all_comments){
			return;
		}

		$.each(all_comments, function(index, comment){
			if(!post_id || post_id == comment.postId){
				appendComment(comment);
			}
		});
	}

	function appendComment(comment){
		if(comment.error){
			return;
		}

		if(comment.commentLevel == 1){ // append to post
			$('#post_' + comment.postId + ' .comments').append(
				'<div class="comment" id="comment_' + comment._id + '">' + comment.text +
					'<span class="post-id">' + comment.postId + '</span> ' +
					'<span class="comment-id">' + comment._id + '</span> ' +
					'<a href="#" class="delete-comment">Delete</a> ' +
					'<form class="add-comment" method="post" action="/comments/' + comment.postId + '">' +
						'Add comment: <br />' +
						'<textarea name="text"></textarea> <br />' +
						'<input type="hidden" name="parentId" value="' + comment._id + '" />' +
						'<input type="hidden" name="commentLevel" value="' + (comment.commentLevel * 1 + 1) + '" />' +
						'<input type="submit" />' +
					'</form>' +
				'</div>'
			);
		}else{ // append to comment
			$('#comment_' + comment.parentId).append(
				'<div class="comment" id="comment_' + comment._id + '">' + comment.text +
					'<span class="post-id">' + comment.postId + '</span> ' +
					'<span class="comment-id">' + comment._id + '</span> ' +
					'<a href="#" class="delete-comment">Delete</a> ' +
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

	// FRONTEND ACTIONS
	// Create post
	$('.add-post').live('submit', function(){
		addPost(
			$(this).attr('action'), {
			text: $(this).find('textarea').val()
		});

		$(this).find('textarea').val('');

		return false;
	});

	// Update post
	$('.edit-post-form').live('submit', function(){
		var text = $(this).parent().find('textarea').val();

		$.ajax({
			url: $(this).attr('action'),
			type: 'PUT',
			data: {text: text},
			dataType: 'json'
		});

		$(this).parent().parent().parent().find('.edit-post').show();
		$(this).parent().parent().find('.post-text').text(text);

		return false;
	});

	// Delete post
	$('.delete-post').live('click', function(){
		if(!confirm('Are you sure?')){
			return false;
		}

		$.ajax({
			url: '/posts/' + $(this).parent().find('.post-id').text(),
			type: 'DELETE',
			success: function(){
				getAllPosts();
			}
		});

		return false;
	});

	// Comment post
	$('.add-comment').live('submit', function(){
		addComment(
			$(this).attr('action').split('/').pop(), {
			text: $(this).find('textarea').val(),
			parentId: $(this).find('input[name="parentId"]').val(),
			commentLevel: $(this).find('input[name="commentLevel"]').val()
		});

		$(this).find('textarea').val('');

		return false;
	});

	$('.edit-post').live('click', function(){
		var textElement = $(this).parent().find('.post-text'),
			text = $(textElement).text(),
			id = $(this).parent().find('.post-id').text();

		$(textElement).html(
			'<form method="post" action="/posts/' + id + '" class="edit-post-form">' +
				'<textarea name="text">' + text + '</textarea>' +
				'<input type="hidden" name="previousText" value="' + text + '" />' +
				'<input type="button" class="back" value="Back" />' +
				'<input type="submit" />' +
			'</form>'
		);

		$(this).hide();

		return false;
	});

	$('.back').live('click', function(){
		var text = $(this).parent().find('input[name="previousText"]').val();

		$(this).parent().parent().parent().find('.edit-post').show();
		$(this).parent().parent().text(text);

		return false;
	});

	$('.show-comments').live('click', function(){
		var postId = $(this).parent().find('.post-id').text();

		showPostComments(postId);

		return false;
	});

	$('.delete-comment').live('click', function(){
		if(!confirm('Are you sure?')){
			return false;
		}

		var postId = $(this).parent().find('.post-id').text(),
			commentId = $(this).parent().find('.comment-id:first').text();

		$.ajax({
			url: '/comments/' + commentId,
			type: 'DELETE',
			success: function(){
				showPostComments(postId);
			}
		});

		return false;
	});

	$('.show-all-posts').click(function(){
		getAllPosts();

		return false;
	});
	// END OF FRONTEND ACTIONS

	// Show a post with its comments
	function showPostComments(id){
		$('#posts').empty();

		$.get('/posts/' + id, {}, function(data){
			setPostsAndComments([data.post], data.comments);
		});
	}

	function addPost(url, data){
		$.post(url, data, function(post){
			$('#posts').empty();

			$.get('/posts', {}, function(posts){
				setPostsAndComments(posts, null);
			});
		});
	}

	function addComment(id, data){
		$.post('/comments/' + id, data, function(comment){
			showPostComments(id);
		});
	}

	// List all posts
	function getAllPosts(){
		$('#posts').empty();

		$.get('/posts', {}, function(posts){
			setPostsAndComments(posts, null);
		});
	}
});
