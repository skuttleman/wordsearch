var testWords = ['apple', 'pear', 'banana', 'otherfruit', 'zebra',
  'cornacopia', 'razzledazzle', 'jumble', 'plankton', 'draught',
  'carnivore', 'pheasant', 'test', 'data', 'fiber', 'soylent',
  'sunflower', 'carbohydrate', 'fifth', 'constitution', 'metabolism',
  'beets', 'oil', 'biohazard', 'natural', 'protein', 'improvement',
  'profile', 'powder', 'rice', 'building', 'view', 'concert', 'power',
  'garbage', 'onyx', 'gross', 'story', 'superfluous', 'arbitrary', 'stuff',
  'conditional', 'gargantuan', 'dragon', 'fuss', 'magical', 'weeds', 'garden',
  'incontrovertable', 'archenemy', 'claw', 'injuries', 'stump', 'wheel',
  'octagonal', 'oyster'];

function sortedWordList(numWords) {
  var ret = [];
  for (var i = 0; i < numWords; i ++) {
    do {
      var randomWord = testWords[Math.floor(Math.random() * testWords.length)];
    } while (ret.indexOf(randomWord) !== -1);
    ret.push(randomWord);
  }
  return ret.sort(function(word1, word2) {
    return word2.length - word1.length;
  });
}

Array.prototype.randomize = function() {
  this.sort(function() {
    if (Math.random() < 0.5) return -1;
    else return 1;
  });
  return this;
}

Array.prototype.shuffle = function() {
  this.push(this.shift());
  return this;
}

function makePuzzle(params) {
  var words = params.words;
  var i = 0, ret = [], key = [];
  params.directions.sort();
  while (i < words.length) {
    ret = resize(ret, words[i].length, '-');
    var success = false;
    var matrix = concatMatrices(ret, words[i], params.directions.shuffle(), true);
    for (var j = 0; j < matrix.length; j ++) {
      var temp = insert({
        direction: matrix[j].direction,
        start: { row: matrix[j].row, col: matrix[j].col },
        word: words[i],
        grid: ret,
        reverse: (params.reversable) ? Math.floor(Math.random() * 2) : false
      });
      if (temp) {
        success = true;
        ret = temp.grid;
        key.push(temp.key);
        j = matrix.length;
      }
    }
    if (success) i ++;
    else ret = resize(ret, ret.length + 1, '-');
  }
  ret = fillRandom(ret);
  return { grid: ret, key: key };
}




$(function() {
  var wordList = [];
  var numWords = 30;

  for (var i = 0; i < numWords; i ++) {
    $.ajax({
      type: "GET",
      url: 'http://randomword.setgetgo.com/get.php',
      dataType: "jsonp",
      success: function(data) {
        // console.log(data);
        if (wordList.indexOf(data.Word) === -1) wordList.push(data.Word);
        if (wordList.length === numWords) {
          wordList = wordList.sort(function(word1, word2) {
            return word2.length - word1.length;
          });
          var puzzle = makePuzzle({ reversable: false, directions: ['vertical', 'diagonal up', 'diagonal down', 'horizontal'], words: wordList });
          $('body').append('<table class="wordsearch"></table>')
          for (var i = 0; i < puzzle.grid.length; i ++) {
            //console.log(puzzle.grid[i].join(''));
            $('.wordsearch').append('<tr class="wsrow-' + i + '"></tr>')
            for (var j = 0; j < puzzle.grid[i].length; j ++) {
              $('.wsrow-' + i).append('<td class="wscell-' + i + '-' + j +
                '">' + puzzle.grid[i][j] + '</td>'
              );
            }
          }
        }
      }
    });
  }

  // $.get('https://api.pearson.com:443/v2/dictionaries/ldoce5/entries?headword=apple', function(data) {
  //   console.log(data);
  // });
});
// $(function() {
//   makePuzzle({ reversable: false, directions: ['vertical', 'diagonal up', 'diagonal down', 'horizontal'], numWords: 30 });
//   makePuzzle({ reversable: false, directions: ['vertical', 'horizontal'], numWords: 30 });
// });
