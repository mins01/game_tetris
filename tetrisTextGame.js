var tetrisTextGame = (function(){
	var ttr = new Tetris();
	
	var timer = {
		"tm":null,
		"fn":null,
		"setFn":function(fn){
			this.fn = function(){
				fn();
			};
		},
		"start":function(interval){
			this.stop();
			setInterval(this.fn, interval);
		},
		"stop":function(){
			if(this.tm) clearInterval(this.tm);
		}
	};
	
	var tetrisTextGame = {
		"ttr":ttr,
		"timer":timer,
		"init":function(){
			this.ttr = new Tetris();
		},
		"create":function(x,y){
			ttr.create(x,y);
			// ttr.print();
			this.draw();
		},
		"start":function(){
			
		},
		"draw":function(){
			var map = ttr.getBoardMap();
			$("#output").val(ttr.board.format(map).replace(/0/g,' ').replace(/,/g,'').replace(/\d/g,'+'));
		},
		"moveX":function(x){
			ttr.moveX(x);
		},
		"moveY":function(y){
			ttr.moveY(y);
		},
		"moveBottom":function() {
			ttr.moveBottom();
		}
		,
		"rotate":function(r) {
			ttr.rotate(r);
		}
	};
	ttr.cbOnDraw = function(){
		tetrisTextGame.draw();
	}
	ttr.cbOnBottom = function(){
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
		console.log("scoreUP : +"+gap+ " = "+newScore)
	}
	
	return tetrisTextGame;
})() 
