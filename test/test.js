var main = require('../src/script/main.js'),
  expect = require('chai').expect;

describe('Test Suite for: wordsearch', function(){
	it('should be configured to write tests', function() {
    expect(main.add(1, 2)).to.equal(3);
	});
});
