var request = require('request'),
	assert = require('assert');

describe('REST API', function(){
    describe('DELETE /comments/:id', function(){
        it('should respond with an object {success: 1}', function(done){
            request({
				headers: {'content-type' : 'application/x-www-form-urlencoded'},
				url: 'http://localhost:3000/comments/50b2aeb1dd23a01c14000006',
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
