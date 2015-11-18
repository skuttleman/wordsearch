function WordSearch(e){this.numWords=e.numWords,this.directions=e.directions,this.reversable=e.reversable,this.definitions=[],this.callBack=e.callBack,this.getWords()}function drill(e){for(var t=0;t<(e.results||[]).length;t++)for(var r=e.results[t],n=0;n<(r.senses||[]).length;n++)for(var o=r.senses[n],a=0;a<(o.definition||[]).length;n++){var i=o.definition[a];if(i)return i}}function drawGrid(e){$(".puzzle").remove(),loadStub({parent:".puzzle-container",file:"./stubs/puzzle.html",params:{puzzle:e}})}function drawWordList(e){$(".word-list").remove();var t=deepCopy(e);t.sort(function(e,t){return t.word<e.word}),loadStub({parent:".word-list-container",file:"./stubs/word_list.html",params:{key:t}},function(){$(".words").click(showDefinition);for(var t=0;t<e.length;t++)e[t].selected&&highlightCells({vector:e[t],mode:"add",classes:["selected"]})})}function drawPuzzle(e){drawGrid(e.grid),drawWordList(deepCopy(e.key).sort()),saveLocal()}function getPuzzleRowCol(e,t){var r=($(".puzzle"),$(".puzzle-cell--0-0")),n=Math.floor((t-r.position().top)/(r.height()*mainPuzzle.puzzle.grid.length)*mainPuzzle.puzzle.grid.length),o=Math.floor((e-r.position().left)/(r.height()*mainPuzzle.puzzle.grid.length)*mainPuzzle.puzzle.grid.length);return{row:n,col:o}}function loadStub(e,t){if(e.html){var r=Handlebars.compile(e.html);$(e.parent).append(r(e.params)),t&&t()}else $.get(e.file,function(r){loadStub({html:r,parent:e.parent,params:e.params,blowout:e.blowout},t)});fitPuzzle()}function animateBooleans(){[{element:".switch-backwards",checkbox:".backwards"},{element:".switch-diagonal",checkbox:".diagonal"}].forEach(function(e){var t=$(e.element),r=$(e.checkbox)[0].checked;t.animate({left:r?0:t.parent().width()-t.width()},animSpeed/5)})}function hideMenu(e){$(".menu-container").animate({top:"-100vh"},animSpeed,e),menuDisplayed=!1,$(".cheering").remove()}function showMenu(){animateBooleans(),$(".menu-container").animate({top:"50px"},animSpeed),menuDisplayed=!0}function fitPuzzle(){if(mainPuzzle){var e=$(".puzzle-cell").css("font-size");$(".word-list-container h2").css("font-size","calc(1 * "+e+")"),$(".word-list-container li").css("font-size","calc(0.7 * "+e+")")}}function chomp(e){var t=Array.prototype.filter.call(e.target.classList,function(e){return e.indexOf("--")+1})[0];if(t){var r=t.split("--")[1].split("-");return 2===r.length?{row:parseInt(r[0]),col:parseInt(r[1])}:{}}}function puzzleDown(e){e.preventDefault(),dragTrack={},dragTrack.start=chomp(e)}function puzzleDrag(e){e.preventDefault(),dragTrack&&dragTrack.start&&(dragTrack.end=e.originalEvent.touches?getPuzzleRowCol(e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY):chomp(e),highlightCells({classes:["selecting"],mode:"clear"}),dragTrack=highlightCells({vector:dragTrack,classes:["selecting"],mode:"add"}))}function puzzleUp(e){if(e.preventDefault(),dragTrack&&dragTrack.start&&dragTrack.end)for(var t=mainPuzzle.puzzle.key,r=0;r<t.length;r++)t[r].start.row!==dragTrack.start.row||t[r].start.col!==dragTrack.start.col||t[r].end.row!==dragTrack.end.row||t[r].end.col!==dragTrack.end.col||t[r].selected||(t[r].selected=!0,$("."+t[r].word).addClass("found"),makeCellList(dragTrack),saveLocal(),highlightCells({vector:dragTrack,classes:["selected"],mode:"add"}),r=t.length,isPuzzleFinished())}function highlightCells(e){if("clear"!==e.mode){var t=makeCellList(e.vector);if(t){if(0===t.length)return{};var r={start:{},end:{}};for(r.start.row=t[0][0],r.start.col=t[0][1],r.end.row=t[t.length-1][0],r.end.col=t[t.length-1][1],i=0;i<e.classes.length;i++)for(var n=0;n<t.length;n++){var o=t[n][0],a=t[n][1];"add"===e.mode?$(".puzzle-cell--"+o+"-"+a).addClass(e.classes[i]):$(".puzzle-cell--"+o+"-"+a).removeClass(e.classes[i])}}return r}for(var i=0;i<e.classes.length;i++)$(".puzzle-cell").removeClass(e.classes[i])}function makeCellList(e){function t(e,t){return e>t?-1:e===t?0:1}if(e.start&&e.end){var r=Math.abs(Math.abs(e.start.row)-Math.abs(e.end.row)),n=Math.abs(Math.abs(e.start.col)-Math.abs(e.end.col)),o=Math.max(r,n)+1,a=n/2>r?0:1,i=r/2>n?0:1;a*=t(e.start.row,e.end.row),i*=t(e.start.col,e.end.col);for(var l=[],s=deepCopy(e.start),d=0;o>d;d++)l.push([s.row,s.col]),s.row+=a,s.col+=i;return l}}function saveLocal(){localStorage.wordsearch=JSON.stringify(mainPuzzle),localStorage.diagonal=$(".diagonal")[0].checked,localStorage.backwards=$(".backwards")[0].checked,localStorage["num-words"]=$(".num-words").val()}function isPuzzleFinished(){for(var e=0;e<mainPuzzle.puzzle.key.length;e++)if(!mainPuzzle.puzzle.key[e].selected)return;localStorage.wordsearch="",$(".main").append('<audio autoplay="autoplay" class="cheering nevershown"><source src="./sounds/cheering.mp3" type="audio/mpeg" /></audio>'),popUp("Congratulations! You finished this puzzle!",showMenu)}function popUp(e,t){$(".modal-message").html(e),$(".modal-container").show(),$(".modal-button").focus(),modalCallback=t}function showDefinition(e){var t=e.target.innerText,r=WordSearch.prototype.whatIsDefinition.call(mainPuzzle,t);popUp(t+": "+r)}function blankPuzzle(e,t){for(var r=[],n=0;e>n;n++){for(var o=[],a=0;e>a;a++)o.push(t);r.push(o.slice())}return r}function deepCopy(e){var t=e instanceof Array?[]:{};for(var r in e)"object"==typeof e[r]?t[r]=deepCopy(e[r]):t[r]=e[r];return t}function randomLetter(){var e=Math.floor(26*Math.random());return"ABCDEFGHIJKLMNOPQRSTUVWXYZ"[e]}function resize(e,t,r){for(var n=deepCopy(e);n.length<t;)n.push([]);for(var o=0;o<n.length;o++)for(;n[o].length<t;)n[o].push(r);return n}function stepDirection(e){return"vertical"===e?{rowStep:1,colStep:0}:"diagonal up"===e?{rowStep:-1,colStep:1}:"diagonal down"===e?{rowStep:1,colStep:1}:{rowStep:0,colStep:1}}function insert(e){e=deepCopy(e);for(var t=stepDirection(e.direction),r=deepCopy(e.start),n={row:r.row+t.rowStep*(e.word.length-1),col:r.col+t.colStep*(e.word.length-1)},o={start:e.reverse?n:r,end:e.reverse?r:n,word:e.word,reverse:!!e.reverse},a=0;a<e.word.length;a++){var i=e.grid[e.start.row][e.start.col],l=e.reverse?e.word[e.word.length-(a+1)].toUpperCase():e.word[a].toUpperCase();if("-"===i)e.grid[e.start.row][e.start.col]=l;else if(i!==l)return!1;e.start.row+=t.rowStep,e.start.col+=t.colStep}return{grid:e.grid,key:o}}function fillRandom(e){for(var t=deepCopy(e),r=0;r<t.length;r++)for(var n=0;n<t[r].length;n++)"-"===t[r][n]&&(t[r][n]=randomLetter());return t}function range(e,t,r){for(var n=[],o=e;o<t+(Number(r)||0);o++)n.push(o);return n}function combinationRanges(e,t,r){for(var n=[],o=0;o<e.length;o++)for(var a=0;a<t.length;a++)n.push({row:e[o],col:t[a],direction:r});return n}function getMatrix(e,t,r){var n="diagonal up"===r?t.length-1:0,o=0,a="horizontal"===r||"diagonal up"===r?e.length-1:e.length-t.length,i="vertical"===r?e.length-1:e.length-t.length;return combinationRanges(range(n,a,!0),range(o,i,!0),r)}function concatMatrices(e,t,r,n){for(var o=[],a=0;a<r.length;a++)o=n?o.concat(getMatrix(e,t,r[a]).randomize()):o.concat(getMatrix(e,t,r[a]));return o}function addWord(e){for(var t=!1,r=e.grid;!t;){r=resize(r,e.word.length+1,"-");for(var n=concatMatrices(r,e.word,e.directions.shuffle(),!0),o=0;o<n.length;o++){var a=insert({start:{row:n[o].row,col:n[o].col},direction:n[o].direction,word:e.word,grid:r,reverse:e.reversable?Math.floor(2.2*Math.random()):!1});a&&(t=!0,r=a.grid,o=n.length,e.key.push(a.key))}t||(r=resize(r,r.length+1,"-"))}return{grid:r,key:e.key}}function makePuzzle(e){var t=e.words.sort(function(e,t){return t.length-e.length}),r={};e.directions.sort();for(var n=0;n<t.length;n++)r=addWord({grid:r.grid||[],key:r.key||[],directions:e.directions,word:t[n],reversable:e.reversable});return{grid:fillRandom(r.grid),key:r.key}}WordSearch.prototype.addDefinition=function(e,t){for(var r=0;r<this.definitions.length;r++)this.definitions[r].word===e&&(this.definitions[r].definition=t,r=this.definitions.length)},WordSearch.prototype.getDefinition=function(e){var t=this,r={},n=drill(r)||"no definition found";t.addDefinition(e,n)},WordSearch.prototype.whatIsDefinition=function(e){for(var t=0;t<this.definitions.length;t++)if(e===this.definitions[t].word)return this.definitions[t].definition||"definition look-up in progress...";return"broken"},WordSearch.prototype.newPuzzle=function(){this.puzzle=makePuzzle({directions:this.directions,reversable:this.reversable,words:this.definitions.map(function(e){return e.word})});for(var e=0;e<this.puzzle.key.length;e++)for(var t=0;t<this.definitions.length;t++)this.definitions[t].word===this.puzzle.key[e].word&&(this.puzzle.key[e].definition=this.definitions[t].definition,t=this.definitions.length);this.callBack(this.puzzle)},WordSearch.prototype.getWords=function(){var e=new XMLHttpRequest,t=this;e.onreadystatechange=function(){if(200===this.status&&4===this.readyState)for(var e=JSON.parse(this.responseText).words,r=[];r.length<t.numWords;){var n=Math.floor(Math.random()*e.length);-1===r.indexOf(e[n])&&(r.push(e[n]),t.definitions.push({word:e[n]}),t.getDefinition(e[n]),r.length===t.numWords&&t.newPuzzle())}},e.open("GET","/words.json"),e.send()};var mainPuzzle,dragTrack={},minWordCount=10,maxWordCount=50,menuDisplayed=!1,modalCallback,animSpeed=400;$(function(){$(".menu-button").click(function(e){e.preventDefault(),menuDisplayed?window.hideMenu():window.showMenu()}),$(".switch-diagonal, .switch-backwards").on("mousedown",function(e){$target=$("."+this.className.split("-")[1]),$target[0].checked=!$target[0].checked,animateBooleans()}),$(".diagonal")[0].checked="true"===localStorage.diagonal?!0:!1,$(".backwards")[0].checked="true"===localStorage.backwards?!0:!1,$(".num-words").val(localStorage["num-words"]||"15");var e=localStorage.wordsearch;e?(mainPuzzle=JSON.parse(e),drawPuzzle(mainPuzzle.puzzle)):$(".menu-button").click(),$(".puzzle-container").on("mousedown touchstart",puzzleDown).on("mousemove touchmove",puzzleDrag).on("mouseup touchend",puzzleUp),$(".submit-form").click(function(e){e.preventDefault();var t=$(".diagonal").is(":checked")?["diagonal up","diagonal down"]:[],r=["horizontal","vertical"].concat(t),n=$(".backwards").is(":checked"),o=parseInt($(".num-words").val());isNaN(o)||minWordCount>o||o>maxWordCount?popUp("The number of words must be a number between "+minWordCount+" and "+maxWordCount+"!"):($(".puzzle-container").html('<p class="puzzle">Loading new puzzle...</p>'),hideMenu(function(){mainPuzzle=new WordSearch({directions:r,numWords:o,reversable:n,callBack:drawPuzzle})}))}),$(".puzzle-options").on("keypress",function(e){13===e.keyCode&&e.preventDefault(),$(".submit-form")[0].click()}),$(".modal-button").on("click",function(e){e.preventDefault(),$(".modal-container").hide(),modalCallback&&modalCallback(),modalCallback=null})}),window.onresize=fitPuzzle,$(document).on("mouseup touchend",function(e){highlightCells({classes:["selecting"],mode:"clear"}),dragTrack={}}),Array.prototype.randomize=function(){return this.sort(function(){return Math.floor(2*Math.random())?-1:1}),this},Array.prototype.shuffle=function(){return this.push(this.shift()),this};var module=module||{};module.exports={blankPuzzle:blankPuzzle,deepCopy:deepCopy,randomLetter:randomLetter,resize:resize,stepDirection:stepDirection,insert:insert,fillRandom:fillRandom,range:range,combinationRanges:combinationRanges,concatMatrices:concatMatrices,getMatrix:getMatrix};