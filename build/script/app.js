function WordSearch(params) {
  this.numWords = params.numWords;
  this.directions = params.directions;
  this.reversable = params.reversable;
  this.definitions = [];
  this.callBack = params.callBack;

  this.getWords();
}

WordSearch.prototype.addDefinition = function(word, definition) {
  for (var i = 0; i < this.definitions.length; i ++) {
    if (this.definitions[i].word === word) {
      this.definitions[i].definition = definition;
      i = this.definitions.length;
    }
  }
  //this.definitions.push({ word: word, definition: definition });
  // if (this.definitions.length === this.numWords) this.newPuzzle();
};

function drill(data) {
  for (var i = 0; i < (data.results || []).length; i ++) {
    var result = data.results[i];
    for (var j = 0; j < (result.senses || []).length; j ++) {
      var sense = result.senses[j];
      for (var k = 0; k < (sense.definition || []).length; j ++) {
        var definition = sense.definition[k];
        if (definition) return definition;
      }
    }
  }
}

WordSearch.prototype.getDefinition = function(word) {
  var self = this, data = {};
  // $.get('https://api.pearson.com:443/v2/dictionaries/ldoce5/entries?headword=' +
  //   word, function(data) {
      var definition = drill(data) || 'no definition found';
      self.addDefinition(word, definition);
  //   }
  // );
};

WordSearch.prototype.whatIsDefinition = function(word) {
  for (var i = 0; i < this.definitions.length; i ++) {
    if (word === this.definitions[i].word) {
      return this.definitions[i].definition || 'definition look-up in progress...';
    }
  }
  return 'broken';
}

WordSearch.prototype.newPuzzle = function() {
  this.puzzle = makePuzzle({ directions: this.directions,
    reversable: this.reversable,
    words: this.definitions.map(function(element) { return element.word; })
  });
  for (var i = 0; i < this.puzzle.key.length; i ++) {
    for (var j = 0; j < this.definitions.length; j ++) {
      if (this.definitions[j].word === this.puzzle.key[i].word) {
        this.puzzle.key[i].definition = this.definitions[j].definition;
        j = this.definitions.length;
      }
    }
  }
  this.callBack(this.puzzle);
};

WordSearch.prototype.getWords = function() {
  var ajax = new XMLHttpRequest();
  var self = this;
  ajax.onreadystatechange = function() {
    if (this.status === 200 && this.readyState === 4) {
      var wordList = JSON.parse(this.responseText).words, ret = [];
      while (ret.length < self.numWords) {
        var random = Math.floor(Math.random() * wordList.length);
        if (ret.indexOf(wordList[random]) === -1) {
          ret.push(wordList[random]);
          self.definitions.push({ word: wordList[random] });
          self.getDefinition(wordList[random]);
          if (ret.length === self.numWords) self.newPuzzle();
        }
      }
    }
  };
  ajax.open('GET', '/words.json');
  ajax.send();
};

var mainPuzzle, dragTrack = {}, minWordCount = 10, maxWordCount = 50,
  menuDisplayed = false, modalCallback;

function drawGrid(grid) {
  $('.puzzle').remove();
  loadStub({ parent: '.puzzle-container', file: './stubs/puzzle.html',
    params: { puzzle: grid } });
}

function drawWordList(key) {
  $('.word-list').remove();
  var newKey = deepCopy(key);
  newKey.sort(function(key1, key2) { return key2.word < key1.word; });
  loadStub({ parent: '.word-list-container', file: './stubs/word_list.html',
    params: { key: newKey } }, function() {
      $('.words').click(showDefinition);
      for (var i = 0; i < key.length; i ++) {
        if (key[i].selected) {
          highlightCells({ vector: key[i], mode: 'add',
            classes: ['selected'] });
        }
      }
    }
  );
}

function drawPuzzle(puzzle) {
  drawGrid(puzzle.grid);
  drawWordList(deepCopy(puzzle.key).sort());
  saveLocal();
}

function getPuzzleRowCol(x, y) {
  var $puzzle = $('.puzzle');
  var $puzzleCorner = $('.puzzle-cell--0-0');
  var row = Math.floor(((y - $puzzleCorner.position().top) /
    ($puzzleCorner.height() * mainPuzzle.puzzle.grid.length)) *
    mainPuzzle.puzzle.grid.length);
  var col = Math.floor(((x - $puzzleCorner.position().left) /
    ($puzzleCorner.height() * mainPuzzle.puzzle.grid.length)) *
    mainPuzzle.puzzle.grid.length);
  return { row: row, col: col };
}

function loadStub(params, callback) {
  if (params.html) {
    var html = Handlebars.compile(params.html);
    $(params.parent).append(html(params.params));
    if (callback) callback();
  } else {
    $.get(params.file, function(data) {
      loadStub({ html: data, parent: params.parent,
        params: params.params, blowout: params.blowout
      }, callback);
    });
  }
  fitPuzzle();
}

