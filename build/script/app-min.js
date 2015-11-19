function drillAPI(e){for(var t=0;t<(e.results||[]).length;t++)for(var n=e.results[t],o=0;o<(n.senses||[]).length;o++)for(var r=n.senses[o],i=0;i<(r.definition||[]).length;o++){var a=r.definition[i];if(a)return a}}function alphaSort(e,t,n){var o=deepCopy(e);return n=n?-1:1,o.sort(function(e,o){return e[t]<o[t]?-1*n:e[t]>o[t]?1*n:0}),o}function chomp(e){var t=Array.prototype.filter.call(e.target.classList,function(e){return e.indexOf("--")+1})[0];if(t){var n=t.split("--")[1].split("-");return 2===n.length?{row:parseInt(n[0]),col:parseInt(n[1])}:{}}}function drawGrid(e){$(".puzzle").remove(),loadStub({parent:".puzzle-container",file:"./stubs/puzzle.html",params:{puzzle:e}})}function drawWordList(e){$(".word-list").remove();var t=alphaSort(e,"word");loadStub({parent:".word-list-container",file:"./stubs/word_list.html",params:{key:t}},function(){$(".words").click(showDefinition);for(var t=0;t<e.length;t++)e[t].selected&&highlightCells({vector:e[t],mode:"add",classes:["selected"]})})}function drawPuzzle(e){drawGrid(e.grid),drawWordList(deepCopy(e.key).sort()),saveLocal()}function displayBooleans(){[{element:".switch-backwards",checkbox:".backwards"},{element:".switch-diagonal",checkbox:".diagonal"}].forEach(function(e){var t=$(e.element),n=$(e.checkbox)[0].checked,o=n?{left:"auto",right:"0"}:{left:"0",right:"auto"};t.css(o)})}function hideMenu(e){$(".menu-container").animate({top:"-100vh"},config.animSpeed,e),config.menuDisplayed=!1,$(".cheering").remove()}function showMenu(){displayBooleans(),$(".menu-container").animate({top:"50px"},config.animSpeed),config.menuDisplayed=!0}function highlightCells(e){if("clear"!==e.mode){var t=makeCellList(e.vector),n=e.vector;if(t){if(0===t.length)return n;for(n.start.row=t[0][0],n.start.col=t[0][1],n.end.row=t[t.length-1][0],n.end.col=t[t.length-1][1],a=0;a<e.classes.length;a++)for(var o=0;o<t.length;o++){var r=t[o][0],i=t[o][1];"add"===e.mode?$(".puzzle-cell--"+r+"-"+i).addClass(e.classes[a]):$(".puzzle-cell--"+r+"-"+i).removeClass(e.classes[a])}}return n}for(var a=0;a<e.classes.length;a++)$(".puzzle-cell").removeClass(e.classes[a])}function popUp(e,t){$(".modal-message").html(e),$(".modal-container").show(),$(".modal-button").focus(),config.modalCallback=t}function showDefinition(e){var t=e.target.innerText,n=WordSearch.prototype.whatIsDefinition.call(mainPuzzle,t);popUp('<span class="word">'+t+'</span>: <span class="definition">'+n+"</span>")}function fitPuzzle(){if(mainPuzzle){var e=$(".puzzle-cell").css("font-size");$(".word-list-container h2").css("font-size","calc(1 * "+e+")"),$(".word-list-container li").css("font-size","calc(0.7 * "+e+")"),$(".word-list-container").show()}}function puzzleDown(e){e.preventDefault(),config.dragTrack={},config.dragTrack.start=chomp(e)}function puzzleDrag(e){e.preventDefault(),config.dragTrack&&config.dragTrack.start&&(config.dragTrack.end=e.originalEvent.touches?getPuzzleRowCol(e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY):chomp(e),config.dragTrack.end&&(highlightCells({classes:["selecting"],mode:"clear"}),config.dragTrack=highlightCells({vector:config.dragTrack,classes:["selecting"],mode:"add"})))}function puzzleUp(e){if(e.preventDefault(),config.dragTrack&&config.dragTrack.start&&config.dragTrack.end)for(var t=mainPuzzle.puzzle.key,n=WordSearch.prototype.extractWord.call(mainPuzzle,config.dragTrack.start,config.dragTrack.end).toLowerCase(),o=0;o<t.length;o++)n!==t[o].word||t[o].selected||(t[o].selected=!0,$("."+n).addClass("found"),highlightCells({vector:config.dragTrack,classes:["selected"],mode:"add"}),o=t.length,saveLocal(),isPuzzleFinished())}function getPuzzleRowCol(e,t){var n=($(".puzzle"),$(".puzzle-cell--0-0")),o=Math.floor((t-n.position().top)/(n.height()*mainPuzzle.puzzle.grid.length)*mainPuzzle.puzzle.grid.length),r=Math.floor((e-n.position().left)/(n.height()*mainPuzzle.puzzle.grid.length)*mainPuzzle.puzzle.grid.length);return{row:o,col:r}}function makeCellList(e){function t(e,t){return e>t?-1:e===t?0:1}if(e.start&&e.end){var n=Math.abs(Math.abs(e.start.row)-Math.abs(e.end.row)),o=Math.abs(Math.abs(e.start.col)-Math.abs(e.end.col)),r=Math.max(n,o)+1,i=o/2>n?0:1,a=n/2>o?0:1;i*=t(e.start.row,e.end.row),a*=t(e.start.col,e.end.col);for(var l=[],s=deepCopy(e.start),c=0;r>c;c++)l.push([s.row,s.col]),s.row+=i,s.col+=a;return l}}function saveLocal(){localStorage.wordsearch=JSON.stringify(mainPuzzle),localStorage.diagonal=$(".diagonal")[0].checked,localStorage.backwards=$(".backwards")[0].checked,localStorage["num-words"]=$(".num-words").val()}function isPuzzleFinished(){for(var e=0;e<mainPuzzle.puzzle.key.length;e++)if(!mainPuzzle.puzzle.key[e].selected)return;localStorage.wordsearch="",$(".main").append('<audio autoplay="autoplay" class="cheering nevershown"><source src="./sounds/cheering.mp3" type="audio/mpeg" /></audio>'),popUp("Congratulations! You finished this puzzle!",showMenu)}function loadStub(e,t){if(e.html){var n=Handlebars.compile(e.html);$(e.parent).append(n(e.params)),t&&t()}else $.get(e.file,function(n){loadStub({html:n,parent:e.parent,params:e.params,blowout:e.blowout},t)});fitPuzzle()}function blankPuzzle(e,t){for(var n=[],o=0;e>o;o++){for(var r=[],i=0;e>i;i++)r.push(t);n.push(r.slice())}return n}function randomLetter(){var e=Math.floor(26*Math.random());return"ABCDEFGHIJKLMNOPQRSTUVWXYZ"[e]}function resize(e,t,n){for(var o=deepCopy(e);o.length<t;)o.push([]);for(var r=0;r<o.length;r++)for(;o[r].length<t;)o[r].push(n);return o}function stepDirection(e){return"vertical"===e?{rowStep:1,colStep:0}:"diagonal up"===e?{rowStep:-1,colStep:1}:"diagonal down"===e?{rowStep:1,colStep:1}:{rowStep:0,colStep:1}}function makeKey(e,t,n,o){var r=deepCopy(e),i={row:r.row+t.rowStep*(n.length-1),col:r.col+t.colStep*(n.length-1)},e=o?i:r,a=o?r:i;return{start:e,end:a,word:n,reverse:!!o}}function insertTry(e){e=deepCopy(e);for(var t=stepDirection(e.direction),n=makeKey(e.start,t,e.word,e.reverse),o=0;o<e.word.length;o++){var r=e.grid[e.start.row][e.start.col],i=e.reverse?e.word[e.word.length-(o+1)].toUpperCase():e.word[o].toUpperCase();if("-"===r)e.grid[e.start.row][e.start.col]=i;else if(r!==i)return!1;e.start.row+=t.rowStep,e.start.col+=t.colStep}return{grid:e.grid,key:n}}function fillRandom(e){for(var t=deepCopy(e),n=0;n<t.length;n++)for(var o=0;o<t[n].length;o++)"-"===t[n][o]&&(t[n][o]=randomLetter());return t}function range(e,t,n){for(var o=[],r=e;r<t+(Number(n)||0);r++)o.push(r);return o}function combinationRanges(e,t,n){for(var o=[],r=0;r<e.length;r++)for(var i=0;i<t.length;i++)o.push({row:e[r],col:t[i],direction:n});return o}function getMatrix(e,t,n){var o="diagonal up"===n?t.length-1:0,r=0,i="horizontal"===n||"diagonal up"===n?e.length-1:e.length-t.length,a="vertical"===n?e.length-1:e.length-t.length;return combinationRanges(range(o,i,!0),range(r,a,!0),n)}function concatMatrices(e,t,n,o){for(var r=[],i=0;i<n.length;i++)r=o?r.concat(getMatrix(e,t,n[i]).randomize()):r.concat(getMatrix(e,t,n[i]));return r}function addWord(e){for(var t=!1,n=e.grid;!t;){n=resize(n,e.word.length+1,"-");for(var o=concatMatrices(n,e.word,e.directions.shuffle(),!0),r=0;r<o.length;r++){var i=insertTry({start:{row:o[r].row,col:o[r].col},direction:o[r].direction,word:e.word,grid:n,reverse:e.reversable?Math.floor(2.2*Math.random()):!1});i&&(t=!0,n=i.grid,r=o.length,e.key.push(i.key))}t||(n=resize(n,n.length+1,"-"))}return{grid:n,key:e.key}}function makePuzzle(e){var t=e.words.sort(function(e,t){return t.length-e.length}),n={};e.directions.sort();for(var o=0;o<t.length;o++)n=addWord({grid:n.grid||[],key:n.key||[],directions:e.directions,word:t[o],reversable:e.reversable});return{grid:fillRandom(n.grid),key:n.key}}function deepCopy(e){var t=e instanceof Array?[]:{};for(var n in e)"object"==typeof e[n]?t[n]=deepCopy(e[n]):t[n]=e[n];return t}function WordSearch(e){this.numWords=e.numWords,this.directions=e.directions,this.reversable=e.reversable,this.definitions=[],this.callBack=e.callBack,this.getWords()}Array.prototype.randomize=function(){return this.sort(function(){return Math.floor(2*Math.random())?-1:1}),this},Array.prototype.shuffle=function(){return this.push(this.shift()),this},window.onresize=fitPuzzle,$(document).on("mouseup touchend",function(e){highlightCells({classes:["selecting"],mode:"clear"}),config.dragTrack={}});var mainPuzzle,config={dragTrack:{},minWordCount:10,maxWordCount:50,menuDisplayed:!1,animSpeed:400,modalCallback:void 0};$(function(){$(".menu-button").click(function(e){e.preventDefault(),config.menuDisplayed?window.hideMenu():window.showMenu()}),$(".switch-diagonal, .switch-backwards").on("mousedown",function(e){$target=$("."+this.className.split("-")[1]),$target[0].checked=!$target[0].checked,displayBooleans()}),$(".diagonal")[0].checked="true"===localStorage.diagonal?!0:!1,$(".backwards")[0].checked="true"===localStorage.backwards?!0:!1,$(".num-words").val(localStorage["num-words"]||"15");var e=localStorage.wordsearch;e?(mainPuzzle=JSON.parse(e),drawPuzzle(mainPuzzle.puzzle)):$(".menu-button").click(),$(".puzzle-container").on("mousedown touchstart",puzzleDown).on("mousemove touchmove",puzzleDrag).on("mouseup touchend",puzzleUp),$(".submit-form").click(function(e){e.preventDefault();var t=$(".diagonal").is(":checked")?["diagonal up","diagonal down"]:[],n=["horizontal","vertical"].concat(t),o=$(".backwards").is(":checked"),r=parseInt($(".num-words").val());isNaN(r)||r<config.minWordCount||r>config.maxWordCount?popUp("The number of words must be a number between "+config.minWordCount+" and "+config.maxWordCount+"!"):($(".puzzle-container").html('<p class="puzzle">Loading new puzzle...</p>'),$(".word-list").html(""),$(".word-list-container").hide(),hideMenu(function(){mainPuzzle=new WordSearch({directions:n,numWords:r,reversable:o,callBack:drawPuzzle})}))}),$(".puzzle-options").on("keypress",function(e){13===e.keyCode&&e.preventDefault(),$(".submit-form")[0].click()}),$(".modal-button").on("click",function(e){e.preventDefault(),$(".modal-container").hide(),config.modalCallback&&config.modalCallback(),config.modalCallback=null})});var module=module||{};module.exports={blankPuzzle:blankPuzzle,randomLetter:randomLetter,resize:resize,stepDirection:stepDirection,insertTry:insertTry,fillRandom:fillRandom,range:range,combinationRanges:combinationRanges,concatMatrices:concatMatrices,getMatrix:getMatrix,deepCopy:deepCopy},WordSearch.prototype.extractWord=function(e,t){var n=makeCellList({start:e,end:t}),o=this,r=n.map(function(e){return o.puzzle.grid[e[0]][e[1]]});return r.join("")},WordSearch.prototype.addDefinition=function(e,t){for(var n=0;n<this.definitions.length;n++)this.definitions[n].word===e&&(this.definitions[n].definition=t,n=this.definitions.length)},WordSearch.prototype.getDefinition=function(e){var t=this,n={},o=drillAPI(n)||"no definition found";t.addDefinition(e,o)},WordSearch.prototype.whatIsDefinition=function(e){for(var t=0;t<this.definitions.length;t++)if(e===this.definitions[t].word)return this.definitions[t].definition||"definition look-up in progress...";return"definition could not be found."},WordSearch.prototype.newPuzzle=function(){this.puzzle=makePuzzle({directions:this.directions,reversable:this.reversable,words:this.definitions.map(function(e){return e.word})});for(var e=0;e<this.puzzle.key.length;e++)for(var t=0;t<this.definitions.length;t++)this.definitions[t].word===this.puzzle.key[e].word&&(this.puzzle.key[e].definition=this.definitions[t].definition,t=this.definitions.length);this.callBack(this.puzzle)},WordSearch.prototype.getWords=function(){var e=new XMLHttpRequest,t=this;e.onreadystatechange=function(){if(200===this.status&&4===this.readyState)for(var e=JSON.parse(this.responseText).words,n=[];n.length<t.numWords;){var o=Math.floor(Math.random()*e.length);-1===n.indexOf(e[o])&&-1===e[o].indexOf("-")&&(n.push(e[o]),t.definitions.push({word:e[o]}),t.getDefinition(e[o]),n.length===t.numWords&&t.newPuzzle())}},e.open("GET","http://words.g15.xyz/db"),e.send()};