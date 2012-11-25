var port = 3000,
	express = require('express'),
	blog = require('./routes/blog'),
	app = express();

// REST
// 
// List all posts
app.get('/posts', blog.getAllPosts);

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

// END OF REST

// FUNCTIONS
function getPosts(req, res){
    res.send({name: 'Get all posts'});
};
// END OF FUNCTIONS

app.listen(port);
console.log('Listening on port ' + port + '...');