function hideMenu(callback) {
  $('.menu-container').animate({ top: '-100vh' }, 400, callback);
  menuDisplayed = false;
  $('.cheering').remove();
}

function showMenu() {
  $('.menu-container').animate({ top: '50px' }, 400);
  menuDisplayed = true;
}

$(function() {
  $('.menu-button').click(function(event) {
    event.preventDefault();
    if (menuDisplayed) window.hideMenu();
    else window.showMenu();
  });

  $('.diagonal')[0].checked = localStorage.diagonal === 'true' ? true : false;
  $('.backwards')[0].checked = localStorage.backwards === 'true' ? true : false;
  $('.num-words').val(localStorage['num-words'] || '15');
  var load = localStorage.wordsearch;
  if (load) {
    mainPuzzle = JSON.parse(load);
    drawPuzzle(mainPuzzle.puzzle);
  } else {
    $('.menu-button').click();
  }

  $('.puzzle-container').on('mousedown touchstart', puzzleDown)
    .on('mousemove touchmove', puzzleDrag).on('mouseup touchend', puzzleUp);

  $('.submit-form').click(function(event) {
    event.preventDefault();
    var diagonal = $('.diagonal').is(':checked') ?
      ['diagonal up', 'diagonal down'] : [];
    var directions = ['horizontal', 'vertical'].concat(diagonal);
    var reversable = $('.backwards').is(':checked');
    var numWords = parseInt($('.num-words').val());

    if (isNaN(numWords) || numWords < minWordCount || numWords > maxWordCount) {
      popUp('The number of words must be a number between ' + minWordCount +
      ' and ' + maxWordCount + '!');
    } else {
      $('.puzzle-container').html('<p class="puzzle">Loading new puzzle...</p>');
      hideMenu(function() {
        mainPuzzle = new WordSearch({ directions: directions, numWords: numWords,
          reversable: reversable, callBack: drawPuzzle
        });
      });
    }
  });

  $('.puzzle-options').on('keypress', function(event){
    if (event.keyCode === 13) event.preventDefault();
    $('.submit-form')[0].click();
  });

  $('.modal-button').on('click', function(event) {
    event.preventDefault();
    $('.modal-container').hide();
    if (modalCallback) modalCallback();
    modalCallback = null;
  });
});

function fitPuzzle() {
  if (mainPuzzle) {
    var cellFontSize = $('.puzzle-cell').css('font-size');
    $('.word-list-container h2').css('font-size', 'calc(1 * ' +
      cellFontSize + ')');
    $('.word-list-container li').css('font-size', 'calc(0.7 * ' +
      cellFontSize + ')');

  }
}
window.onresize = fitPuzzle;

$(document).on('mouseup touchend', function(event) {
  highlightCells({ classes: ['selecting'], mode: 'clear' });
  dragTrack = {};
});

function chomp(event) {
  var start = Array.prototype.filter.call(event.target.classList, function(element) {
    return element.indexOf('--') + 1;
  })[0];
  if (start) {
    var coordinates = start.split('--')[1].split('-');
    return coordinates.length === 2 ? { row: parseInt(coordinates[0]),
      col: parseInt(coordinates[1]) } : {};
  }
}

function puzzleDown(event) {
  event.preventDefault();
  dragTrack = {};
  dragTrack.start = chomp(event);
  // getPuzzleRowCol(event.pageX, event.pageY);
}

function puzzleDrag(event) {
  event.preventDefault();
  if (dragTrack && dragTrack.start) {
    // dragTrack.end = getPuzzleRowCol(event.pageX, event.pageY);

    dragTrack.end = event.originalEvent.touches ?
      getPuzzleRowCol(event.originalEvent.touches[0].pageX,
      event.originalEvent.touches[0].pageY) : chomp(event);
    // console.log(coordinates)
      // console.log(coordinates)
      // console.log(event.pageX, event.pageY); // 27 41

    // console.log(coordinates)
    highlightCells({ classes: ['selecting'], mode: 'clear' });
    dragTrack = highlightCells({ vector: dragTrack, classes: ['selecting'],
      mode: 'add' });
  }
}

function puzzleUp(event){
  event.preventDefault();
  if (dragTrack && dragTrack.start && dragTrack.end) {
    var key = mainPuzzle.puzzle.key;
    for (var i = 0; i < key.length; i ++) {
      if (key[i].start.row === dragTrack.start.row && key[i].start.col ===
        dragTrack.start.col && key[i].end.row === dragTrack.end.row &&
        key[i].end.col === dragTrack.end.col && !key[i].selected) {
          // Selected word in puzzle
          key[i].selected = true;
          $('.' + key[i].word).addClass('found');
          makeCellList(dragTrack)
          saveLocal();
          // console.log(key[i].word);
          highlightCells({ vector: dragTrack, classes: ['selected'],
            mode: 'add' });
          i = key.length;
          isPuzzleFinished();
      }
    }
  }
}

