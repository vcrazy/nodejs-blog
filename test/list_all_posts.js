var request = require('request'),
	assert = require('assert');

describe('REST API', function(){
    describe('GET /posts', function(){
        it('should respond with a list of posts', function(done){
            request('http://localhost:3000/posts', function(err, resp, body){
				assert(!err);
				body = JSON.parse(body);
                assert.equal(typeof body, 'object');
				assert(!body.error);
                done(); 
            }); 
        }); 
    });
});
