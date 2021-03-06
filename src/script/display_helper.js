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

function makeCellList(vector, justStraighten) {
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
  var ret = [], start = deepCopy(vector.start);
  if (justStraighten) {
    var end = {};
    end.row = start.row + (verticalStep * (wordLength - 1));
    end.col = start.col + (horizontalStep * (wordLength - 1));
    return {start: start, end: end}
  } else {
    for (var i = 0; i < wordLength; i ++) {
      ret.push([start.row, start.col]);
      start.row += verticalStep;
      start.col += horizontalStep;
    }
    return ret;
  }
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

function animateTip(params) {
  var $target = $('#' + params.id);
  $target.animate({ bottom: '10px' }, params.animSpeed, function() {
    window.setTimeout(function() {
      $target.animate({ bottom: '-500px' }, params.animSpeed, function() {
        $target.remove();
      })
    }, params.wait);
  });
}

function createToolTip(message) {
  var id = (new Date()).getTime();
  loadStub({ parent: '.main', file: './stubs/tool_tip.html',
    params: { tip: message, id: id },
    callbackParams: { id: id, animSpeed: config.animSpeed * 4, wait: 3000 }},
    animateTip);
}

function tipHighlight() {
  setTimeout(function() {
    if (!localStorage.firstHighlight) {
      createToolTip(
        'Click and drag your mouse over the puzzle to highlight words as you find them.'
      );
      setTimeout(tipHighlight, 4000);
    }
  }, 3000);
}

function tipDefine() {
  if (!localStorage.tipDefine) {
    localStorage.tipDefine = 'true';
    createToolTip(
      'Don\'t know what a word in the word list means? Click on it to see its definition'
    );
  }
}
