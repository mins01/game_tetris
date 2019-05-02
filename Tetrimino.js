var Tetrimino = (function(){
	var Tetrimino = function(){
		this.init();
	}
	Tetrimino.prototype = {
		"init":function(){
			this.type = 0;
			this.r = -1; //0~3 
			this.w = -1;
			this.h = -1;
			this.r = 0;
			this.map = [];
			this.type = 0;
		},
		"randomCreate":function(){
			var type = Math.floor(Math.random()*tetriminoMaps.count+1);
			this.create(type,0);
		},
		"create":function(type,r){
			this.type = type;
			this.r = r;
			this.w = tetriminoMaps[this.type].w
			this.h = tetriminoMaps[this.type].h
			this.map = tetriminoMaps[this.type].map[this.r].slice(0);
		},
		"rotate":function(r){
			this.r = (4+r)%4;
			this.map = tetriminoMaps[this.type].map[this.r].slice(0);
		},
		"format":function(map){
			var msg = [];
			//-- k-p 배열에서 p-k 배열로 만들어서 출력
			for(var i=0,m=map.length;i<m;i+=this.w){
				msg.push(map.slice(i,i+this.w).join(','));
			}
			return msg.join("\n");	
		},
		"print":function(){
			var msg = [];
			//-- k-p 배열에서 p-k 배열로 만들어서 출력
			for(var i=0,m=this.map.length;i<m;i+=this.w){
				msg.push('|'+this.map.slice(i,i+this.w).join(',')+'|');
			}
			console.log(msg.join("\n"));	
		}
	}
	
return Tetrimino;
})()