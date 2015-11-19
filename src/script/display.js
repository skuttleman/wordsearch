function drawGrid(grid) {
  $('.puzzle-temp').remove();
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
  $svgSelecting = $('.svg-selecting');
  $svgSelected = $('.svg-selected');
  config.svg.selecting = new DrawSVG($svgSelecting, 'yellow', puzzle.grid.length);
  config.svg.selected = new DrawSVG($svgSelected, 'green', puzzle.grid.length);
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
  var temp = deepCopy(params.vector);
  var $puzzle = $('.puzzle');
  if (params.mode === 'clear' && config.svg.selecting) {
    config.svg.selecting.dump();
    config.svg.selecting.clear();
  } else if (params.mode === 'selecting' && config.svg.selecting) {
    config.svg.selecting.dump();
    config.svg.selecting.addLine(temp.start, temp.end);
    config.svg.selecting.drawLines($puzzle.width(), $puzzle.height());
  } else if (config.svg.selected) {
    config.svg.selected.addLine(temp.start, temp.end);
    config.svg.selected.drawLines($puzzle.width(), $puzzle.height());
  }
}

function popUp(message, callback, className) {
  $('.modal-message').html(message);
  var $form = $('.modal-container > form');
  $form.removeClass();
  if (className) $form.addClass(className);
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
    var $puzzle = $('.puzzle');
    config.svg.selected.drawLines($puzzle.width(), $puzzle.height());
  }
}
window.onresize = fitPuzzle;

$(document).on('mouseup touchend', function(event) {
  highlightCells({ mode: 'clear' });
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
      var newVector = makeCellList(config.dragTrack, true);
      highlightCells({ vector: newVector, mode: 'selecting' });
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
        highlightCells({ vector: config.dragTrack, mode: 'selected' });
        i = key.length;
        saveLocal();
        isPuzzleFinished();
      }
    }
  }
}
