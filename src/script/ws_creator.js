function blankPuzzle(size, fill) {
  var ret = [];
  for (var i = 0; i < size; i ++) {
    var newline = [];
    for (var j = 0; j < size; j ++) {
      newline.push(fill);
    }
    ret.push(newline.slice());
  }
  return ret;
}

function randomLetter() {
  var letter = Math.floor(Math.random() * 26);
  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[letter];
}

function resize(grid, minSize, fill) {
  var ret = deepCopy(grid);
  while (ret.length < minSize) ret.push([]);
  for (var i = 0; i < ret.length; i ++) {
    while (ret[i].length < minSize) ret[i].push(fill);
  }
  return ret;
}

function stepDirection(text) {
  if (text === 'vertical') return { rowStep: 1, colStep: 0 };
  else if (text === 'diagonal up') return { rowStep: -1, colStep: 1 };
  else if (text === 'diagonal down') return { rowStep: 1, colStep: 1 };
  else return { rowStep: 0, colStep: 1 };
}

function makeKey(start, direction, word, reverse) {
  var p1 = deepCopy(start);
  var p2 = {
    row: p1.row + (direction.rowStep * (word.length - 1)),
    col: p1.col + (direction.colStep * (word.length - 1))
  };
  var start = reverse ? p2: p1;
  var end = reverse ? p1: p2;
  return { start: start, end: end, word: word, reverse: !!reverse };
}

function insertTry(params) {
  params = deepCopy(params);
  var direction = stepDirection(params.direction);
  var key = makeKey(params.start, direction, params.word, params.reverse);

  for (var i = 0; i < params.word.length; i ++) {
    var space = params.grid[params.start.row][params.start.col];
    var letter = (params.reverse) ?
      params.word[params.word.length - (i + 1)].toUpperCase() :
      params.word[i].toUpperCase();
    if (space === '-') params.grid[params.start.row][params.start.col] = letter;
    else if (space !== letter) return false;
    params.start.row += direction.rowStep;
    params.start.col += direction.colStep;
  }
  return { grid: params.grid, key: key };
}

function fillRandom(grid) {
  var ret = deepCopy(grid);
  for (var i = 0; i < ret.length; i ++) {
    for (var j = 0; j < ret[i].length; j ++) {
      if (ret[i][j] === '-') ret[i][j] = randomLetter();
    }
  }
  return ret;
}

function range(start, end, inclusive) {
  var ret = [];
  for (var i = start; i < end + (Number(inclusive) || 0); i ++) {
    ret.push(i);
  }
  return ret;
}

function combinationRanges(rows, cols, direction) {
  var ret = [];
  for (var i = 0; i < rows.length; i ++) {
    for (var j = 0; j < cols.length; j ++) {
      ret.push({ row: rows[i], col: cols[j], direction: direction });
    }
  }
  return ret;
}

function getMatrix(grid, word, direction) {
  var minRow = (direction === 'diagonal up') ?
    word.length - 1 : 0;
  var minCol = 0;
  var maxRow = (direction === 'horizontal' || direction === 'diagonal up') ?
    grid.length - 1: grid.length - word.length;
  var maxCol = (direction === 'vertical') ?
    grid.length - 1 : grid.length - word.length;
  return combinationRanges(
    range(minRow, maxRow, true), range(minCol, maxCol, true), direction
  );
}

function concatMatrices(grid, word, directions, randomize) {
  var ret = [];
  for (var i = 0; i < directions.length; i ++) {
    if (randomize) {
      ret = ret.concat(getMatrix(grid, word, directions[i]).randomize());
    } else {
      ret = ret.concat(getMatrix(grid, word, directions[i]));
    }
  }
  return ret;
}

function addWord(params) {
  var success = false, ret = params.grid;
  while (!success) {
    ret = resize(ret, params.word.length + 1, '-');
    var matrix =
      concatMatrices(ret, params.word, params.directions.shuffle(), true);
    for (var i = 0; i < matrix.length; i ++) {
      var temp = insertTry({
        start: { row: matrix[i].row, col: matrix[i].col },
        direction: matrix[i].direction, word: params.word, grid: ret,
        reverse: (params.reversable) ? Math.floor(Math.random() * 2.2) : false
      });
      if (temp) {
        success = true, ret = temp.grid, i = matrix.length;
        params.key.push(temp.key);
      }
    }
    if (!success) ret = resize(ret, ret.length + 1, '-');
  }
  return { grid: ret, key: params.key };
}

function makePuzzle(params) {
  var words = params.words.sort(function(word1, word2) {
    return word2.length - word1.length;
  });
  var ret = {};
  params.directions.sort();
  for (var i = 0; i < words.length; i ++) {
    ret = addWord({ grid: ret.grid || [], key: ret.key || [],
      directions: params.directions, word: words[i],
      reversable: params.reversable
    });
  }
  return { grid: fillRandom(ret.grid), key: ret.key };
}

function deepCopy(obj) {
  var ret = (obj instanceof Array) ? [] : {};
  for (var i in obj) {
    if (typeof obj[i] === 'object') ret[i] = deepCopy(obj[i]);
    else ret[i] = obj[i];
  }
  return ret;
}

var module = module || {};
module.exports = { blankPuzzle: blankPuzzle, randomLetter: randomLetter,
  resize: resize, stepDirection: stepDirection, insertTry: insertTry,
  fillRandom: fillRandom, range: range, combinationRanges: combinationRanges,
  concatMatrices: concatMatrices, getMatrix: getMatrix, deepCopy: deepCopy };
