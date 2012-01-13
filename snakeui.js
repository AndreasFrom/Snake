var SnakeGameUI = (function() {
  this.DisplayPlayer2 = function() {
    Multiplayer = document.getElementById("multiplayer").checked;
    var player2 = document.getElementById("player2controls");

    if (Multiplayer) {
      player2.style.visibility = "visible";
    }
    else
  player2.style.visibility = "hidden";
  SwitchColor();
  }

  this.SwitchColor = function() {
   var color1 =  document.getElementById("player1color");
   var color2 =  document.getElementById("player2color");
      if (color1.value == color2.value) {
        color1.style.border = 'solid 2px red';
        color2.style.border = 'solid 2px red';
        return true;
      }
      else {
        color1.style.border = 'solid 2px green';
        color2.style.border = 'solid 2px green';
      }
  }

  this.StartGame = function () {

    Multiplayer = document.getElementById("multiplayer").checked;

    var name1 = document.getElementById("player1name").value;
    var color1 = document.getElementById("player1color").value;
    var color2 = false, name2 = false;

    if (Multiplayer) {
      name2 = document.getElementById("player2name").value;
      color2 = document.getElementById("player2color").value;
      document.getElementById("player1color").style.border = "solid 2px red";
      document.getElementById("player2color").style.border = "solid 2px red";

      var player2 = document.getElementById("player2");
      player2.style.color = color2;
      if (SwitchColor()) {return};
    }
    
    var player1 = document.getElementById("player1");
    player1.style.color = color1;

    document.body.removeChild(document.getElementById("controls"));

    document.getElementById("score").style.visibility = "visible";


    window.setInterval(function(){
      player1.innerHTML = name1 + ": " + Player.Score;
      if (Multiplayer) {
        player2.innerHTML = name2 + ": " + Player2.Score;
      }
    },10);
    Init(Multiplayer,color1,name1,color2,name2);
}
}());

document.addEventListener("DOMContentLoaded",SnakeGameUI,false);
