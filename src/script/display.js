function drawGrid(grid) {
  $('.puzzle').remove();
  loadStub({ parent: '.puzzle-container', file: './stubs/puzzle.html',
    params: { puzzle: grid } });
}

function drawWordList(key) {
  $('.word-list').remove();
  var newKey = alphaSort(key, 'word');
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

function displayBooleans() {
  [{ element: '.switch-backwards', checkbox: '.backwards' },
    { element: '.switch-diagonal', checkbox: '.diagonal' }]
    .forEach(function(item) {
      var $element = $(item.element);
      var checked = $(item.checkbox)[0].checked;
      var position = checked ? { left: 'auto', right: '0' } :
        { left: '0', right: 'auto' };
      $element.css(position);
    });
}

function hideMenu(callback) {
  $('.menu-container').animate({ top: '-100vh' }, config.animSpeed, callback);
  config.menuDisplayed = false;
  $('.cheering').remove();
}

function showMenu() {
  displayBooleans();
  $('.menu-container').animate({ top: '50px' }, config.animSpeed);
  config.menuDisplayed = true;
}

function highlightCells(params) {
  if (params.mode === 'clear') {
    for (var i = 0; i < params.classes.length; i ++) {
      $('.puzzle-cell').removeClass(params.classes[i]);
    }
  } else {
    var cellList = makeCellList(params.vector);
    var ret = params.vector;
    if (cellList) {
      if (cellList.length === 0) return ret;
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

function popUp(message, callback) {
  $('.modal-message').html(message);
  $('.modal-container').show();
  $('.modal-button').focus();
  config.modalCallback = callback;
}

function showDefinition(event) {
  var word = event.target.innerText;
  var definition = WordSearch.prototype.whatIsDefinition.call(mainPuzzle, word);
  popUp('<span class="word">' + word + '</span>: ' +
    '<span class="definition">' + definition + '</span>');
}

function fitPuzzle() {
  if (mainPuzzle) {
    var cellFontSize = $('.puzzle-cell').css('font-size');
    $('.word-list-container h2').css('font-size', 'calc(1 * ' +
      cellFontSize + ')');
    $('.word-list-container li').css('font-size', 'calc(0.7 * ' +
      cellFontSize + ')');
    $('.word-list-container').show();
  }
}
window.onresize = fitPuzzle;

$(document).on('mouseup touchend', function(event) {
  highlightCells({ classes: ['selecting'], mode: 'clear' });
  config.dragTrack = {};
});

function puzzleDown(event) {
  event.preventDefault();
  config.dragTrack = {};
  config.dragTrack.start = chomp(event);
}

function puzzleDrag(event) {
  event.preventDefault();
  if (config.dragTrack && config.dragTrack.start) {
    config.dragTrack.end = event.originalEvent.touches ?
      getPuzzleRowCol(event.originalEvent.touches[0].pageX,
      event.originalEvent.touches[0].pageY) : chomp(event);
    if (config.dragTrack.end) {
      highlightCells({ classes: ['selecting'], mode: 'clear' });
      config.dragTrack = highlightCells({ vector: config.dragTrack,
        classes: ['selecting'], mode: 'add' });
    }
  }
}

function puzzleUp(event){
  event.preventDefault();
  if (config.dragTrack && config.dragTrack.start && config.dragTrack.end) {
    var key = mainPuzzle.puzzle.key;
    var word = WordSearch.prototype.extractWord.call(mainPuzzle,
      config.dragTrack.start, config.dragTrack.end).toLowerCase();
    for (var i = 0; i < key.length; i ++) {
      if (word === key[i].word && !key[i].selected) {
        key[i].selected = true;
        $('.' + word).addClass('found');
        highlightCells({ vector: config.dragTrack, classes: ['selected'],
          mode: 'add' });
        i = key.length;
        saveLocal();
        isPuzzleFinished();
      }
    }
  }
}
