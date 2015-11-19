function DrawSVG($element, color, size) {
  this.$element = $element;
  this.color = color;
  this.size = size;
  this.lines = [];
}

DrawSVG.prototype.clear = function() {
  this.$element.html('');
};

DrawSVG.prototype.addLine = function(start, end) {
  this.lines.push({ start: start, end: end });
};

DrawSVG.prototype.makeElement = function(start, end, width) {
  var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
  newLine.setAttribute('x1', Math.round(start.x));
  newLine.setAttribute('y1', Math.round(start.y));
  newLine.setAttribute('x2', Math.round(end.x));
  newLine.setAttribute('y2', Math.round(end.y));
  newLine.setAttribute('stroke', this.color);
  newLine.setAttribute('stroke-width', Math.round(width));
  newLine.setAttribute('stroke-linecap', 'round');
  return newLine;
};

DrawSVG.prototype.drawLines = function(width, height) {
  this.clear();
  if (width && height) {
    for (var i = 0; i < this.lines.length; i ++) {
      var paddingX = (width / this.size) / 2;
      var paddingY = (height / this.size) / 2;
      var start = { x: ((width / this.size) * this.lines[i].start.col) + paddingX,
        y: ((height / this.size) * this.lines[i].start.row) + paddingY };
      var end = { x: ((width / this.size) * this.lines[i].end.col) + paddingX,
        y: ((height / this.size) * this.lines[i].end.row) + paddingY };
      var elem = this.makeElement(start, end, Math.min(paddingX, paddingY));
      this.$element.append(elem);
    }
  }
};
