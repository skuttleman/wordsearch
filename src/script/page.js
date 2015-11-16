var mainPuzzle;

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
        /*'" style="' + style + */'">' + grid[i][j] + '</td>');
    }
  }
}

function drawWordList(words) {
  var $location = $('.word-list');
  $location.html('');
  $location.append('<ul><h2>Words:</h2></ul>');
  $ul = $('.word-list > ul');
  for (var i = 0; i < words.length; i ++) {
    $ul.append('<li class="word">' + words[i].word + '<span class="hide ' +
      words[i].word + '">: ' + words[i].definition + '</span></li>');
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

function ltetgt(a, b) {
  if (a > b) return 1;
  else if (a === b) return 0;
  else return -1;
}

$(function() {
  var minWords = 15, maxWords = 50, dragTrack = {};
  for (var i = minWords; i <= maxWords; i ++) {
    $('#num-words').append('<option value="' + i + '">' + i + '</option>');
  }



  $('.puzzle-place-holder').on('mousedown', function(event) {
    dragTrack = {};
    dragTrack.start = getPuzzleRowCol(event.pageX, event.pageY);
  }).on('mousemove', function(event) {
    if (dragTrack.start) {
      dragTrack.finish = getPuzzleRowCol(event.pageX, event.pageY);
    } else {
      dragTrack = {};
    }
  }).on('mouseup', function(event){
    if (dragTrack.start && dragTrack.finish) {
      console.log(dragTrack.start, dragTrack.finish);
    }
    console.log(mainPuzzle.puzzle.key);
    dragTrack = {};
  });

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