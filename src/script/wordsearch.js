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

function getDirection(text) {
  if (text === 'vertical') return { rowStep: 1, colStep: 0 };
  else if (text === 'diagonal up') return { rowStep: -1, colStep: 1 };
  else if (text === 'diagonal down') return { rowStep: 1, colStep: 1 };
  else return { rowStep: 0, colStep: 1 };
}

function insert(params) {
  params = deepCopy(params);
  params.direction = getDirection(params.direction);
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

module.exports = { blankPuzzle: blankPuzzle, deepCopy: deepCopy,
  randomLetter: randomLetter, resize: resize, getDirection: getDirection,
  insert: insert, fillRandom: fillRandom };
