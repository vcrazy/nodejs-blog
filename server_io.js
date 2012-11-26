var port = 3001,
	express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	io = require('socket.io').listen(server);

server.listen(port);

app.get('/', function (req, res){
	res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket){
	socket.on('comment.created', function(data){
		socket.broadcast.emit('comment.created', data);
	});

	socket.on('comment.deleted', function(id){
		socket.broadcast.emit('comment.deleted', id);
	});

	socket.on('post.created', function(data){
		socket.broadcast.emit('post.created', data);
	});

	socket.on('post.deleted', function(id){
		socket.broadcast.emit('post.deleted', id);
	});

	socket.on('post.updated', function(data){
		socket.broadcast.emit('post.updated', data);
	});
});
