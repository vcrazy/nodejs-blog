var request = require('request'),
	assert = require('assert');

describe('REST API', function(){
    describe('DELETE /posts/:id', function(){
        it('should respond with an object {success: 1}', function(done){
            request({
				headers: {'content-type' : 'application/x-www-form-urlencoded'},
				url: 'http://localhost:3000/posts/50b2b028bbc0c4d41d000001',
				method: 'delete'
			}, function(err, resp, body){
				assert(!err);
				body = JSON.parse(body);
                assert(body.success == 1);
				assert(!body.error);
                done(); 
            }); 
        }); 
    });
});
