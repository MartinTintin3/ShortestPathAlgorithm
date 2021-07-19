(()=>{"use strict";var t;!function(t){t[t.AIR=0]="AIR",t[t.WALL=1]="WALL",t[t.PATH=2]="PATH",t[t.START=3]="START",t[t.FINISH=4]="FINISH"}(t||(t={}));var e=function(){function e(e,n,r,i){this.number=0,this.wasPath=!1,this.type=e,this.x=n,this.y=r,this.board=i,e==t.PATH&&(this.wasPath=!0)}return e.prototype.getNeighbors=function(){var t=new Array;return this.x>0&&t.push(this.board.grid[this.x-1][this.y]),this.x<this.board.grid.length-1&&t.push(this.board.grid[this.x+1][this.y]),this.y>0&&t.push(this.board.grid[this.x][this.y-1]),this.y<this.board.grid[0].length-1&&t.push(this.board.grid[this.x][this.y+1]),t},e}(),n=function(){function n(n,r){this.width=n.canvas.width,this.height=n.canvas.height,this.columns=Math.floor(this.width/r),this.rows=Math.floor(this.height/r),this.ctx=n,this.cellLength=r,this.grid=new Array;for(var i=0;i<this.columns;i++){this.grid.push([]);for(var o=0;o<this.rows;o++){var h=t.AIR;0==i&&0==o?h=t.START:i==this.columns-1&&o==this.rows-1&&(h=t.FINISH),this.grid[i][o]=new e(h,i,o,this)}}}return n.prototype.forEachCell=function(t){var e=this;this.grid.forEach((function(n,r){return n.forEach((function(n,i){return t(e.grid[r][i])}))}))},n.prototype.clearBoard=function(e){this.fillBoard(t.AIR,e),this.forEachCell((function(t){return t.number=0}))},n.prototype.fillBoard=function(e,n){this.forEachCell((function(r){n.includes(r.type)||(r.wasPath=e==t.PATH,r.type=e)}))},n.prototype.findCells=function(t){var e=new Array;return this.grid.forEach((function(n){return n.filter(t).forEach((function(t){return e.push(t)}))})),e},n.prototype.renderCell=function(e,n){var r="";switch(this.grid[e][n].type){case t.AIR:this.ctx.fillStyle="white",r="black";break;case t.WALL:this.ctx.fillStyle="black",r="white";break;case t.START:this.ctx.fillStyle="red",r="white";break;case t.FINISH:this.ctx.fillStyle="green",r="black";break;case t.PATH:this.ctx.fillStyle="yellow",r="black"}this.ctx.clearRect(e*this.cellLength,n*this.cellLength,this.cellLength,this.cellLength),this.ctx.strokeStyle="gray",this.ctx.fillRect(e*this.cellLength,n*this.cellLength,this.cellLength,this.cellLength),this.ctx.strokeRect(e*this.cellLength,n*this.cellLength,this.cellLength,this.cellLength),this.ctx.fillStyle=r;var i=e*this.cellLength;switch(this.grid[e][n].number.toString().length){case 1:i+=this.cellLength/3;break;case 2:i+=this.cellLength/4;break;case 4:i+=this.cellLength/5.5}this.ctx.fillText(this.grid[e][n].number.toString(),i,n*this.cellLength+this.cellLength/4.5*3,this.cellLength)},n.prototype.render=function(){var t=this,e=Date.now();this.forEachCell((function(e){t.renderCell(e.x,e.y)}));var n=Date.now();console.log("Rendered all cells in: "+(n-e)/1e3+" seconds")},n.prototype.export=function(){return this.import(this.grid.map((function(t){return t.map((function(t){return t.type})).join(",")})).join(":")),this.grid.map((function(t){return t.map((function(t){return t.type})).join(",")})).join(":")},n.prototype.import=function(n){var r=this,i=function(t,e){for(var n=0,r=e.length,i=t.length;n<r;n++,i++)t[i]=e[n];return t}([",",":"],Object.keys(t).filter((function(t){return!isNaN(parseInt(t))})));if(!n.split("").every((function(t){return i.includes(t)})))return!1;var o=n.split(":");return o.length==this.columns&&!!o.every((function(t){return t.includes(",")&&t.split(",").length==r.rows}))&&(o.forEach((function(n,i){return n.split(",").forEach((function(n,o){r.grid[i][o]=new e(t[t[parseInt(n)]],i,o,r)}))})),this.render(),!0)},n}(),r=function(){function e(t){this.board=t}return e.prototype.map=function(e){var n=this;if(!this.board.findCells((function(e){return e.type==t.START})).length||!this.board.findCells((function(e){return e.type==t.FINISH})).length)return!1;this.board.forEachCell((function(e){e.number=0,e.type==t.PATH&&(e.type=t.AIR)})),this.board.render();for(var r=[this.board.findCells((function(e){return e.type==t.START}))[0]],i=new Array,o=Date.now();!i.find((function(e){return e.type==t.FINISH}))&&r.length;)i=new Array,r.forEach((function(r){r.getNeighbors().filter((function(e){return 0==e.number&&![t.START,t.WALL].includes(e.type)})).forEach((function(t){t.number=r.number+1,e&&n.board.renderCell(t.x,t.y),i.push(t)}))})),r=Object.assign([],i);if(!r.length)return this.board.forEachCell((function(t){return t.number=0})),this.board.render(),!1;var h=Date.now();return console.log("Found finish in: "+(h-o)/1e3+" seconds"),e||this.board.render(),!0},e.prototype.path=function(e){if(!this.board.findCells((function(e){return e.type==t.START})).length||!this.board.findCells((function(e){return e.type==t.FINISH})).length)return!1;this.board.render();for(var n=this.board.findCells((function(e){return e.type==t.FINISH}))[0];n.type!=t.START;){var r=n.getNeighbors().filter((function(e){return e.type==t.START||e.type==t.AIR&&e.number>0})).sort((function(t,e){return t.number-e.number}))[0];if(!r)return!1;if(r.type==t.START){if(e)return this.board.renderCell(r.x,r.y),!0;n=r}else r.type=t.PATH,e&&this.board.renderCell(r.x,r.y),n=r}return e||this.board.render(),!0},e}(),i=document.getElementById("canvas"),o=i.getContext("2d");o.translate(.5,.5);var h=new n(o,20),l=new r(h),s=-1;h.render(),document.getElementById("clear-btn").onclick=function(){h.clearBoard([t.START,t.FINISH]),h.render()},document.getElementById("force-render-btn").onclick=function(){h.render()},document.getElementById("find-path-btn").onclick=function(){if(!l.map(!0))return alert("Could not find a path(Mapping)");l.path(!0)||alert("Could not find a path(Pathing)")},i.addEventListener("contextmenu",(function(t){return t.preventDefault()}));var c=function(t,e,n){this.button=t,this.clientX=e,this.clientY=n};window.onmouseup=function(){s=-1},window.onmousedown=function(t){s=t.button,a(new c(s,t.clientX,t.clientY))},window.onmousemove=function(t){s>=0&&a(new c(s,t.clientX,t.clientY))};var a=function(e){var n=e.clientX-i.getBoundingClientRect().x,r=e.clientY-i.getBoundingClientRect().y;if(!(n<=0||r<=0||n>i.width||r>i.height)){var o=Math.floor(n/h.cellLength),l=Math.floor(r/h.cellLength);switch(null==h.grid[o][l]&&console.log("invalid location"),e.button){case 0:if([t.START,t.FINISH,t.WALL].includes(h.grid[o][l].type))break;h.grid[o][l].type==t.PATH&&(h.grid[o][l].wasPath=!0),h.grid[o][l].type=t.WALL;break;case 2:if(h.grid[o][l].type!=t.WALL)break;h.grid[o][l].type=h.grid[o][l].wasPath?t.PATH:t.AIR;break;default:return}h.renderCell(o,l)}};document.getElementById("export-btn").onclick=function(){var t=document.getElementById("export-textarea");t.hidden=!1,t.value=h.export(),t.select()},document.getElementById("export-textarea").addEventListener("focusout",(function(){document.getElementById("export-textarea").hidden=!0})),document.getElementById("import-btn").onclick=function(){var t=prompt("Paste your board data here(Use the export button to get the board data):");t&&(h.import(t)||alert("Invalid data"))}})();