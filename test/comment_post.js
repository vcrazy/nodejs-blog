var request = require('request'),
	assert = require('assert');

describe('REST API', function(){
    describe('POST /comments/:id', function(){
        it('should respond with an object of the created comment', function(done){
            request({
				headers: {'content-type' : 'application/x-www-form-urlencoded'},
				url: 'http://localhost:3000/comments/50b2aeb1dd23a01c14000006',
				body: "text=test_comment",
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
