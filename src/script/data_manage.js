function drillAPI(data) {
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

Array.prototype.randomize = function() {
  this.sort(function() {
    return Math.floor(Math.random() * 2) ? -1 : 1;
  });
  return this;
}

Array.prototype.shuffle = function() {
  this.push(this.shift());
  return this;
}

function alphaSort(obj, element, reverse) {
  var ret = deepCopy(obj);
  reverse = reverse ? -1 : 1;
  ret.sort(function(obj1, obj2) {
    if (obj1[element] < obj2[element]) return -1 * reverse;
    else if (obj1[element] > obj2[element]) return 1 * reverse;
    else return 0;
  });
  return ret;
}

function chomp(event) {
  var start = Array.prototype.filter.call(event.target.classList,
    function(element) { return element.indexOf('--') + 1; })[0];
  if (start) {
    var coordinates = start.split('--')[1].split('-');
    return coordinates.length === 2 ? { row: parseInt(coordinates[0]),
      col: parseInt(coordinates[1]) } : {};
  }
}
