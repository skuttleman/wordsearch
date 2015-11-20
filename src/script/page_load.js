var mainPuzzle, config = { dragTrack: {}, minWordCount: 10, maxWordCount: 50,
  menuDisplayed: false, animSpeed: 400, modalCallback: undefined, svg: {} };

function loadStub(params, callback) {
  if (params.html) {
    var html = Handlebars.compile(params.html);
    $(params.parent).append(html(params.params));
    if (callback) callback(params.callbackParams);
  } else {
    $.get(params.file, function(data) {
      loadStub({ html: data, parent: params.parent,
        params: params.params, blowout: params.blowout,
        callbackParams: params.callbackParams }, callback);
    });
  }
  fitPuzzle();
}

$(function() {
  $('.menu-button').click(function(event) {
    event.preventDefault();
    if (config.menuDisplayed) window.hideMenu();
    else window.showMenu();
  });

  $('.switch-diagonal, .switch-backwards').on('mousedown', function(event) {
    $target = $('.' + this.className.split('-')[1]);
    $target[0].checked = !$target[0].checked;
    displayBooleans();
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

    if (isNaN(numWords) || numWords < config.minWordCount ||
      numWords > config.maxWordCount) {
        popUp('The number of words must be a number between ' +
          config.minWordCount + ' and ' + config.maxWordCount + '!', undefined,
          'warning');
    } else {
      $('.puzzle').remove();
      if (config.svg.selected) config.svg.selected.clear();
      if (config.svg.selecting) config.svg.selecting.clear();
      $('.puzzle-container').append('<p class="puzzle-temp">Loading new puzzle...</p>');
      $('.word-list').html('');
      $('.word-list-container').hide();
      hideMenu(function() {
        mainPuzzle = new WordSearch({ directions: directions, numWords:
          numWords, reversable: reversable, callBack: drawPuzzle });
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
    if (config.modalCallback) config.modalCallback();
    config.modalCallback = null;
  });
});
