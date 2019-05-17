"use strict"
var tetrisBoxGame = function(){
	var ttr = new Tetris();

	var tetrisGame = {
		"title":"",
		"player":1,
		"keyboard":0, //0:화살표, 1:wadsx , 2:NUMPAD 84652
		"gamepad":0, //게임페드
		"ttr":ttr,
		"ab":null,
		"init":function(ttrbg_id){
			// this.ttr = new Tetris();
			this.$ttrbg = $("#"+ttrbg_id+".ttrbg");
			this.$textLevel = $("#"+ttrbg_id+" .textLevel");
			this.$textScore = $("#"+ttrbg_id+" .textScore");
			this.$textRemovedBlocks = $("#"+ttrbg_id+" .textRemovedBlocks");
			this.$textUsedTetriminoes = $("#"+ttrbg_id+" .textUsedTetriminoes");
			this.ab = new AppearBox($("#"+ttrbg_id+" .appear-box").get(0));
			this.ab.showAnmation = 'bounceInDown';
			this.ab.hideAnmation = 'bounceOutUp';
			this.ab.contentText("Tetris").show(0);
			
		},
		"onresize":function(){
			var rs = document.body.getBoundingClientRect()
			// var rs = this.$ttrbg.parents(".gameBox").get(0).getBoundingClientRect()
			// var rs2 = document.querySelector("#container").getBoundingClientRect()
			var rs2 = this.$ttrbg.parents(".gameBox").get(0).getBoundingClientRect()
			var ft = Math.max(4,Math.min(Math.floor((rs2.width-10)/ttr.board.w),Math.floor((rs.height-20)/(ttr.board.h+4))))
			this.$ttrbg.css("fontSize",ft+'px');
			// this.$ttrbg.css("width",(ttr.board.w*ft)+'px').css("height",((ttr.board.h+4)*ft)+'px');
			console.log("fontSize",ft);


			var $ttrbgReady = this.$ttrbg.find(".ready");
			var $ttrbgEnd = this.$ttrbg.find(".end");
			$ttrbgReady.css("width",(ttr.board.w*ft)+'px').css("height",(4*ft)+'px');
			$ttrbgEnd.css("width",(ttr.board.w*ft)+'px').css("height",((ttr.board.h-4)*ft)+'px');

		},
		"divs":[],
		"nextDivs":[],
		"$ttrbg":null,
		"isMapReady":false,
		// == ttr wrapper
		"create":function(w,h){
			this.ab.stop().clear().show(-1,'none').contentText('Tetris',-1);
			this.isMapReady = false;
			ttr.create(w,h);
			this.ab.show(10,'rubberBand').contentText('Tetris Ready\n'+w+'x'+h,10).show(10,'rubberBand');
		},
		"cbOnCreate":function(w,h){
			this.isMapReady = true;
			
			this.stop();
			var $ttrbgReady = this.$ttrbg.find(".ready");
			var $ttrbgEnd = this.$ttrbg.find(".end");
			this.nextDivs = this.$ttrbg.find(".next div").get();
			$ttrbgReady.html('');
			$ttrbgEnd.html('');
			var n = w*4;
			while(n-- > 0){
				$ttrbgReady.append('<div class="box box-ready"></div>')
			}
			n = w*h;
			while(n-- > 0){
				$ttrbgEnd.append('<div class="box box-end"></div>')
			}
			this.divs = this.$ttrbg.find(".ready div , .end div").get();

			$ttrbgReady.css('gridTemplateColumns','repeat('+w+',1fr)')
			.css('gridTemplateRows','repeat('+(4)+',1fr)')

			$ttrbgEnd.css('gridTemplateColumns','repeat('+w+',1fr)')
			.css('gridTemplateRows','repeat('+h+',1fr)')
			// this.$ttrbg.css('width',w+'em')
			// var ft = Math.max(8,Math.min(Math.floor(300/w),Math.floor(480/(h+4))))
			// ttr.create(w,h);
			this.onresize()
		},
		"start":function(){
			ttr.stop()
			ttr.clear()
			ttr.goalRemove90 = 0;
			ttr.ttmn.nextTypes = [];
			ttr.reset()
			// this.makeStage();
			this.ab.stop().clear().contentText('Ready',10).show(10,'none')
			.contentText('Go!',1000)
			.hide(1000)
			.add(function(){
				ttr.start()
			},0)
			.contentText('',0)
		},
		"stage":0,
		"startStage":function(stage){
			this.stage = stage==null?1:stage;
			ttr.stop()
			// ttr.clear()
			ttr.reset()
			ttr.makeStage(this.stage);
			this.ab.stop().clear().contentText('Stage '+(this.stage),0).show(0,'none')
			.contentText('Go!',1000)
			.hide(0)
			.add(function(){
				ttr.start()
			},0)
			.contentText('',0)
		},
		"nextStage":function(){
			if(!ttr.makeStage(this.stage+1)){
				ttr.gameOver();
				return;
			}else{
				
			}
			this.ab.stop().clear().show(0,'none').contentText('Next Stage '+(this.stage+1),0)
			.contentText('Go!',1000)
			.hide(0)
			.add(function(){
				tetrisGame.stage++;
				ttr.start();
			},0)
			.contentText('',0)
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
			if(!this.isMapReady){return;}
			var map = ttr.getBoardMap();
			var mapU = map.slice(0,(ttr.board.w*4));
			var mapD = map.slice(ttr.board.w*4);
			var ttmnNextMap = ttr.getTtmnNextMap();
			
			
			
			for(var i=0,m=map.length;i<m;i++){
				if(this.divs[i]._v!=map[i]){
					var n = map[i]%100;
					$(this.divs[i]).attr('data-moving',Math.floor((map[i]-n)/100)).attr('data-color',n).prop('_v',map[i]);					
				}

			}
			this.$ttrbg.attr("data-gaming",ttr.gaming?1:0);


			var mapNext = (new Array(4*4)).fill(0);
			var x = Math.floor((4-ttr.ttmn.next.w)/2);
			var y = (ttr.ttmn.next.w==2)?1:(ttr.ttmn.next.w==3)?1:0;
			mapNext = ttr.board.mergeWithTetrimino(mapNext,ttr.ttmn.next,x,y,4,4);

			for(var i=0,m=mapNext.length;i<m;i++){
				// this.divs[i].innerText = map[i];
				// $(this.nextDivs[i]).attr('data-color',mapNext[i]%100);
				// 
				if(this.nextDivs[i]._v!=mapNext[i]){
					// var n = map[i]%100;
					$(this.nextDivs[i]).attr('data-color',mapNext[i]%100).prop('_v',mapNext[i]);					
				}
				
			}


			this.$textLevel.text(ttr.level.level)
			this.$textScore.text(ttr.info.score)
			this.$textRemovedBlocks.text(ttr.info.removedBlocks)
			this.$textUsedTetriminoes.text(ttr.info.usedTetriminoes)

		},
		"onkeyDown":function(evt){
			// console.log(evt.key,evt.keyCode)
			if(!ttr.gaming) return;
			var r = false;
			//0:화살표, 1:wadsx , 2:NUMPAD 84652
			if(this.keyboard==0){
				switch (evt.key) {
					case 'ArrowUp':	this.rotate(1);	r=true; break;
					case 'ArrowLeft': this.moveX(-1);	r=true; break;
					case 'ArrowRight': this.moveX(1);	r=true; break;
					case 'ArrowDown': this.moveY(1);	r=true; break;
					case ' ': this.moveBottom();	r=true; break;
				}
			}else if(this.keyboard==1){
				switch (evt.key) {
					case 'w':	this.rotate(1);	r=true; break;
					case 'a': this.moveX(-1);	r=true; break;
					case 'd': this.moveX(1);	r=true; break;
					case 's': this.moveY(1);	r=true; break;
					case 'x': this.moveBottom();	r=true; break;
				}
			}else if(this.keyboard==2){
				switch (evt.keyCode) {
					case 104:	this.rotate(1);	r=true; break;
					case 100: this.moveX(-1);	r=true; break;
					case 102: this.moveX(1);	r=true; break;
					case 101: this.moveY(1);	r=true; break;
					case 98: this.moveBottom();	r=true; break;
				}
			}

			if(r){
				evt.stopPropagation()
				evt.preventDefault ()
			}
			return false;
		},
		"cbOnRemoveRows":function(ys,w,map){

		},
		"beAttacked":function(cnt){
			ttr.beAttacked(cnt);
		}
	};

	// == set ttr callback
	ttr.cbOnCreate = function(w,h){
		tetrisGame.cbOnCreate(w,h);
	}
	ttr.cbOnDraw = function(){
		tetrisGame.draw();
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
		//진동
		if(GamepadHandler){
			switch(gap){
				case 4:setTimeout(function(){ GamepadHandler.strongRumble(tetrisGame.gamepad,100) },600);
				case 3:setTimeout(function(){ GamepadHandler.strongRumble(tetrisGame.gamepad,100) },400);
				case 2:setTimeout(function(){ GamepadHandler.strongRumble(tetrisGame.gamepad,100) },200);
				case 1:GamepadHandler.strongRumble(tetrisGame.gamepad,100);
				break;
			}
		}

	}
	ttr.cbOnGameOver = function(newScore,gap){
		if(GamepadHandler){
			GamepadHandler.strongRumble(tetrisGame.gamepad,1000)
		}
		tetrisGame.draw();
		ttr.stop()
		tetrisGame.ab.stop().clear().contentHtml('<big>GAMEOVER</big>',-1).show(0)
	}
	ttr.cbOnGoal = function(){
		if(GamepadHandler){
			GamepadHandler.strongRumble(tetrisGame.gamepad,1000)
		}
		tetrisGame.draw();
		ttr.stop()
		tetrisGame.ab.stop().clear().contentHtml('<big>🏆Clear!!🏆</big>',-1).show(0)
		.add(function(){
			tetrisGame.nextStage();
		},1000)
	}

	ttr.cbOnRemoveRows = function(ys,w,map){
		tetrisGame.cbOnRemoveRows(ys,w,map);
	}
	// == end set ttr callback

	return tetrisGame;
}
