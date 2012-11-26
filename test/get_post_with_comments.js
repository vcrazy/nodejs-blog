var request = require('request'),
	assert = require('assert');

describe('REST API', function(){
    describe('GET /posts/:id', function(){
        it('should respond with an object {post: {..}, comments: [{},..]}', function(done){
            request('http://localhost:3000/posts/50b2addadd23a01c14000004', function(err, resp, body){
				assert(!err);
				body = JSON.parse(body);
                assert(body.comments);
				assert(!body.error);
                done(); 
            }); 
        }); 
    });
});
