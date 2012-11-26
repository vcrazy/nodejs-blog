loadTemplate = {}, setPostsAndComments = {};
setComment = {}, deleteComment = {}, updatePost = {}, removePost = {};

$(document).ready(function(){
	var tmpl = {};

	// in the beginning get all posts
	getAllPosts();

	function refreshPosts(){
		$.get('/posts', {}, function(posts){
			setPostsAndComments(posts, null);
			socket.emit('post.created', posts);
		});
	}

	setPostsAndComments = function setPostsAndComments(posts, comments){
		$('#posts').empty();

		$.each(posts, function(index, post){
			appendPost(post);
			appendComments(comments, post._id);
		});
	}

	function appendPost(post){
		if(post.error){
			return;
		}

		loadTemplate('posts', [post], '#posts');
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

		comment.commentLevel = comment.commentLevel * 1 + 1;

		if(comment.commentLevel == 1){ // append to post
			loadTemplate('comments', [comment], '#post_' + comment.postId + ' .comments');
		}else{ // append to comment
			loadTemplate('comments', [comment], '#comment_' + comment.parentId);
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

		socket.emit('post.updated', {postId: $(this).attr('action').split('/').pop(), text: text});

		return false;
	});

	updatePost = function updatePost(obj){
		$('#post_' + obj.postId).find('.post-text').text(obj.text);
	}

	// Delete post
	$('.delete-post').live('click', function(){
		if(!confirm('Are you sure?')){
			return false;
		}

		var postId = $(this).parent().find('.post-id:first').text();

		$.ajax({
			url: '/posts/' + postId,
			type: 'DELETE',
			success: function(){
				removePost('post_' + postId);
				socket.emit('post.deleted', 'post_' + postId);
			}
		});

		return false;
	});

	removePost = function removePost(id){
		$('#' + id).remove();
	}

	// Comment post
	$('.add-comment').live('submit', function(){
		var comment = {
			text: $(this).find('textarea').val(),
			parentId: $(this).find('input[name="parentId"]').val(),
			commentLevel: $(this).find('input[name="commentLevel"]').val()
		};

		addComment($(this).attr('action').split('/').pop(), comment);

		$(this).find('textarea').val('');

		comment.postId = $(this).attr('action').split('/').pop();

		return false;
	});

	$('.edit-post').live('click', function(){
		var textElement = $(this).parent().find('.post-text:first'),
			text = $(textElement).text(),
			id = $(this).parent().find('.post-id:first').text();

		loadTemplate('edit_post', [{id: id, text: text}], '#post_' + id + ' .post-text:first');

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

		$('.add-post').hide();
		showPostComments(postId);

		return false;
	});

	$('.delete-comment').live('click', function(){
		if(!confirm('Are you sure?')){
			return false;
		}

		var commentId = $(this).parent().find('.comment-id:first').text(),
			id = $(this).parent().attr('id');

		$.ajax({
			url: '/comments/' + commentId,
			type: 'DELETE'
		});

		deleteComment(id);
		socket.emit('comment.deleted', id);

		return false;
	});

	deleteComment = function deleteComment(id){
		$('#' + id).remove();
	}

	$('.show-all-posts').live('click', function(){
		getAllPosts();
		$('.add-post').show();

		return false;
	});
	// END OF FRONTEND ACTIONS

	// Show a post with its comments
	function showPostComments(id){
		$('#posts').empty();

		$.get('/posts/' + id, {}, function(data){
			if(data.post){
				loadTemplate('post', data.post, '#posts');

				$.each(data.comments, function(index, comment){
					comment.commentLevel = comment.commentLevel * 1 + 1;
					if(comment.commentLevel == 2){
						loadTemplate('comments', [comment], '#post_' + data.post._id + ' .comments');
					}else{
						loadTemplate('comments', [comment], '#comment_' + comment.parentId);
					}
				});
			}else{
				getAllPosts();
			}
		});
	}

	function addPost(url, data){
		$.post(url, data, function(post){
			refreshPosts();
		});
	}

	function addComment(id, data){
		$.post('/comments/' + id, data, function(comment){
			socket.emit('comment.created', comment);
			setComment(comment);
		});
	}

	setComment = function setComment(comment){
		if(comment.parentId){
			loadTemplate('comments', [comment], '#comment_' + comment.parentId);
		}else{
			loadTemplate('comments', [comment], '#post_' + comment.postId);
		}
	}

	// List all posts
	function getAllPosts(){
		$('#add-post').show();

		$.get('/posts', {}, function(posts){
			$('#posts').empty();
			loadTemplate('posts', posts, '#posts');
		});
	}

	loadTemplate = function loadTemplate(tplName, data, appendTo){
		if(tmpl[tplName]){
			if(appendTo && $(appendTo).length){
				$.tmpl(tmpl[tplName], data).appendTo(appendTo);
			}
			return;
		}

		$.ajax({
			dataType: 'html',
			url: '/templates/' + tplName + '.html',
			success: function(tpl){
				tmpl[tplName] = tpl;
				if(appendTo && $(appendTo).length){
					$.tmpl(tpl, data).appendTo(appendTo);
				}
			}
		});
	}

	var templates = ['add_post', 'comments', 'posts', 'post', 'edit_post'];

	$.each(templates, function(index, tpl){
		if(index == 0){
			loadTemplate(tpl, [{}], '#home');
		}else{
			loadTemplate(tpl);
		}
	});
});
