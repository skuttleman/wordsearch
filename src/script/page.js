var mainPuzzle, dragTrack = {}, minWordCount = 15, maxWordCount=50,
  menuDisplayed = false, modalCallback;

function drawGrid(grid) {
  $('.puzzle').remove();
  loadStub({ parent: '.puzzle-container', file: './stubs/puzzle.html',
    params: { puzzle: grid } });
}

function drawWordList(key) {
  $('.word-list').remove();
  loadStub({ parent: '.word-list-container', file: './stubs/word_list.html',
    params: { key: key } }, function() {
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

function hideMenu() {
  $('.menu-container').animate({ top: '-100vh' }, 400);
  menuDisplayed = false;
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
      menuPosition = '-100vh';
      $('.menu-container').animate({ top: '-100vh' }, 400, function() {
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
}

function isPuzzleFinished() {
  for (var i = 0; i < mainPuzzle.puzzle.key.length; i ++) {
    if (!mainPuzzle.puzzle.key[i].selected) return;
  }
  localStorage.clear();
  popUp('Congratulations! You finished this puzzle', showMenu);
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
  popUp(definition);
}
