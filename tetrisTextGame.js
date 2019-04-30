var tetrisTextGame = (function(){
	var ttr = new Tetris();

	var tetrisTextGame = {
		"ttr":ttr,
		"init":function(){
			this.ttr = new Tetris();
		},
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
		"draw":function(){
			var map = ttr.getBoardMap();
			var mapU = map.slice(0,(ttr.board.w*4));
			var mapD = map.slice(ttr.board.w*4);
			var ttmnNextMap = ttr.getTtmnNextMap();
			var str = "";

			str+="ＳＣＯＲＥ　：　"+ttr.score+"\n";
			str += "┗━ＮＥＸＴ"+(new Array(ttr.board.w-5)).fill("━").join("")+"┛"+"\n";
			var nextTtmn = ttr.ttmn.nextData.format(ttmnNextMap).replace(/0/g,'　').replace(/,/g,'').replace(/\d/g,'■')
			if(ttr.ttmn.nextData.h==2){
				str +="\n";
				str += nextTtmn
				str +="\n";
			}else if(ttr.ttmn.nextData.h==3){
				str +="\n";
				str += nextTtmn;
			}else{
				str += nextTtmn;
			}
			str +="\n";
			str += "┏"+(new Array(ttr.board.w)).fill("━").join("")+"┓"+"\n";
			str += ttr.board.format(mapU).replace(/0/g,'▤').replace(/,/g,'').replace(/\d/g,'■').replace(/\|/g,"┃").replace(/X/g,"│")+"\n";
			// str += "┠"+(new Array(ttr.board.w)).fill("▽").join("")+"┨"+"\n";
			str += ttr.board.format(mapD).replace(/0/g,'□').replace(/,/g,'').replace(/\d/g,'■').replace(/\|/g,"┃").replace(/X/g,"│");;
			str +="\n";
			str += "┗"+(new Array(ttr.board.w)).fill("━").join("")+"┛"+"\n";

			$("#output").val(str);
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
		"gameOver":function(){
			this.stop();
			setTimeout(function(){ alert("GameOver"); } ,0);
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
		tetrisTextGame.gameOver()
	}


	return tetrisTextGame;
})()