function highlightCells(params) {
  if (params.mode === 'clear') {
    for (var i = 0; i < params.classes.length; i ++) {
      $('.puzzle-cell').removeClass(params.classes[i]);
    }
  } else {
    var cellList = makeCellList(params.vector);
    if (cellList) {
      if (cellList.length === 0) return {};
      var ret = { start: {}, end: {} };
      ret.start.row = cellList[0][0];
      ret.start.col = cellList[0][1];
      ret.end.row = cellList[cellList.length - 1][0];
      ret.end.col = cellList[cellList.length - 1][1];
      for (i = 0; i < params.classes.length; i ++) {
        for (var j = 0; j < cellList.length; j ++) {
          var row = cellList[j][0];
          var col = cellList[j][1];
          if (params.mode === 'add') {
            $('.puzzle-cell--' + row + '-' + col).addClass(params.classes[i]);
          } else {
            $('.puzzle-cell--' + row + '-' + col).removeClass(params.classes[i]);
          }
        }
      }
    }
    return ret;
  }
}

function makeCellList(vector) {
  function ltetgt(a, b) {
    if (a > b) return -1;
    else if (a === b) return 0;
    else return 1;
  }
  if (!vector.start || !vector.end) return;
  var verticalDist = Math.abs(Math.abs(vector.start.row) -
    Math.abs(vector.end.row));
  var horizontalDist = Math.abs(Math.abs(vector.start.col) -
    Math.abs(vector.end.col));
  var wordLength = Math.max(verticalDist, horizontalDist) + 1;
  var verticalStep = (verticalDist < horizontalDist / 2) ? 0 : 1;
  var horizontalStep = (horizontalDist < verticalDist / 2) ? 0 : 1;
  verticalStep *= ltetgt(vector.start.row, vector.end.row);
  horizontalStep *= ltetgt(vector.start.col, vector.end.col);
  // console.log(verticalStep, horizontalStep, wordLength);
  var ret = [], start = deepCopy(vector.start);
  for (var i = 0; i < wordLength; i ++) {
    ret.push([start.row, start.col]);
    start.row += verticalStep;
    start.col += horizontalStep;
  }
  return ret;
}

function saveLocal() {
  localStorage.wordsearch = JSON.stringify(mainPuzzle);
  localStorage.diagonal = $('.diagonal')[0].checked;
  localStorage.backwards = $('.backwards')[0].checked;
  localStorage['num-words'] = $('.num-words').val();
}

function isPuzzleFinished() {
  for (var i = 0; i < mainPuzzle.puzzle.key.length; i ++) {
    if (!mainPuzzle.puzzle.key[i].selected) return;
  }
  localStorage.wordsearch = '';
  $('.main').append('<audio autoplay="autoplay" class="cheering nevershown">' +
    '<source src="./sounds/cheering.mp3" type="audio/mpeg" /></audio>');
  popUp('Congratulations! You finished this puzzle!', showMenu);
}

function popUp(message, callback) {
  $('.modal-message').html(message);
  $('.modal-container').show();
  $('.modal-button').focus();
  modalCallback = callback;
}

function showDefinition(event) {
  var word = event.target.innerText;
  var definition = WordSearch.prototype.whatIsDefinition.call(mainPuzzle, word);
  popUp(word + ': ' + definition);
}

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
  var direction = stepDirection(params.direction);
  var point1 = deepCopy(params.start);
  var point2 = {
    row: point1.row + (direction.rowStep * (params.word.length - 1)),
    col: point1.col + (direction.colStep * (params.word.length - 1))
  };
  var key = { start: (params.reverse) ? point2 : point1,
    end: (params.reverse) ? point1 : point2,
    word: params.word, reverse: !!params.reverse };

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
    if (randomize) ret = ret.concat(getMatrix(grid, word, directions[i]).randomize());
    else ret = ret.concat(getMatrix(grid, word, directions[i]));
  }
  return ret;
}

Array.prototype.randomize = function() {
  this.sort(function() {
    return Math.floor(Math.random() * 2) ? -1 : 1;
  });
  return this;
}

Array.prototype.shuffle = function() {
  this.push(this.shift());
  return this;
}

function addWord(params) {
  var success = false, ret = params.grid;
  while (!success) {
    ret = resize(ret, params.word.length + 1, '-');
    var matrix = concatMatrices(ret, params.word, params.directions.shuffle(), true);
    for (var i = 0; i < matrix.length; i ++) {
      var temp = insert({
        start: { row: matrix[i].row, col: matrix[i].col },
        direction: matrix[i].direction, word: params.word, grid: ret,
        reverse: (params.reversable) ? Math.floor(Math.random() * 2.2) : false
      });
      if (temp) {
        success = true;
        ret = temp.grid;
        i = matrix.length;
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



var module = module || {};
module.exports = { blankPuzzle: blankPuzzle, deepCopy: deepCopy,
  randomLetter: randomLetter, resize: resize, stepDirection: stepDirection,
  insert: insert, fillRandom: fillRandom, range: range,
  combinationRanges: combinationRanges, concatMatrices: concatMatrices,
  getMatrix: getMatrix };
