var Tetris = (function(){
	var Tetris = function(){

	}
	
	Tetris.prototype ={
		"init":function(w,h){
			if(w==null) w = 10;
			if(h==null) h = 24; //4는 여유부분
			this.block=null;
			this.board.create(w,h);
			this.ttmn.data = new Tetrimino();
			// this.ttmn.randomCreate();
			this.ttmn.create();
			this.score = 0;
		},
		"ttmn":{
			"x":0,"y":0,
			"data":null,
			"randomCreate":function(){
				this.data.randomCreate(1,0);
				this.x = 0;
				this.y = 0;
			},
			"create":function(){
				this.data.create(1,0);
				this.x = 0;
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
			"print":function(map){
				if(map == null ) map= this.map;
				var msg = [];
				//-- k-p 배열에서 p-k 배열로 만들어서 출력
				for(var i=0,m=map.length;i<m;i+=this.w){
					msg.push('|'+map.slice(i,i+this.w).join(',')+'|');
				}
				// console.log(msg.join("\n"));	
				return msg.join("\n");
			},
			"mapWithTetrimino":function(ttmn,x,y){
				if(!this.checkTetrimino(ttmn,x,y)){
					// return false;
				}
				var map = this.map.slice(0);
				for(var iy=0,my=ttmn.data.h;iy<my;iy++){
					var mapY = y+iy;
					if(mapY<0){ continue;}
					var arr = ttmn.data.map.slice(iy*ttmn.data.w,iy*ttmn.data.w+ttmn.data.w);	
					console.log(arr);
					for(var ix=0,mx=arr.length;ix<mx;ix++){
						var mapX = x+ix;
						if(arr[ix]==0){continue;}
						map[mapY*this.w + mapX] = arr[ix];
					}
				}
				return map
			},
			"insertTetrimino":function(ttmn,x,y){
				if(!this.checkTetrimino(ttmn,x,y)){
					return false;
				}
				var map = this.map;
				for(var iy=0,my=ttmn.data.h;iy<my;iy++){
					var mapY = y+iy;
					if(mapY<0){ continue;}
					var arr = ttmn.data.map.slice(iy*ttmn.data.w,iy*ttmn.data.w+ttmn.data.w);	
					console.log(arr);
					for(var ix=0,mx=arr.length;ix<mx;ix++){
						var mapX = x+ix;
						if(arr[ix]==0){continue;}
						map[mapY*this.w + mapX] = arr[ix];
					}
				}
				this.print(map);
			},
			"checkTetrimino":function(ttmn,x,y){
				// var x = ttmn.x;
				// var y = ttmn.y;
				var map = this.map.slice(0);
				for(var iy=0,my=ttmn.data.h;iy<my;iy++){
					var mapY = y+iy;
					if(mapY<0){ continue;}
					if(mapY>this.h){
						console.error('checkOverTetrimino range-out Y',mapY);
						return false;
					}
					var arr = ttmn.data.map.slice(iy*ttmn.data.w,iy*ttmn.data.w+ttmn.data.w);	
					console.log(arr);
					for(var ix=0,mx=arr.length;ix<mx;ix++){
						var mapX = x+ix;
						if(arr[ix]==0){
							continue;
						}
						if(mapX < 0 || mapX >= this.w){
							console.error('checkOverTetrimino range-out X',mapX,mapY);
							return false;
						}
						
						console.log(mapX,mapY);
						if(mapY*this.w + mapX >= map.length){
							console.error('checkOverTetrimino range-out Y 2',mapY);
							return false;
						}else if(map[mapY*this.w + mapX]!= 0){
							console.error('checkOverTetrimino',mapX,mapY);
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
		},
		"moveX":function(n){
			if(this.board.checkTetrimino(this.ttmn,this.ttmn.x+n,this.ttmn.y)){
				this.ttmn.x = this.ttmn.x+n;
			}
		},
		"onBottom":function(){
			this.board.insertTetrimino(this.ttmn,this.ttmn.x,this.ttmn.y)
			console.log("insertTetrimino",this.ttmn.x,this.ttmn.y)
			var ys = this.board.searchFilledRow();
			if(ys.length>0){
				console.log("삭제될 ROW",ys);
				this.board.map = this.board.removeRows(ys,this.board.w,this.board.map);
			}
			
			// this.ttmn.randomCreate(); //새로운 블록 만들기
			this.ttmn.create(); //새로운 블록 만들기
		},
		"moveY":function(n){
			if(this.board.checkTetrimino(this.ttmn,this.ttmn.x,this.ttmn.y+n)){
				this.ttmn.y = this.ttmn.y+n;
			}else{
				this.onBottom();
			}
		},
		"toBottom":function(){
			var y = this.ttmn.y;
			while(this.board.checkTetrimino(this.ttmn,this.ttmn.x,++y)){
				
			}
			this.ttmn.y= y-1;
			this.onBottom();
		},
		"rotate":function(r){
			if(r==0) return;
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
					this.ttmn.rotate(r*-1);	
				}
				
			}
			return false;
		},
		"print":function(){
			var map = this.board.mapWithTetrimino(this.ttmn,this.ttmn.x,this.ttmn.y);
			if(map !== false){
				$("#output").val(this.board.print(map));
			}			
		},
		"test":function(){
			for(var i=0,m=this.board.w;i<m-1;i++){
				this.board.map[this.board.w*(this.board.h-1) +i]=2;	
			}
			this.board.map[this.board.w*(this.board.h-2) +3]=2;	
			for(var i=0,m=this.board.w;i<m-1;i++){
				this.board.map[this.board.w*(this.board.h-3) +i]=2;	
			}
			
		}
		
	}
	return Tetris;
})()