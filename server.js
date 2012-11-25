var port = 3000,
	express = require('express'),
	blog = require('./routes/blog'),
	app = express(),
	http = require('http'),
    fs = require('fs');

// REST

// List all posts
app.get('/posts', function(req, res){
	blog.getAllPosts(req, res);
});

// List one post with its comments
app.get('/posts/:id', blog.getOnePost);

// Create post
app.post('/posts', blog.createPost);

// Update post
app.put('/posts/:id', blog.updatePost);

// Delete post
app.delete('/posts/:id', blog.deletePost);

// Comment post
app.post('/comments/:id', blog.createComment);

// Get /
app.get('/', function(req, res){
	fs.readFile('./index.html', function(err, html){
		res.writeHeader(200, {"Content-Type": "text/html"});
		res.write(html);
		res.end();
	});
});

// Get /scripts/:src
app.get('/scripts/:src', function(req, res){
	fs.readFile('./' + req.params.src, function(err, html){
		res.writeHeader(200, {"Content-Type": "text/javascript"});
		res.write(html);
		res.end();
	});
});

// END OF REST

// FUNCTIONS
function getPosts(req, res){
    res.send({name: 'Get all posts'});
};
// END OF FUNCTIONS

app.listen(port);
console.log('Listening on port ' + port + '...');
