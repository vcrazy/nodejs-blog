var port = 3000,
	express = require('express'),
	app = express();

// REST
// List all posts
app.get('/posts', function(req, res){
    res.send({name: 'Get all posts'});
});

// List one post with its comments
app.get('/posts/:id', function(req, res){
    res.send({name: 'Get post'});
});

// Create post
app.post('/posts', function(req, res){
	res.send({name: 'Create post'});
});

// Update post
app.put('/posts/:id', function(req, res){
	res.send({name: 'Update post'});
});

// Delete post
app.delete('/posts/:id', function(req, res){
	res.send({name: 'Delete post'});
});

// Comment post
app.post('/comments/:id', function(req, res){
	res.send({name: 'Comment post'});
});
// END OF REST

app.listen(port);
console.log('Listening on port ' + port + '...');
