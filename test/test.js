var wordsearch = require('../src/script/ws_creator.js'),
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

  var blankNine =
    [['-','-','-','-','-','-','-','-','-'],
     ['-','-','-','-','-','-','-','-','-'],
     ['-','-','-','-','-','-','-','-','-'],
     ['-','-','-','-','-','-','-','-','-'],
     ['-','-','-','-','-','-','-','-','-'],
     ['-','-','-','-','-','-','-','-','-'],
     ['-','-','-','-','-','-','-','-','-'],
     ['-','-','-','-','-','-','-','-','-'],
     ['-','-','-','-','-','-','-','-','-']];

	it('should make a blank puzzle of a given size', function() {
    expect(wordsearch.blankPuzzle(3, '-'))
      .deep.equal([['-','-','-'],['-','-','-'],['-','-','-']]);
    expect(wordsearch.blankPuzzle(10, '-'))
      .deep.equal(blankTen);
    expect(wordsearch.blankPuzzle(9, '-'))
      .deep.equal(blankNine);
	});

  it('should deep-copy objects and arrays', function() {
    var object1 = [1,2,[3,4],[5,6]];
    var object2 = { 0: 1, 11: 2, 2: { apple: 3, 1: 4 }, orange: [ 99, '16' ] };

    expect(wordsearch.deepCopy(object1)).to.deep.equal(object1);
    expect(wordsearch.deepCopy(object1)).to.not.equal(object1);
    expect(wordsearch.deepCopy(object2)).to.deep.equal(object2);
    expect(wordsearch.deepCopy(object2)).to.not.equal(object2);
  });

  it('return one random letter', function() {
    var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    expect(alpha.indexOf(wordsearch.randomLetter())).to.be.greaterThan(-1)
      .and.lessThan(26);
  });

  it('should resize grids if needed', function() {
    expect(wordsearch.resize(blankNine, 10, '-')).to.deep.equal(blankTen);
    expect(wordsearch.resize(blankNine, 9, '-')).to.deep.equal(blankNine);
    expect(wordsearch.resize(blankTen, 9, '-')).to.deep.equal(blankTen);
  });

  it('should translate direction into object', function() {
    expect(wordsearch.stepDirection('horizontal')).to.deep.equal({ rowStep: 0, colStep: 1 });
    expect(wordsearch.stepDirection('vertical')).to.deep.equal({ rowStep: 1, colStep: 0 });
    expect(wordsearch.stepDirection('diagonal up')).to.deep.equal({ rowStep: -1, colStep: 1 });
    expect(wordsearch.stepDirection('diagonal down')).to.deep.equal({ rowStep: 1, colStep: 1 });
  });

  it('should insert horizontal word starting at a given position', function() {
    expect(wordsearch.insertTry({ grid: blankNine, word: 'aardvark',
      start: { row: 0, col: 0}, direction: 'horizontal' }).grid)
      .to.deep.equal(
        [['A','A','R','D','V','A','R','K','-'],
         ['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-']]
      );

    expect(wordsearch.insertTry({ grid: blankTen, word: 'Children',
      start: { row: 3, col: 1}, direction: 'horizontal' }).grid)
      .to.deep.equal(
        [['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','C','H','I','L','D','R','E','N','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-']]
      );

    expect(wordsearch.insertTry({ grid: blankNine, word: 'TARGET',
      start: { row: 7, col: 2}, direction: { rowStep: 0, colStep: 1 } }).grid)
      .to.deep.equal(
        [['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-'],
         ['-','-','T','A','R','G','E','T','-'],
         ['-','-','-','-','-','-','-','-','-']]
      );

    expect(wordsearch.insertTry({ grid: blankTen, word: 'mOnKey',
      start: { row: 1, col: 4}, direction: 'horizontal' }).grid)
      .to.deep.equal(
        [['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','M','O','N','K','E','Y'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-']]
      );

    expect(wordsearch.insertTry({
      grid:
        [['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','K','-','-','-','-','-'],
         ['-','-','-','-','R','-','-','-','-'],
         ['-','-','-','-','-','O','-','-','-'],
         ['-','-','-','-','L','-','F','E','-'],
         ['-','-','N','A','I','L','-','V','-'],
         ['-','-','-','-','A','-','-','I','-'],
         ['-','-','-','-','R','-','-','L','-']],
      word: 'lIFe',
      start: { row: 5, col: 4}, direction: 'horizontal' }).grid)
      .to.deep.equal(
        [['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','K','-','-','-','-','-'],
         ['-','-','-','-','R','-','-','-','-'],
         ['-','-','-','-','-','O','-','-','-'],
         ['-','-','-','-','L','I','F','E','-'],
         ['-','-','N','A','I','L','-','V','-'],
         ['-','-','-','-','A','-','-','I','-'],
         ['-','-','-','-','R','-','-','L','-']]
      );

    expect(wordsearch.insertTry({
      grid:
        [['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','E','-','-','-','-','S','-','-'],
         ['-','-','L','-','-','-','-','C','-','-'],
         ['-','-','P','-','-','-','-','H','-','-'],
         ['-','-','P','-','-','-','-','O','-','-'],
         ['-','-','A','-','-','-','-','O','-','-'],
         ['-','-','-','-','-','-','-','L','-','-']],
      word: 'abanDON',
      start: { row: 8, col: 2}, direction: 'horizontal' }).grid)
      .to.deep.equal(
        [['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','E','-','-','-','-','S','-','-'],
         ['-','-','L','-','-','-','-','C','-','-'],
         ['-','-','P','-','-','-','-','H','-','-'],
         ['-','-','P','-','-','-','-','O','-','-'],
         ['-','-','A','B','A','N','D','O','N','-'],
         ['-','-','-','-','-','-','-','L','-','-']]
      );
  });

  it('should not insert horizontal word if there are conflicting letters',
    function() {
      expect(wordsearch.insertTry({
        grid:
          [['-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-'],
           ['-','-','C','E','L','L','A','R','-'],
           ['-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-']],
        word: 'door',
        start: { row: 5, col: 4}, direction: 'horizontal'
      })).to.equal(false);

      expect(wordsearch.insertTry({
        grid:
          [['-','-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-','-'],
           ['-','-','E','-','-','-','-','S','-','-'],
           ['-','-','L','-','-','-','-','C','-','-'],
           ['-','-','P','-','-','-','-','H','-','-'],
           ['-','-','P','-','-','-','-','O','-','-'],
           ['-','-','A','-','-','-','-','O','-','-'],
           ['-','-','-','-','-','-','-','L','-','-']],
        word: 'leap',
        start: { row: 5, col: 1}, direction: { rowStep: 0, colStep: 1 }
      })).to.equal(false);
    }
  );

  it('should not insert horizontal word if there is not enough room',
    function() {
      expect(wordsearch.insertTry({
        grid:
          [['-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-'],
           ['-','-','C','E','L','L','A','R','-'],
           ['-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-']],
        word: 'door',
        start: { row: 5, col: 4}, direction: 'horizontal'
      })).to.equal(false);

      expect(wordsearch.insertTry({
        grid:
          [['-','-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-','-'],
           ['-','-','E','-','-','-','-','S','-','-'],
           ['-','-','L','-','-','-','-','C','-','-'],
           ['-','-','P','-','-','-','-','H','-','-'],
           ['-','-','P','-','-','-','-','O','-','-'],
           ['-','-','A','-','-','-','-','O','-','-'],
           ['-','-','-','-','-','-','-','L','-','-']],
        word: 'leap',
        start: { row: 5, col: 1}, direction: 'horizontal'
      })).to.equal(false);
    }
  );

  it('should insert vertical word starting at a given position', function() {
    expect(wordsearch.insertTry({
      grid:
        [['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','E','-','-','-','-','S','-','-'],
         ['-','-','L','-','-','-','-','C','-','-'],
         ['-','-','P','-','-','-','-','H','-','-'],
         ['-','-','P','-','-','-','-','O','-','-'],
         ['-','-','A','-','-','-','-','O','-','-'],
         ['-','-','-','-','-','-','-','L','-','-']],
      word: 'epic',
      start: { row: 2, col: 6 }, direction: 'vertical' }).grid)
      .to.deep.equal(
        [['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','E','-','-','-'],
         ['-','-','-','-','-','-','P','-','-','-'],
         ['-','-','E','-','-','-','I','S','-','-'],
         ['-','-','L','-','-','-','C','C','-','-'],
         ['-','-','P','-','-','-','-','H','-','-'],
         ['-','-','P','-','-','-','-','O','-','-'],
         ['-','-','A','-','-','-','-','O','-','-'],
         ['-','-','-','-','-','-','-','L','-','-']]
      );
  });

  it('should not insert vertical word if there are conflicting letters',
    function() {
      expect(wordsearch.insertTry({
        grid:
          [['-','-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-','-'],
           ['-','-','-','-','-','-','-','-','-','-'],
           ['-','-','E','-','-','-','-','S','-','-'],
           ['-','-','L','-','-','-','-','C','-','-'],
           ['-','-','P','-','-','-','-','H','-','-'],
           ['-','-','P','-','-','-','-','O','-','-'],
           ['-','-','A','-','-','-','-','O','-','-'],
           ['-','-','-','-','-','-','-','L','-','-']],
        word: 'eel',
        start: { row: 4, col: 2 }, direction: 'vertical' }
      )).to.deep.equal(false);
    }
  );

  it('should insert diagonal word starting at a given position', function() {
    expect(wordsearch.insertTry({
      grid:
        [['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','E','-','-','-','-','S','-','-'],
         ['-','-','L','-','-','-','-','C','-','-'],
         ['-','-','P','-','-','-','-','H','-','-'],
         ['-','-','P','-','-','-','-','O','-','-'],
         ['-','-','A','-','-','-','-','O','-','-'],
         ['-','-','-','-','-','-','-','L','-','-']],
      word: 'gulf',
      start: { row: 3, col: 0}, direction: 'diagonal down' }).grid)
      .to.deep.equal(
        [['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['G','-','-','-','-','-','-','-','-','-'],
         ['-','U','E','-','-','-','-','S','-','-'],
         ['-','-','L','-','-','-','-','C','-','-'],
         ['-','-','P','F','-','-','-','H','-','-'],
         ['-','-','P','-','-','-','-','O','-','-'],
         ['-','-','A','-','-','-','-','O','-','-'],
         ['-','-','-','-','-','-','-','L','-','-']]
      );

    expect(wordsearch.insertTry({
      grid:
        [['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','E','-','-','-','-','S','-','-'],
         ['-','-','L','-','-','-','-','C','-','-'],
         ['-','-','P','-','-','-','-','H','-','-'],
         ['-','-','P','-','-','-','-','O','-','-'],
         ['-','-','A','-','-','-','-','O','-','-'],
         ['-','-','-','-','-','-','-','L','-','-']],
      word: 'Pascal',
      start: { row: 8, col: 4 }, direction: 'diagonal up' }).grid)
      .to.deep.equal(
        [['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','L'],
         ['-','-','E','-','-','-','-','S','A','-'],
         ['-','-','L','-','-','-','-','C','-','-'],
         ['-','-','P','-','-','-','S','H','-','-'],
         ['-','-','P','-','-','A','-','O','-','-'],
         ['-','-','A','-','P','-','-','O','-','-'],
         ['-','-','-','-','-','-','-','L','-','-']]
      );
  });

  it('should insert words backwards', function() {
    expect(wordsearch.insertTry({
      grid:
        [['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','E','-','-','-','-','S','-','-'],
         ['-','-','L','-','-','-','-','C','-','-'],
         ['-','-','P','-','-','-','-','H','-','-'],
         ['-','-','P','-','-','-','-','O','-','-'],
         ['-','-','A','-','-','-','-','O','-','-'],
         ['-','-','-','-','-','-','-','L','-','-']],
      word: 'epic',
      start: { row: 2, col: 6 }, direction: 'vertical', reverse: true }).grid)
      .to.deep.equal(
        [['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','C','-','-','-'],
         ['-','-','-','-','-','-','I','-','-','-'],
         ['-','-','E','-','-','-','P','S','-','-'],
         ['-','-','L','-','-','-','E','C','-','-'],
         ['-','-','P','-','-','-','-','H','-','-'],
         ['-','-','P','-','-','-','-','O','-','-'],
         ['-','-','A','-','-','-','-','O','-','-'],
         ['-','-','-','-','-','-','-','L','-','-']]
      );

    expect(wordsearch.insertTry({
      grid:
        [['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','K','-','-','-','-','-'],
         ['-','-','-','-','R','-','-','-','-'],
         ['-','-','-','-','-','O','-','-','-'],
         ['-','-','-','-','L','-','F','E','-'],
         ['-','-','N','A','I','L','-','V','-'],
         ['-','-','-','-','A','-','-','I','-'],
         ['-','-','-','-','R','-','-','L','-']],
      word: 'lIFe',
      start: { row: 5, col: 1}, direction: 'horizontal', reverse: true }).grid)
      .to.deep.equal(
        [['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','-','-','-','-','-','-'],
         ['-','-','-','K','-','-','-','-','-'],
         ['-','-','-','-','R','-','-','-','-'],
         ['-','-','-','-','-','O','-','-','-'],
         ['-','E','F','I','L','-','F','E','-'],
         ['-','-','N','A','I','L','-','V','-'],
         ['-','-','-','-','A','-','-','I','-'],
         ['-','-','-','-','R','-','-','L','-']]
      );
  });

  it('fschool ill in a partial puzzle with random letters', function() {
    var ret = wordsearch.fillRandom(blankNine), isFilled = true, i, j;
    for (i = 0; i < ret.length; i ++) {
      for (j = 0; j < ret[i].length; j ++) {
        if (ret[i][j] === '-') isFilled = false;
      }
    }
    expect(isFilled).to.equal(true);

    ret = wordsearch.fillRandom(blankTen);
    isFilled = true;
    for (i = 0; i < ret.length; i ++) {
      for (j = 0; j < ret[i].length; j ++) {
        if (ret[i][j] === '-') isFilled = false;
      }
    }
    expect(isFilled).to.equal(true);
  });

  it('should make an array of integers from', function() {
    expect(wordsearch.range(0, 1)).to.deep.equal([0]);
    expect(wordsearch.range(-1, 13)).to.deep.equal([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(wordsearch.range(10, 20, false)).to.deep.equal([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);

    expect(wordsearch.range(0, 1, true)).to.deep.equal([0, 1]);
    expect(wordsearch.range(-1, 13, true)).to.deep.equal([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    expect(wordsearch.range(10, 20, true)).to.deep.equal([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  });

  it('should create combinations of arrays into row, col pairs', function() {
    expect(wordsearch.combinationRanges([0, 1], [2, 3], 'diagonal up')).to
      .deep.equal(
        [{ row: 0, col: 2, direction: 'diagonal up' },
        { row: 0, col: 3, direction: 'diagonal up' },
        { row: 1, col: 2, direction: 'diagonal up' },
        { row: 1, col: 3, direction: 'diagonal up' }
      ]
    );

    expect(wordsearch.combinationRanges([0, 1, 2, 3, 4], [5, 6, 7],
      'horizontal')).to.deep.equal(
        [{ row: 0, col: 5, direction: 'horizontal' },
        { row: 0, col: 6, direction: 'horizontal' },
        { row: 0, col: 7, direction: 'horizontal' },
        { row: 1, col: 5, direction: 'horizontal' },
        { row: 1, col: 6, direction: 'horizontal' },
        { row: 1, col: 7, direction: 'horizontal' },
        { row: 2, col: 5, direction: 'horizontal' },
        { row: 2, col: 6, direction: 'horizontal' },
        { row: 2, col: 7, direction: 'horizontal' },
        { row: 3, col: 5, direction: 'horizontal' },
        { row: 3, col: 6, direction: 'horizontal' },
        { row: 3, col: 7, direction: 'horizontal' },
        { row: 4, col: 5, direction: 'horizontal' },
        { row: 4, col: 6, direction: 'horizontal' },
        { row: 4, col: 7, direction: 'horizontal' }
      ]
    );
  });

  it('should create combinations of arrays into row, col pairs', function() {
    expect(wordsearch.getMatrix(blankTen, 'palacial', 'diagonal down')).to
      .deep.equal(
        [{ row: 0, col: 0, direction: 'diagonal down' },
        { row: 0, col: 1, direction: 'diagonal down' },
        { row: 0, col: 2, direction: 'diagonal down' },
        { row: 1, col: 0, direction: 'diagonal down' },
        { row: 1, col: 1, direction: 'diagonal down' },
        { row: 1, col: 2, direction: 'diagonal down' },
        { row: 2, col: 0, direction: 'diagonal down' },
        { row: 2, col: 1, direction: 'diagonal down' },
        { row: 2, col: 2, direction: 'diagonal down' }
      ]
    );

    expect(wordsearch.getMatrix(blankNine, 'rabbits', 'horizontal')).to
      .deep.equal(
        [{ row: 0, col: 0, direction: 'horizontal' },
        { row: 0, col: 1, direction: 'horizontal' },
        { row: 0, col: 2, direction: 'horizontal' },
        { row: 1, col: 0, direction: 'horizontal' },
        { row: 1, col: 1, direction: 'horizontal' },
        { row: 1, col: 2, direction: 'horizontal' },
        { row: 2, col: 0, direction: 'horizontal' },
        { row: 2, col: 1, direction: 'horizontal' },
        { row: 2, col: 2, direction: 'horizontal' },
        { row: 3, col: 0, direction: 'horizontal' },
        { row: 3, col: 1, direction: 'horizontal' },
        { row: 3, col: 2, direction: 'horizontal' },
        { row: 4, col: 0, direction: 'horizontal' },
        { row: 4, col: 1, direction: 'horizontal' },
        { row: 4, col: 2, direction: 'horizontal' },
        { row: 5, col: 0, direction: 'horizontal' },
        { row: 5, col: 1, direction: 'horizontal' },
        { row: 5, col: 2, direction: 'horizontal' },
        { row: 6, col: 0, direction: 'horizontal' },
        { row: 6, col: 1, direction: 'horizontal' },
        { row: 6, col: 2, direction: 'horizontal' },
        { row: 7, col: 0, direction: 'horizontal' },
        { row: 7, col: 1, direction: 'horizontal' },
        { row: 7, col: 2, direction: 'horizontal' },
        { row: 8, col: 0, direction: 'horizontal' },
        { row: 8, col: 1, direction: 'horizontal' },
        { row: 8, col: 2, direction: 'horizontal' }
      ]
    );

    expect(wordsearch.getMatrix(blankTen, 'charboiled', 'vertical')).to
      .deep.equal(
        [{ row: 0, col: 0, direction: 'vertical' },
        { row: 0, col: 1, direction: 'vertical' },
        { row: 0, col: 2, direction: 'vertical' },
        { row: 0, col: 3, direction: 'vertical' },
        { row: 0, col: 4, direction: 'vertical' },
        { row: 0, col: 5, direction: 'vertical' },
        { row: 0, col: 6, direction: 'vertical' },
        { row: 0, col: 7, direction: 'vertical' },
        { row: 0, col: 8, direction: 'vertical' },
        { row: 0, col: 9, direction: 'vertical' }
      ]
    );
  });

  it('should create combinations of arrays into row, col pairs', function() {
    expect(wordsearch.concatMatrices(blankNine, 'palacial', ['diagonal up',
    'diagonal down'])).to.deep.equal(
        [{ row: 7, col: 0, direction: 'diagonal up' },
        { row: 7, col: 1, direction: 'diagonal up' },
        { row: 8, col: 0, direction: 'diagonal up' },
        { row: 8, col: 1, direction: 'diagonal up' },
        { row: 0, col: 0, direction: 'diagonal down' },
        { row: 0, col: 1, direction: 'diagonal down' },
        { row: 1, col: 0, direction: 'diagonal down' },
        { row: 1, col: 1, direction: 'diagonal down' }
      ]
    );
  });

  // xit('should fail', function() {
  //   expect(true).to.equal(false);
  // });
});
