var port = 3000,
	express = require('express'),
	app = express();

app.get('/posts', function(req, res){
    res.send([{name: 'post1'}, {name: 'post2..'}]);
});
app.get('/post/:id', function(req, res){
    res.send({id: req.params.id, name: "Name", description: "Desc"});
});

app.listen(port);
console.log('Listening on port ' + port + '...');
