"use strict"
var tetrisTextGame = (function(){
	var ttr = new Tetris();

	var tetrisTextGame = {
		"ttr":ttr,
		"init":function(){
			this.ttr = new Tetris();
		},
		// == ttr wrapper
		"create":function(x,y){
			this.stop();
			ttr.create(x,y);
			$("#output").attr("rows",y+13)
		},
		"start":function(){
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
		"draw":function(){
			var map = ttr.getBoardMap();
			var mapU = map.slice(0,(ttr.board.w*4));
			var mapD = map.slice(ttr.board.w*4);
			var ttmnNextMap = ttr.getTtmnNextMap();
			var str = "";

			str+="LEVEL : "+ttr.level.level+"\n";
			if(ttr.gaming){
				str+="SCORE : "+ttr.score+"\n";
			}else{
				str+="END SCORE : "+ttr.score+"\n";
			}

			str += "┣ＮＥＸＴ"+(new Array(ttr.board.w-4)).fill("━").join("")+"┫"+"\n";
			var mapNext = (new Array(ttr.board.w*4)).fill(0);
			var ttmn = {
				"data":ttr.ttmn.nextData
			}
			var x = Math.floor((ttr.board.w-ttr.ttmn.nextData.w)/2);
			var y = (ttr.ttmn.nextData.w==2)?1:(ttr.ttmn.nextData.w==3)?1:0;
			mapNext = ttr.board.mergeWithTetrimino(mapNext,ttmn,x,y);
			// console.log(mapNext);
			str += ttr.board.format(mapNext).replace(/0/g,'◆').replace(/,/g,'').replace(/\d/g,'□').replace(/\|/g,"┃").replace(/X/g,"│");
			str +="\n";
			str += "┣"+(new Array(ttr.board.w)).fill("━").join("")+"┫"+"\n";
			str += ttr.board.format(mapU).replace(/0/g,'▩').replace(/,/g,'').replace(/\d/g,'■').replace(/\|/g,"┃").replace(/X/g,"│");
			str +="\n";
			str += ttr.board.format(mapD).replace(/0/g,'□').replace(/,/g,'').replace(/\d/g,'■').replace(/\|/g,"┃").replace(/X/g,"│");;
			str +="\n";
			str += "┗"+(new Array(ttr.board.w)).fill("━").join("")+"┛";

			$("#output").val(str);
		},
		"onkeyDown":function(evt){
			// console.log(evt.key)
			if(!ttr.gaming) return;
			var r = false;
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
			if(r){
				evt.stopPropagation()
				evt.preventDefault ()
			}
			return false;
		}
	};

	// == set ttr callback
	ttr.cbOnDraw = function(){
		tetrisTextGame.draw();
	}
	ttr.cbOnBottom = function(){
		// tetrisTextGame.sleep();
		// tetrisTextGame.draw();
	}
	ttr.cbOnMoveX = function(n){
		// console.log('x');
		// tetrisTextGame.draw();
	}
	ttr.cbOnMoveY = function(n){
		// tetrisTextGame.draw();
	}
	ttr.cbOnRotate = function(n){
		// tetrisTextGame.draw();
	}
	ttr.cbOnScore = function(newScore,gap){
		if(gap>0) this.sleep();
		console.log("scoreUP : +"+gap+ " = "+newScore)
	}
	ttr.cbOnGameOver = function(newScore,gap){
		tetrisTextGame.draw();
	}
	// == end set ttr callback

	return tetrisTextGame;
})()
