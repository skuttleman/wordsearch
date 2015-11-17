function WordSearch(e){this.numWords=e.numWords,this.directions=e.directions,this.reversable=e.reversable,this.definitions=[],this.callBack=e.callBack,this.getWords()}function drill(e){for(var t=0;t<(e.results||[]).length;t++)for(var r=e.results[t],n=0;n<(r.senses||[]).length;n++)for(var o=r.senses[n],i=0;i<(o.definition||[]).length;n++){var a=o.definition[i];if(a)return a}}function drawGrid(e){var t=$(".puzzle");t.html("");for(var r=0;r<e.length;r++){t.append('<div class="puzzle-row puzzle-row--'+r+'"></div>');for(var n=$(".puzzle-row--"+r),o=0;o<e[r].length;o++)n.append('<p class="puzzle-cell puzzle-cell--'+r+"-"+o+'">'+e[r][o]+"</p>")}fitPuzzle()}function drawWordList(e){var t=$(".list-container");t.html(""),t.append("<h2>Words:</h2>"),t.append("<ul></ul>"),$ul=$(".list-container > ul");for(var r=0;r<e.length;r++)$ul.append('<li class="word '+e[r].word+'">'+e[r].word+"</li>");fitPuzzle()}function drawPuzzle(e){drawGrid(e.grid),drawWordList(e.key.map(function(e){return{word:e.word,definition:e.definition}}).sort(function(){return Math.floor(2*Math.random())?-1:1}))}function showOptions(){$(".puzzle-options").removeClass("hide"),$(".start").addClass("hide")}function getPuzzleRowCol(e,t){var r=($(".puzzle"),$(".puzzle-cell--0-0")),n=Math.floor((t-r.position().top)/(r.height()*mainPuzzle.puzzle.grid.length)*mainPuzzle.puzzle.grid.length),o=Math.floor((e-r.position().left)/(r.height()*mainPuzzle.puzzle.grid.length)*mainPuzzle.puzzle.grid.length);return{row:n,col:o}}function fitPuzzle(){if(mainPuzzle){var e=($(".puzzle"),$(".puzzle-cell"));$title=$(".title");var t=(Math.min(window.innerHeight,window.innerWidth)-($title.height()+10))/mainPuzzle.puzzle.grid.length;e.css("font-size",t/1.1),$title=$("h1"),$title.css("font-size",1.25*t).height(),$("h2").css("font-size",1.125*t),$("p,li").css("font-size",t/1.1),$(".menu-icon").height(.75*$title.height())}}function chomp(e){var t=Array.prototype.filter.call(e.target.classList,function(e){return e.indexOf("--")+1})[0].split("--")[1].split("-");return 2===t.length?{row:parseInt(t[0]),col:parseInt(t[1])}:{}}function puzzleDown(e){e.preventDefault(),dragTrack={},dragTrack.start=chomp(e)}function puzzleDrag(e){e.preventDefault(),dragTrack.start&&(dragTrack.end=e.originalEvent.touches?getPuzzleRowCol(e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY):chomp(e),highlightCells({classes:["selecting"],mode:"clear"}),dragTrack=highlightCells({vector:dragTrack,classes:["selecting"],mode:"add"}))}function puzzleUp(e){if(e.preventDefault(),dragTrack.start&&dragTrack.end)for(var t=mainPuzzle.puzzle.key,r=0;r<t.length;r++)t[r].start.row!==dragTrack.start.row||t[r].start.col!==dragTrack.start.col||t[r].end.row!==dragTrack.end.row||t[r].end.col!==dragTrack.end.col||t[r].selected||(t[r].selected=!0,$("."+t[r].word).addClass("found"),highlightCells({vector:dragTrack,classes:["selected"],mode:"add"}),r=t.length)}function highlightCells(e){if("clear"===e.mode)for(var t=0;t<e.classes.length;t++)$(".puzzle-cell").removeClass(e.classes[t]);else{var r=makeCellList(e.vector);if(0===r.length)return{};var n={start:{},end:{}};for(n.start.row=r[0][0],n.start.col=r[0][1],n.end.row=r[r.length-1][0],n.end.col=r[r.length-1][1],t=0;t<e.classes.length;t++)for(var o=0;o<r.length;o++){var i=r[o][0],a=r[o][1];"add"===e.mode?$(".puzzle-cell--"+i+"-"+a).addClass(e.classes[t]):$(".puzzle-cell--"+i+"-"+a).removeClass(e.classes[t])}}return n}function makeCellList(e){var t=Math.abs(Math.abs(e.start.row)-Math.abs(e.end.row)),r=Math.abs(Math.abs(e.start.col)-Math.abs(e.end.col)),n=Math.max(t,r)+1,o=r/2>t?0:1,i=t/2>r?0:1;o*=ltetgt(e.start.row,e.end.row),i*=ltetgt(e.start.col,e.end.col);for(var a=[],l=deepCopy(e.start),s=0;n>s;s++)a.push([l.row,l.col]),l.row+=o,l.col+=i;return a}function ltetgt(e,t){return e>t?-1:e===t?0:1}function blankPuzzle(e,t){for(var r=[],n=0;e>n;n++){for(var o=[],i=0;e>i;i++)o.push(t);r.push(o.slice())}return r}function deepCopy(e){var t=e instanceof Array?[]:{};for(var r in e)"object"==typeof e[r]?t[r]=deepCopy(e[r]):t[r]=e[r];return t}function randomLetter(){var e=Math.floor(26*Math.random());return"ABCDEFGHIJKLMNOPQRSTUVWXYZ"[e]}function resize(e,t,r){for(var n=deepCopy(e);n.length<t;)n.push([]);for(var o=0;o<n.length;o++)for(;n[o].length<t;)n[o].push(r);return n}function stepDirection(e){return"vertical"===e?{rowStep:1,colStep:0}:"diagonal up"===e?{rowStep:-1,colStep:1}:"diagonal down"===e?{rowStep:1,colStep:1}:{rowStep:0,colStep:1}}function insert(e){e=deepCopy(e);for(var t=stepDirection(e.direction),r=deepCopy(e.start),n={row:r.row+t.rowStep*(e.word.length-1),col:r.col+t.colStep*(e.word.length-1)},o={start:e.reverse?n:r,end:e.reverse?r:n,word:e.word,reverse:!!e.reverse},i=0;i<e.word.length;i++){var a=e.grid[e.start.row][e.start.col],l=e.reverse?e.word[e.word.length-(i+1)].toUpperCase():e.word[i].toUpperCase();if("-"===a)e.grid[e.start.row][e.start.col]=l;else if(a!==l)return!1;e.start.row+=t.rowStep,e.start.col+=t.colStep}return{grid:e.grid,key:o}}function fillRandom(e){for(var t=deepCopy(e),r=0;r<t.length;r++)for(var n=0;n<t[r].length;n++)"-"===t[r][n]&&(t[r][n]=randomLetter());return t}function range(e,t,r){for(var n=[],o=e;o<t+(Number(r)||0);o++)n.push(o);return n}function combinationRanges(e,t,r){for(var n=[],o=0;o<e.length;o++)for(var i=0;i<t.length;i++)n.push({row:e[o],col:t[i],direction:r});return n}function getMatrix(e,t,r){var n="diagonal up"===r?t.length-1:0,o=0,i="horizontal"===r||"diagonal up"===r?e.length-1:e.length-t.length,a="vertical"===r?e.length-1:e.length-t.length;return combinationRanges(range(n,i,!0),range(o,a,!0),r)}function concatMatrices(e,t,r,n){for(var o=[],i=0;i<r.length;i++)o=n?o.concat(getMatrix(e,t,r[i]).randomize()):o.concat(getMatrix(e,t,r[i]));return o}function addWord(e){for(var t=!1,r=e.grid;!t;){r=resize(r,e.word.length+1,"-");for(var n=concatMatrices(r,e.word,e.directions.shuffle(),!0),o=0;o<n.length;o++){var i=insert({start:{row:n[o].row,col:n[o].col},direction:n[o].direction,word:e.word,grid:r,reverse:e.reversable?Math.floor(2.2*Math.random()):!1});i&&(t=!0,r=i.grid,o=n.length,e.key.push(i.key))}t||(r=resize(r,r.length+1,"-"))}return{grid:r,key:e.key}}function makePuzzle(e){var t=e.words.sort(function(e,t){return t.length-e.length}),r={};e.directions.sort();for(var n=0;n<t.length;n++)r=addWord({grid:r.grid||[],key:r.key||[],directions:e.directions,word:t[n],reversable:e.reversable});return{grid:fillRandom(r.grid),key:r.key}}WordSearch.prototype.addDefinition=function(e,t){for(var r=0;r<this.definitions.length;r++)this.definitions[r].word===e&&(this.definitions[r].definition=t,r=this.definitions.length)},WordSearch.prototype.getDefinition=function(e){var t=this,r={},n=drill(r)||"no definition found";t.addDefinition(e,n)},WordSearch.prototype.whatIsDefinition=function(e){for(var t=0;t<this.definitions.length;t++)if(e===this.definitions[t].word)return this.definitions[t].definition||"definition look-up in progress...";return"broken"},WordSearch.prototype.newPuzzle=function(){this.puzzle=makePuzzle({directions:this.directions,reversable:this.reversable,words:this.definitions.map(function(e){return e.word})});for(var e=0;e<this.puzzle.key.length;e++)for(var t=0;t<this.definitions.length;t++)this.definitions[t].word===this.puzzle.key[e].word&&(this.puzzle.key[e].definition=this.definitions[t].definition,t=this.definitions.length);this.callBack(this.puzzle)},WordSearch.prototype.getWords=function(){var e=new XMLHttpRequest,t=this;e.onreadystatechange=function(){if(200===this.status&&4===this.readyState)for(var e=JSON.parse(this.responseText).words,r=[];r.length<t.numWords;){var n=Math.floor(Math.random()*e.length);-1===r.indexOf(e[n])&&(r.push(e[n]),t.definitions.push({word:e[n]}),t.getDefinition(e[n]),r.length===t.numWords&&t.newPuzzle())}},e.open("GET","/words.json"),e.send()};var mainPuzzle,dragTrack={};$(function(){for(var e=15,t=50,r=e;t>=r;r++)$("#num-words").append('<option value="'+r+'">'+r+"</option>");$(".puzzle-place-holder").on("mousedown touchstart  ",puzzleDown).on("mousemove touchmove",puzzleDrag).on("mouseup touchend",puzzleUp),$(".list-container").on("mousedown",function(e){var t=e.target.innerText,r=mainPuzzle.whatIsDefinition(t);$(".definition").removeClass("hide").text(r)}),$("#submitform").click(function(e){e.preventDefault(),$(".puzzle-options").addClass("hide"),$(".start").removeClass("hide");var t=$("#diagonal").is(":checked")?["diagonal up","diagonal down"]:[],r=["horizontal","vertical"].concat(t),n=$("#backwards").is(":checked"),o=parseInt($("#num-words").val());$(".puzzle").html("<p>Loading new puzzle...</p>"),mainPuzzle=new WordSearch({directions:r,numWords:o,reversable:n,callBack:drawPuzzle})}).click(),$(".puzzle-options").on("keypress",function(e){13===e.keyCode&&e.preventDefault(),$("#submitform")[0].click()})}),window.onresize=fitPuzzle,$(document).on("mouseup touchend",function(e){highlightCells({classes:["selecting"],mode:"clear"}),dragTrack={}}),Array.prototype.randomize=function(){return this.sort(function(){return Math.floor(2*Math.random())?-1:1}),this},Array.prototype.shuffle=function(){return this.push(this.shift()),this};var module=module||{};module.exports={blankPuzzle:blankPuzzle,deepCopy:deepCopy,randomLetter:randomLetter,resize:resize,stepDirection:stepDirection,insert:insert,fillRandom:fillRandom,range:range,combinationRanges:combinationRanges,concatMatrices:concatMatrices,getMatrix:getMatrix};