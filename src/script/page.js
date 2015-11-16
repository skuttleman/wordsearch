var mainPuzzle, dragTrack = {};

function drawGrid(grid) {
  var $location = $('.puzzle-place-holder');
  $location.html('<h1>Word Search</h1>');
  $location.append('<table class="puzzle"></table>');
  var $puzzle = $('.puzzle');
  // var size = Math.min(window.innerWidth, window.innerHeight) / (grid.length + 4);
  // var style = 'width: ' + size + 'px; height: ' + size + 'px;';
  for (var i = 0; i < grid.length; i ++) {
    $puzzle.append('<tr class="puzzle-row puzzle-row--' + i + '"></tr>');
    var $row = $('.puzzle-row--' + i);
    for (var j = 0; j < grid[i].length; j ++) {
      $row.append('<td class="puzzle-cell puzzle-cell--' + i + '-' + j +
        '">' + grid[i][j] + '</td>');
    }
  }
}

function drawWordList(words) {
  var $location = $('.word-list');
  $location.html('');
  $location.append('<h2>Words:</h2>');
  $location.append('<ul></ul>');
  $ul = $('.word-list > ul');
  for (var i = 0; i < words.length; i ++) {
    $ul.append('<li class="word ' + words[i].word + '">' + words[i].word +
      '<span class="hide">: ' + words[i].definition + '</span></li>');
  }
}

function drawPuzzle(puzzle) {
  drawGrid(puzzle.grid);
  drawWordList(puzzle.key.map(function(element) { return { word: element.word,
    definition: element.definition }; }).sort(function() {
      return Math.floor(Math.random() * 2) ? -1 : 1;
    }
  ));
}

function showOptions() {
  $('.puzzle-options').removeClass('hide');
  $('.start').addClass('hide');
}

function getPuzzleRowCol(x, y) {
  var $puzzle = $('.puzzle');
  var row = Math.floor((y - $puzzle.position().top) *
    mainPuzzle.puzzle.grid.length / $puzzle.height());
  var col = Math.floor((x - $puzzle.position().left) *
    mainPuzzle.puzzle.grid.length / $puzzle.width());
  return { row: row, col: col };
}

$(function() {
  var minWords = 15, maxWords = 50, dragTrack = {};
  for (var i = minWords; i <= maxWords; i ++) {
    $('#num-words').append('<option value="' + i + '">' + i + '</option>');
  }



  $('.puzzle-place-holder').on('mousedown', puzzleDown)
    .on('mousemove', puzzleDrag).on('mouseup', puzzleUp);

  $('.word-list').on('mousedown', function(event) {
    $(event.target).find('span').toggleClass('hide');
  });

  $('#submitform').click(function(event) {
    event.preventDefault();
    $('.puzzle-options').addClass('hide');
    $('.start').removeClass('hide');
    var diagonal = $('#diagonal').is(':checked') ?
      ['diagonal up', 'diagonal down'] : [];
    var directions = ['horizontal', 'vertical'].concat(diagonal);
    var reversable = $('#backwards').is(':checked');
    var numWords = parseInt($('#num-words').val());
    $('.puzzle-place-holder').html('<p>Loading new puzzle...</p>');
    mainPuzzle = new WordSearch({ directions: directions, numWords: numWords,
      reversable: reversable, callBack: drawPuzzle
    });
  })
  .click(); // FOR TESTING ONLY

  $('.puzzle-options').on('keypress', function(event){
    if (event.keyCode === 13) event.preventDefault();
    $('#submitform')[0].click();
  });
});



$(document).on('mouseup', function(event) {
  highlightCells({ classes: ['selecting'], mode: 'clear' });
  dragTrack = {};
});

function puzzleDown(event) {
  dragTrack = {};
  dragTrack.start = getPuzzleRowCol(event.pageX, event.pageY);
}

function puzzleDrag(event) {
  if (dragTrack.start) {
    dragTrack.end = getPuzzleRowCol(event.pageX, event.pageY);
    highlightCells({ classes: ['selecting'], mode: 'clear' });
    highlightCells({ vector: dragTrack, classes: ['selecting'], mode: 'add' });
  }
}

function puzzleUp(event){
  if (dragTrack.start && dragTrack.end) {
    var key = mainPuzzle.puzzle.key;
    for (var i = 0; i < key.length; i ++) {
      if (key[i].start.row === dragTrack.start.row && key[i].start.col ===
        dragTrack.start.col && key[i].end.row === dragTrack.end.row &&
        key[i].end.col === dragTrack.end.col && !key[i].selected) {
          // Selected word in puzzle
          key[i].selected = true;
          $('.' + key[i].word).addClass('found');
          // console.log(key[i].word);
          highlightCells({ vector: dragTrack, classes: ['selected'],
            mode: 'add' });
          i = key.length;
      }
    }
  }
}

function highlightCells(params) {
  if (params.mode === 'clear') {
              // makeCellList(dragTrack);
    for (var i = 0; i < params.classes.length; i ++) {
      $('.puzzle td').removeClass(params.classes[i]);
    }
  } else {
    var cellList = makeCellList(params.vector);
    // var cellList = [[0,0],[1,1]];
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
}

function makeCellList(vector) {
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

function ltetgt(a, b) {
  if (a > b) return -1;
  else if (a === b) return 0;
  else return 1;
}
