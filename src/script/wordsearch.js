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

module.exports = { blankPuzzle: blankPuzzle, deepCopy: deepCopy,
  randomLetter: randomLetter, resize: resize };
