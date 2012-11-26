var request = require('request'),
	assert = require('assert');

describe('REST API', function(){
    describe('POST /posts', function(){
        it('should respond with an object of the created post', function(done){
            request({
				headers: {'content-type' : 'application/x-www-form-urlencoded'},
				url: 'http://localhost:3000/posts',
				body: "text=test",
				method: 'post'
			}, function(err, resp, body){
				assert(!err);
				body = JSON.parse(body);
                assert(body._id && body.text);
				assert(!body.error);
                done(); 
            }); 
        }); 
    });
});
