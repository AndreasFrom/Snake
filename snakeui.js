var SnakeGameUI = (function() {
  this.DisplayPlayer2 = function() {
    Multiplayer = document.getElementById("multiplayer").checked;
    var player2 = document.getElementById("player2");

    if (Multiplayer) {
      player2.style.visibility = "visible";
    }
    else
  player2.style.visibility = "hidden";
  }

  this.StartGame = function () {
    Multiplayer = document.getElementById("multiplayer").checked;
    Init(Multiplayer);
    Player.Name = document.getElementById("player1name").value;
    Player.Color = document.getElementById("player1color").value;
    if (Multiplayer) {
      Player2.Name = document.getElementById("player2name").value;
      Player2.Color = document.getElementById("player2color").value;
    }
    document.getElementById("controls").style.visibility = "hidden";
    document.getElementById("player2").style.visibility = "hidden";
  }
}());
