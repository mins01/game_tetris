"use strict"
var tetrisTextGame = (function(){
	var ttr = new Tetris();

	var tetrisGame = {
		"ttr":ttr,
		"init":function(){
			// this.ttr = new Tetris();
		},
		// == ttr wrapper
		"create":function(w,h){
			this.stop();
			ttr.create(w,h);
			$("#output").attr("rows",h+13)
		},
		"start":function(){
			ttr.clear()
			ttr.reset()
			ttr.start()
		},
		"stop":function(){
			ttr.stop();
		},
		"gameOver":function(){
			ttr.gameOver();
		},
		"moveX":function(x){
			ttr.moveX(x);
		},
		"moveY":function(y){
			ttr.moveY(y);
		},
		"moveBottom":function() {
			ttr.moveBottom();
		}		,
		"rotate":function(r) {
			ttr.rotate(r);
		},
		// == end ttr wrapper
		"draw":function(map,w,h,mapNext,info){

			var mapU = map.slice(0,(ttr.board.w*4));
			var mapD = map.slice(ttr.board.w*4);

			var str = "";

			str+="LEVEL : "+info.level+"\n";
			if(ttr.gaming){
				str+="SCORE : "+info.score+"\n";
			}else{
				str+="END SCORE : "+info.score+"\n";
			}

			str += "┣ＮＥＸＴ"+(new Array(w-4)).fill("━").join("")+"┫"+"\n";

			var t = []
			for(var i=0,m=4;i<m;i++){
				t = t.concat( (new Array(Math.floor((w-4)/2))).fill(0).concat(mapNext.splice(0,4)).concat((new Array(Math.ceil((w-4)/2))).fill(0)) );
			}
			mapNext = t;
			str += ttr.board.format(mapNext).replace(/0/g,'◆').replace(/,/g,'').replace(/\d/g,'□').replace(/\|/g,"┃").replace(/X/g,"│");
			str +="\n";
			str += "┣"+(new Array(w)).fill("━").join("")+"┫"+"\n";
			str += ttr.board.format(mapU).replace(/90/g,'●').replace(/80/g,'■').replace(/0/g,'▩').replace(/,/g,'').replace(/\d/g,'■').replace(/\|/g,"┃").replace(/X/g,"│");
			str +="\n";
			str += ttr.board.format(mapD).replace(/90/g,'●').replace(/80/g,'■').replace(/0/g,'□').replace(/,/g,'').replace(/\d/g,'■').replace(/\|/g,"┃").replace(/X/g,"│");;
			str +="\n";
			str += "┗"+(new Array(w)).fill("━").join("")+"┛";

			$("#output").val(str);
		},
		"onkeyDown":function(evt){
			// console.log(evt.key)
			var r = false;
			if(evt.key=='Enter'){
				if(!ttr.gaming){this.start();}	r=true;
			}else{
				if(!ttr.gaming) return;
				switch (evt.key) {
					case 'ArrowUp':
						this.rotate(1);	r=true;
					break;
					case 'ArrowLeft':
						this.moveX(-1);	r=true;
					break;
					case 'ArrowRight':
						this.moveX(1);	r=true;
					break;
					case 'ArrowDown':
						this.moveY(1);	r=true;
					break;
					case ' ':
						this.moveBottom();	r=true;
					break;
					default:
				}
			}
			if(r){
				evt.stopPropagation()
				evt.preventDefault ()
			}
			return false;
		}
	};

	// == set ttr callback
	ttr.cbOnDraw = function(map,w,h,mapNext,info){
		tetrisGame.draw(map,w,h,mapNext,info);
	}
	ttr.cbOnBottom = function(){
		// tetrisGame.sleep();
		// tetrisGame.draw();
	}
	ttr.cbOnMoveX = function(n){
		// console.log('x');
		// tetrisGame.draw();
	}
	ttr.cbOnMoveY = function(n){
		// tetrisGame.draw();
	}
	ttr.cbOnRotate = function(n){
		// tetrisGame.draw();
	}
	ttr.cbOnScore = function(newScore,gap){
		if(gap>0) this.sleep();
		console.log("scoreUP : +"+gap+ " = "+newScore)
	}
	ttr.cbOnGameOver = function(newScore,gap){
		// tetrisGame.draw();
	}
	// == end set ttr callback

	return tetrisGame;
})()
