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
