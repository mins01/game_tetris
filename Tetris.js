var Tetris = (function(){
	var Tetris = function(){
		this.init();
	}

	Tetris.prototype ={
		"init":function(){
			var thisC = this
			this.block=null;
			this.ttmn.data = new Tetrimino();
			this.ttmn.nextData = new Tetrimino();
			this.ttmn.board = this.board;
			this.score = 0;
			this.gaming = false;
			this.level.cbOnLevelUp = function(){
				thisC.resume();
			}
		},
		"create":function(w,h){
			if(w==null) w = 10;
			if(h==null) h = 20;
			if(h<4){h = 4;}
			h+=4;//4는 테트리미노 여유 부분
			console.log("create",w,h);
			this.board.create(w,h);
			// this.ttmn.randomCreate();
			this.reset();

		},
		"reset":function(){
			this.createTetrimino();
			this.score = 0;
			this.onScore(0,0);
			this.board.clear();
			this.draw();
			this.timer.stop();
			this.level.level = 1;
			this.level.timer = this.timer;
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
			"intervalSleep":2000,
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
			"data":null,"board":null,
			"nextType":0,
			"create":function(){
				if(this.nextType==-1){
					this.nextType = Math.floor(Math.random()*tetriminoMaps.count+1);
				}
				this.data.create(this.nextType,0);
				this.nextType = Math.floor(Math.random()*tetriminoMaps.count+1);
				this.nextData.create(this.nextType,0);

				this.x = Math.floor((this.board.w-this.data.w)/2);
				this.y = 0;
			},
			"rotate":function(r){
				this.data.rotate(this.data.r+r)
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
					// if(i/this.w < 4){
					// 	msg.push('X'+map.slice(i,i+this.w).join(',')+'X');
					// }else{
					// 	msg.push('|'+map.slice(i,i+this.w).join(',')+'|');
					// }
					msg.push('|'+map.slice(i,i+this.w).join(',')+'|');
				}
				// console.log(msg.join("\n"));
				return msg.join("\n");
			},
			"mergeWithTetrimino":function(map,ttmn,x,y){
				// var map = this.map.slice(0);
				for(var iy=0,my=ttmn.data.h;iy<my;iy++){
					var mapY = y+iy;
					if(mapY<0){ continue;}
					var arr = ttmn.data.map.slice(iy*ttmn.data.w,iy*ttmn.data.w+ttmn.data.w);
					// console.log(arr);
					for(var ix=0,mx=arr.length;ix<mx;ix++){
						var mapX = x+ix;
						if(arr[ix]==0){continue;}
						map[mapY*this.w + mapX] = arr[ix];
					}
				}
				return map
			},
			"mapWithTetrimino":function(ttmn){
				var map = this.map.slice(0);
				return this.mergeWithTetrimino(map,ttmn,ttmn.x,ttmn.y);
			},
			"insertTetrimino":function(ttmn,x,y){
				if(!this.checkTetrimino(ttmn,x,y)){
					return false;
				}
				var map = this.map;
				return this.mergeWithTetrimino(map,ttmn,x,y);

			},
			"checkTetrimino":function(ttmn,x,y){
				var map = this.map.slice(0);
				for(var iy=0,my=ttmn.data.h;iy<my;iy++){
					var mapY = y+iy;
					if(mapY<0){ continue;}
					if(mapY>this.h){
						console.warn('checkOverTetrimino range-out Y',mapY);
						return false;
					}
					var arr = ttmn.data.map.slice(iy*ttmn.data.w,iy*ttmn.data.w+ttmn.data.w);
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
				this.board.map = this.board.removeRows(ys,this.board.w,this.board.map);
			}
			if(this.checkGameOver()){

			}else{
				this.createTetrimino();
				this.cbOnBottom();
			}
			this.sleep();
			this.draw();

		},
		"cbOnMoveY":function(){

		},
		"onMoveY":function(n){
			this.cbOnMoveY();
			this.draw();
		},
		"moveY":function(n){
			if(this.board.checkTetrimino(this.ttmn,this.ttmn.x,this.ttmn.y+n)){
				this.ttmn.y = this.ttmn.y+n;
				this.onMoveY(n);
			}else{
				this.onMoveY(n);
				this.onBottom();
			}
		},
		"moveBottom":function(){
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
			return this.ttmn.nextData.map
		},
		"cbOnGameOver":function(){
			console.log("GAMEOVER");
		},
		"onGameOver":function(){
			this.timer.stop();
			this.cbOnGameOver();
		},
		"checkGameOver":function(){
			if(this.board.isGameOver()){
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
			this.gaming = true;
			this.timer.start(this.fnMoveY(),this.level.intervalMoveY/this.level.level);
		},
		"sleep":function(){
			var thisC = this;
			if(this.gaming){
				this.timer.start(function(){
					thisC.resume();
					console.log("sleep");
				},1000);
			}else{
				this.timer.stop();
			}

		},
		"stop":function(){
			this.gaming = false;
			this.timer.stop();
		},

	}
	return Tetris;
})()
