"use strict"
/**
 * GamepadLayout
 * @type {Object}
 * 한글
 */
var GamepadLayout = {
  "btnHis":[],
  "axesHis":[],
  "init":function(){
    window.addEventListener("gamepadconnected", this.connect);
    window.addEventListener("gamepaddisconnected", this.disconnect);
    // window.addEventListener("load", this.drawLayout);
    this.btnHis = new Array(30);
    this.btnHis.fill(0);
    this.axesHis = new Array(30);
    this.axesHis.fill(0);
  },
  "boxes":function(idx,div){

  },
  "controller":[null,null,null,null,null,null],
  "connect":function(evt){
    // GamepadLayout.controller[evt.gamepad.index] = evt.gamepad;
    console.log('Gamepad connected.');
    // console.log(GamepadLayout.controller);
    GamepadLayout.drawLayout()
    GamepadLayout.startInterval(1);
  },
  "disconnect":function(evt){
    delete GamepadLayout.controller;
    console.log('Gamepad disconnected.');
    GamepadLayout.startInterval(0);
  },
  "drawLayout":function(){
    var gs = navigator.getGamepads();
    console.log('gamepad count',gs.length)
    $(".gamepads").html('');
    for(var i=0,m=gs.length;i<m;i++){
      $(".gamepads").append('<li class="list-group-item"><div class="gamepad gamepad-'+i+'" data-type="xbox" style="margin:0 auto;"></div></li>');
      var $div = $(".gamepad-"+i);
      $div.attr('data-type','null').attr('data-index',i).html('')
      console.log('clear ',i)
      if(!gs[i]) continue;
      var gp = gs[i];
      if(gp.id.toLowerCase().indexOf('xbox')>-1){
        $div.attr('data-type','xbox');
      }else{
        $div.attr('data-type','usb');
      }

      for(var i2=0,m2=gp.buttons.length;i2<m2;i2++){
        // console.log('.gamepad-'+i+' .buttons-'+i2);
        $div.append('<div class="before-label after-label infobox button button-'+i2+'" data-label="btn #'+i2+'"></div>')
      }
      for(var i2=0,m2=gp.axes.length;i2<m2;i2++){
        $div.append('<div class="before-label after-label infobox axes axes-'+i2+'" data-label="axes #'+i2+'"><input type="range" data-label="axes #'+i2+'"  value="0" step="0.01" min="-1" max="1" disabled  /></div>');
      }
      $div.append('<div class="infoboxes">\
        <div class="before-label after-label info info-id" data-label="id"></div>\
        <div class="before-label after-label info info-index" data-label="index"></div>\
        <div class="before-label after-label info info-mapping" data-label="mapping"></div>\
        <div class="before-label after-label info info-connected" data-label="connected"></div>\
        <div class="before-label after-label info info-timestamp" data-label="timestamp"></div>\
        <button type="button" name="button" class="btn btn-sm btn-info testRumble" onclick="GamepadLayout.testRumble($(this).parents(\'.gamepad\').attr(\'data-index\'))">test Rumble</button>\
        </div>'

      );


    }
  },
  "tm":null,
  "startInterval":function(b){
    var thisC = this;
    if(this.tm){
      clearInterval(this.tm);
    }
    if(b){
      this.tm = setInterval(function(){ thisC.sync()} ,10)
    }else{
      this.sync();
    }

  },

  "sync":function(){
    var tm = (new Date()).getTime();
    var c = navigator.getGamepads();
    var gp = c[0]


    for(var i2=0,m2=gp.axes.length;i2<m2;i2++){

      if(tm-this.axesHis[i2] > 200){
        this.axesHis[i2] = tm;
        var v = gp.axes[i2];
        // console.log(v)
        if(v>0.5){
          v = 1
        }else if(v<-0.5){
          v = -1
        }else{
          this.axesHis[i2] = 0;
          v = 0
        }

        if(this.axesHis[i2] != v){

          switch(i2){
            case 0:;
              ttrtg.moveX(v);
            break;
            case 1:;
              ttrtg.moveY(v);
            break;
            case 2:;
              ttrtg.rotate(v);
            break;
          }
        }
      }

    }
    for(var i2=0,m2=gp.buttons.length;i2<m2;i2++){
      if(gp.buttons[i2].pressed){
        if(tm-this.btnHis[i2] > 200){
          this.btnHis[i2] = tm;
          switch(i2){
            case 14:
            case 4:
              ttrtg.moveX(-1);
            break;
            case 15:
            case 5:
              ttrtg.moveX(1);
            break;
            case 13:
              ttrtg.moveY(1);
            break;
            case 2:
            case 3:
            case 6:
              ttrtg.rotate(-1);
            break;
            case 1:
            case 7:
            case 12:
              ttrtg.rotate(1);
            break;
            case 0:
              ttrtg.moveBottom(1);
            break;
            case 9:
              ttrtg.start();
            break;
            case 8:
              ttrtg.gameOver();
            break;
          }
        }
      }else{
        this.btnHis[i2] = 0;
      }
    }

  },
  "testRumble":function(idx){
    var gs = navigator.getGamepads();;
    console.log(gs);
    if(!gs[idx]){
      console.log('fail : testRumble',idx)
      alert('fail : testRumble '+idx)
      return false;
    }
    var g = gs[idx];
    if(!g.vibrationActuator){
      console.log('fail : g.vibrationActuator ',idx)
      alert('fail : g.vibrationActuator '+idx)
      return false;
    }
    g.vibrationActuator.playEffect(g.vibrationActuator.type, {
        startDelay: 100,
        duration: 2000,
        weakMagnitude: 0.5,
        strongMagnitude: 1
    });
    console.log('playEffect : testRumble',idx)
  }

}
