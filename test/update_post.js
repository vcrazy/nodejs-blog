var request = require('request'),
	assert = require('assert');

describe('REST API', function(){
    describe('PUT /posts/:id', function(){
        it('should respond with an object {success: 1}', function(done){
            request({
				headers: {'content-type' : 'application/x-www-form-urlencoded'},
				url: 'http://localhost:3000/posts/50b2adc4dd23a01c14000002',
				body: "text=new_text",
				method: 'put'
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
