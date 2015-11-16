function WordSearch(params) {
  this.numWords = params.numWords;
  this.directions = params.directions;
  this.reversable = params.reversable;
  this.definitions = [];
  this.callBack = params.callBack;

  this.getWords();
}

WordSearch.prototype.addDefinition = function(word, definition) {
  this.definitions.push({ word: word, definition: definition });
  if (this.definitions.length === this.numWords) this.newPuzzle();
};

WordSearch.prototype.getDefinition = function(word) {
  // $.get('https://api.pearson.com:443/v2/dictionaries/ldoce5/entries?headword=' +
  //   word, function(data) {
  //     console.log(word);
  //     console.log(data.results[0].senses[0].definition[0]);
  //     // this.addDefinition(word, data);
  //   }
  // );
  this.addDefinition(word, 'a placeholder definition for ' + word + ' to be used when the project is ready to have a definition');
};

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
          self.getDefinition(wordList[random]);
        }
      }
    }
  };
  ajax.open('GET', '/words.json');
  ajax.send();
};
