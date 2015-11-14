var main = require('../src/script/main.js'),
  expect = require('chai').expect;

describe('Test Suite for: wordsearch', function() {
  var blankTen =
    [['-','-','-','-','-','-','-','-','-','-'],
     ['-','-','-','-','-','-','-','-','-','-'],
     ['-','-','-','-','-','-','-','-','-','-'],
     ['-','-','-','-','-','-','-','-','-','-'],
     ['-','-','-','-','-','-','-','-','-','-'],
     ['-','-','-','-','-','-','-','-','-','-'],
     ['-','-','-','-','-','-','-','-','-','-'],
     ['-','-','-','-','-','-','-','-','-','-'],
     ['-','-','-','-','-','-','-','-','-','-'],
     ['-','-','-','-','-','-','-','-','-','-']];

	it('should make a blank puzzle of a given size', function() {
    expect(main.blankPuzzle(3, 3, '-'))
      .deep.equal([['-','-','-'],['-','-','-'],['-','-','-']]);
    expect(main.blankPuzzle(10, 10, '-'))
      .deep.equal(blankTen);
	});

  it('should deep-copy objects and arrays', function() {
    var object1 = [1,2,[3,4],[5,6]];
    var object3 = { 0: 1, 11: 2, 2: { apple: 3, 1: 4 }, orange: [ 5, 6 ] };

    expect(main.deepCopy(object1)).to.deep.equal(object1);
    expect(main.deepCopy(object1)).to.not.equal(object1);
    expect(main.deepCopy(object2)).to.deep.equal(object2);
    expect(main.deepCopy(object2)).to.not.equal(object2);
  });

  it('return one random letter', function() {
    var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    expect(alpha.indexOf(main.randomLetter())).to.be.greaterThan(-1).and.lessThan(26);
  });

  it('should resize grids if needed', function() {
    expect(main.resize(blankNine, 10)).to.deep.equal(blankTen);
    expect(main.resize(blankNine, 9)).to.deep.equal(blankNine);
    expect(main.resize(blankTen, 9)).to.deep.equal(blankTen);
  });

  it('should insert horizontal word starting at a given position', function() {

  });

  it('should not insert horizontal word if there are conflicting letters', function() {

  });

  it('should insert vertical word starting at a given position', function() {

  });

  it('should not insert vertical word if there are conflicting letters', function() {

  });

  it('should insert diagonal word starting at a given position', function() {

  });

  it('should not insert diagonal word if there are conflicting letters', function() {

  });

  it('should insert words backwards', function() {

  });

  it('should return true if it successfully inserts word', function() {

  });

  it('should return false if it cannot insert a word', function() {

  });

  it('fill in a partial puzzle with random letters', function() {

  });

  it('should pass', function() {
    expect(true).to.equal(true);
  });
});
