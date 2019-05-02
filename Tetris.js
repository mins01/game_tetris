"use strict"
var Tetris = (function(){
	var Tetris = function(){
		this.init();
	}

	Tetris.prototype ={
		"init":function(){
			var thisC = this
			this.block=null;
			this.ttmn.current = new Tetrimino();
			this.ttmn.next = new Tetrimino();
			this.ttmn.board = this.board;
			this.score = 0;
			this.gaming = false;
			this.moveYable = false;
			this.level.cbOnLevelUp = function(){
				thisC.resume();
			}
		},
		"onCreate":function(w,h){

		},
		"create":function(w,h){
			if(w==null) w = 10;
			if(h==null) h = 20;
			if(h<4){h = 4;}
			h+=4;//4는 테트리미노 여유 부분
			console.log("create",w,h);
			this.board.create(w,h);
			this.onCreate(w,h);
			this.reset();
		},
		"reset":function(){
			this.createTetrimino();
			this.score = 0;
			this.onScore(0,0);
			this.board.clear();

			this.timer.stop();
			this.level.level = 1;
			this.level.timer = this.timer;
			this.draw();
		},
		"timer":{
			"tm":null,
			"fn":null,
			"start":function(fn,interval){
				// console.log("timer.start")
				this.stop();
				this.tm = setInterval(function(){fn()}, interval);
			},
			"stop":function(){
				// console.log("timer.stop")
				if(this.tm != null) {
					clearInterval(this.tm);
					this.tm = null;
				}
			}
		},
		"level":{
			"level":0,
			"timer":null,
			"intervalMoveY":2000,
			"intervalSleep":1000,
			"cbOnLevelUp":function(l){
			},
			"onLevelUp":function(l){
				this.cbOnLevelUp(l)
				console.log("levelUP : ",l);
			},
			"levelUp":function(l){
				this.level = l;
				this.onLevelUp(this.level);
			},
			"checkLevelUp":function(score){
				var l = Math.floor(score/10)+1;
				if(this.level != l){
					this.levelUp(l);
					return true;
				}
				return false;
			}
		},
		"ttmn":{
			"x":0,"y":0,
			"current":null,"board":null,"next":null,
			"nextType":0,
			"create":function(){
				if(this.nextType==-1){
					this.nextType = Math.floor(Math.random()*tetriminoMaps.count+1);
				}
				this.current.create(this.nextType,0);
				this.nextType = Math.floor(Math.random()*tetriminoMaps.count+1);
				this.next.create(this.nextType,0);

				this.x = Math.floor((this.board.w-this.current.w)/2);
				this.y = 0;
			},
			"rotate":function(r){
				this.current.rotate(this.current.r+r)
			},
			"removeHundred":function(data){
				var rData = data.slice(0);
				for(var i=0,m=rData.length;i<m;i++){
					if(rData[i]==0){continue;}
					rData[i] = rData[i]%100;
				}
			}
		},
		"board":{
			"w":-1,"h":-1,
			"map":null,
			"create":function(w,h){
				this.w=w,this.h=h;
				this.map = new Array(w*h);
				this.map.fill(0);
			},
			"clear":function(){
				this.map.fill(0);
			},
			"format":function(map){
				if(map == null ) map= this.map;
				var msg = [];
				//-- k-p 배열에서 p-k 배열로 만들어서 출력
				for(var i=0,m=map.length;i<m;i+=this.w){

					var tMap = map.slice(i,i+this.w);
					for(var i2=0,m2=tMap.length;i2<m2;i2++){
						tMap[i2]= tMap[i2] % 100;
					}

					msg.push('|'+tMap.join(',')+'|');
				}
				// console.log(msg.join("\n"));
				return msg.join("\n");
			},
			"mergeWithTetrimino":function(map,ttmn_data,x,y,w,h){
				if(w==null) w = this.w;
				if(h==null) h = this.h;
				// var map = this.map.slice(0);
				for(var iy=0,my=ttmn_data.h;iy<my;iy++){
					var mapY = y+iy;
					if(mapY<0){ continue;}
					var arr = ttmn_data.map.slice(iy*ttmn_data.w,iy*ttmn_data.w+ttmn_data.w);
					// console.log(arr);
					for(var ix=0,mx=arr.length;ix<mx;ix++){
						var mapX = x+ix;
						if(arr[ix]==0){continue;}
						map[mapY*w + mapX] = arr[ix];
					}
				}
				return map
			},
			"mapWithTetrimino":function(ttmn){
				var map = this.map.slice(0);
				var ttmn_data = new Tetrimino();
				//ttmn.current.splic(0)
				ttmn_data.create(ttmn.current.type,ttmn.current.r);
				// console.log(ttmn_data.format(ttmn_data.map));
				for(var i=0,m=ttmn_data.map.length;i<m;i++){
					if(ttmn_data.map[i]!=0) ttmn_data.map[i]+=100;
				}
				return this.mergeWithTetrimino(map,ttmn_data,ttmn.x,ttmn.y);
			},
			"insertTetrimino":function(ttmn,x,y){
				if(!this.checkTetrimino(ttmn,x,y)){
					return false;
				}
				var map = this.map;
				return this.mergeWithTetrimino(map,ttmn.current,x,y);

			},
			"checkTetrimino":function(ttmn,x,y){
				var map = this.map.slice(0);
				for(var iy=0,my=ttmn.current.h;iy<my;iy++){
					var mapY = y+iy;
					if(mapY<0){ continue;}
					if(mapY>this.h){
						console.warn('checkOverTetrimino range-out Y',mapY);
						return false;
					}
					var arr = ttmn.current.map.slice(iy*ttmn.current.w,iy*ttmn.current.w+ttmn.current.w);
					// console.log(arr);
					for(var ix=0,mx=arr.length;ix<mx;ix++){
						var mapX = x+ix;
						if(arr[ix]==0){
							continue;
						}
						if(mapX < 0 || mapX >= this.w){
							console.warn('checkOverTetrimino range-out X',mapX,mapY);
							return false;
						}

						// console.log(mapX,mapY);
						if(mapY*this.w + mapX >= map.length){
							console.warn('checkOverTetrimino range-out Y 2',mapY);
							return false;
						}else if(map[mapY*this.w + mapX]!= 0){
							console.warn('checkOverTetrimino',mapX,mapY);
							return false;
						}
					}
				}
				return true;
			},
			"searchFilledRow":function(){
				var ys = [];
				var map = this.map;
				var y = 0;
				for(var i=0,m=map.length;i<m;i+=this.w){
					if(map.slice(i,i+this.w).indexOf(0)===-1){
						ys.push(y);
					}
					y++;
				}
				return ys;
			},
			"removeRows":function(ys,w,map){
				for(var i=0,m=ys.length;i<m;i++){
					map = this.removeRow(ys[i],w,map)
				}
				return map;
			},
			"removeRow":function(y,w,map){
				var rRow = map.splice(w*y,w)
				rRow.fill(0);
				map = rRow.concat(map);
				return map;
			},
			"markRemoveRows":function(ys,w,map){
				for(var i=0,m=ys.length;i<m;i++){
					map = this.markRemoveRow(ys[i],w,map)
				}
				return map;
			},
			"markRemoveRow":function(y,w,map){
				for(var i=w*y,m=w*y+w;i<m;i++){
					map[i]+=200;
				}
				return map;
			},
			"isGameOver":function(){
				var arr = null;
				for(var i=0,m=this.w*4;i<m;i+=this.w){
					arr = this.map.slice(i,i+this.w);
					for(var i2=0,m2=arr.length;i2<m2;i2++){
						if(arr[i2]!=0){
							return true
						}
					}
				}
				return false;
			}
		},
		"cbOnDraw":function(board,ttmn){
			var map = board.mapWithTetrimino(ttmn);
			console.log(board.format(map));
		},
		"onDraw":function(board,ttmn){
			this.cbOnDraw(board,ttmn);
		},
		"draw":function(){
			this.onDraw(this.board,this.ttmn);
		},
		"cbOnMoveX":function(n){

		},
		"onMoveX":function(n){
			this.cbOnMoveX(n);
			this.draw();
		},
		"moveX":function(n){
			if(!this.gaming){return;}
			if(n==0){return;}
			if(this.board.checkTetrimino(this.ttmn,this.ttmn.x+n,this.ttmn.y)){
				this.ttmn.x = this.ttmn.x+n;
				this.onMoveX(n);
			}
		},
		"cbOnScore":function(score,gap){

		},
		"onScore":function(score,gap){
			this.cbOnScore(score,gap);
			this.level.checkLevelUp(score);
			this.draw();
		},
		"cbOnBottom":function(){

		},
		"createTetrimino":function(){
			// this.ttmn.randomCreate(); //새로운 블록 만들기
			this.ttmn.create(); //새로운 블록 만들기
		},
		"onBottom":function(){
			this.board.insertTetrimino(this.ttmn,this.ttmn.x,this.ttmn.y)
			// console.log("insertTetrimino",this.ttmn.x,this.ttmn.y)
			var ys = this.board.searchFilledRow();
			if(ys.length>0){
				this.score += ys.length;
				this.onScore(this.score,ys.length);
				// console.log("삭제될 ROW",ys);
				// this.board.map = this.markRemoveRows(ys,this.board.w,this.board.map);
				this.removeRows(ys,this.board.w,this.board.map);
			}else{
				if(this.checkGameOver()){

				}else{
					this.createTetrimino();
					this.cbOnBottom();
				}
				this.sleep();
				this.draw();
			}


		},
		"fnRemoveRows":function(ys,w,map){
			var thisC = this;
			return function(){
				thisC.resume();
				console.log("removeRows");
				thisC.board.map = thisC.board.removeRows(ys,w,map)
				thisC.moveYable = true;

				thisC.sleep();
				thisC.draw();
			}
		},
		"removeRows":function(ys,w,map){
			var thisC = this;
			this.moveYable = false;

			if(thisC.checkGameOver()){

			}else{
				thisC.createTetrimino();
				thisC.cbOnBottom();
			}
			this.board.map = this.board.markRemoveRows(ys,this.board.w,this.board.map)
			this.draw();

			if(this.gaming){
				this.timer.start(this.fnRemoveRows(ys,this.board.w,this.board.map),500);
			}else{
				this.timer.stop();
			}

		},
		"cbOnMoveY":function(){

		},
		"onMoveY":function(n){
			this.cbOnMoveY();
			this.draw();
		},
		"moveY":function(n){
			if(!this.gaming||!this.moveYable){return;}
			if(n==0){return;}

			if(this.board.checkTetrimino(this.ttmn,this.ttmn.x,this.ttmn.y+n)){
				this.ttmn.y = this.ttmn.y+n;
				this.onMoveY(n);
			}else{
				this.onMoveY(n);
				this.onBottom();
			}
		},
		"moveBottom":function(){
			if(!this.gaming||!this.moveYable){return;}
			var y = this.ttmn.y;
			while(this.board.checkTetrimino(this.ttmn,this.ttmn.x,++y)){

			}
			this.ttmn.y= y-1;
			this.onBottom();
		},
		"cbOnRotate":function(r){

		},
		"onRotate":function(r){
			this.cbOnRotate(r);
			this.draw();
		},
		"rotate":function(r){
			if(r==0) return true;
			this.ttmn.rotate(r);
			if(!this.board.checkTetrimino(this.ttmn,this.ttmn.x,this.ttmn.y)){
				if(this.board.checkTetrimino(this.ttmn,this.ttmn.x-1,this.ttmn.y)){
					this.ttmn.x = this.ttmn.x-1
				}else if(this.board.checkTetrimino(this.ttmn,this.ttmn.x+1,this.ttmn.y)){
					this.ttmn.x = this.ttmn.x+1
				}else if(this.board.checkTetrimino(this.ttmn,this.ttmn.x-2,this.ttmn.y)){
					this.ttmn.x = this.ttmn.x-2
				}else if(this.board.checkTetrimino(this.ttmn,this.ttmn.x+2,this.ttmn.y)){
					this.ttmn.x = this.ttmn.x+2
				}else{
					this.ttmn.rotate(r*-1); //회전 불가
					return false;
				}
			}
			this.onRotate(r);
			return true;
		},
		"print":function(){
			var map = this.getBoardMap();
			if(map !== false){
				$("#output").val(this.board.format(map));
			}
		},
		"getBoardMap":function(){
			return this.board.mapWithTetrimino(this.ttmn);
		},
		"getTtmnNextMap":function(){
			return this.ttmn.next.map
		},
		"cbOnGameOver":function(){
			console.log("GAMEOVER");
		},
		"onGameOver":function(){
			this.gaming=false;
			this.timer.stop();
			this.cbOnGameOver();
		},
		"checkGameOver":function(){
			if(this.gaming && this.board.isGameOver()){
				this.onGameOver();
				return true;
			}
			return false;
		},
		"gameOver":function(){
			this.onGameOver();
		},
		"test":function(){
			for(var i=0,m=this.board.w;i<m-1;i++){
				this.board.map[this.board.w*(this.board.h-1) +i]=2;
			}
			this.board.map[this.board.w*(this.board.h-2) +3]=2;
			for(var i=0,m=this.board.w;i<m-1;i++){
				this.board.map[this.board.w*(this.board.h-3) +i]=2;
			}

		},
		"start":function(){
			this.reset();
			this.gaming = true;
			this.moveYable = true;
			this.resume()

		},
		"fnMoveY":function(){
			var thisC = this;
			return function(){
				// console.log("moveY(1)");
				thisC.moveY(1);
			}
		},
		"resume":function(){
			this.timer.start(this.fnMoveY(),this.level.intervalMoveY/this.level.level);
			this.draw()
		},
		"fnSleep":function(){
			var thisC = this;
			return function(){
				thisC.resume();
				console.log("sleep");
			}

		},
		"sleep":function(){
			if(this.gaming){
				this.timer.start(this.fnSleep(),this.level.intervalSleep/this.level.level);
			}else{
				this.timer.stop();
			}
		},
		"stop":function(){
			this.timer.stop();
		},

	}
	return Tetris;
})()
