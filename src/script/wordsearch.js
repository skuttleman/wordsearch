var testWords = ['apple', 'pear', 'banana', 'other fruit', 'zebra',
  'cornacopia', 'razzle-dazzle', 'jumble', 'plankton', 'draught',
  'carnivore', 'pheasant', 'test', 'data', 'fiber', 'soylent',
  'sunflower', 'carbohydrate', 'fifth', 'constitution', 'metabolism',
  'beets', 'oil', 'biohazard', 'natural', 'protein', 'improvement',
  'profile', 'powder', 'rice', 'building', 'view', 'concert'];

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

function deepCopy(obj) {
  var ret = (obj instanceof Array) ? [] : {};
  for (var i in obj) {
    if (typeof obj[i] === 'object') ret[i] = deepCopy(obj[i]);
    else ret[i] = obj[i];
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

function insert(params) {
  params = deepCopy(params);
  params.direction = stepDirection(params.direction);
  for (var i = 0; i < params.word.length; i ++) {
    var space = params.grid[params.start.row][params.start.col];
    var letter = (params.reverse) ?
      params.word[params.word.length - (i + 1)].toUpperCase() :
      params.word[i].toUpperCase();
    if (space === '-') params.grid[params.start.row][params.start.col] = letter;
    else if (space !== letter) return false;

    params.start.row += params.direction.rowStep;
    params.start.col += params.direction.colStep;
  }
  return params.grid;
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

function concatMatrices(grid, word, directions) {
  var ret = [];
  for (var i = 0; i < directions.length; i ++) {
    ret = ret.concat(getMatrix(grid, word, directions[i]));
  }
  return ret;
}



module.exports = { blankPuzzle: blankPuzzle, deepCopy: deepCopy,
  randomLetter: randomLetter, resize: resize, stepDirection: stepDirection,
  insert: insert, fillRandom: fillRandom, range: range,
  combinationRanges: combinationRanges, concatMatrices: concatMatrices,
  getMatrix: getMatrix };
