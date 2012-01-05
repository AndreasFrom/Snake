var SnakeGame = (function () {

  General = {};
  Fruit = {};
  Player = {};
  Player2 = {};

  this.Init = function(_MultiPlayer) {
    General.Multiplayer = _MultiPlayer;

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    General.Width = canvas.width;
    General.Height = canvas.height;
    General.Directions = ["up","down","right","left"];

    General.FullFruitRadius = 15;
    General.FullSnakeRadius = 12;
    General.InitSnakeLength = 20;

    Player = new Snake("#000");
    if (General.Multiplayer) {
      Player2 = new Snake("#0000ff");
    }

    Fruit.Red = new Fruit("#ff0000");
    Fruit.Red.Calc();
    Fruit.Green = new Fruit("#00ff00");
    Fruit.Green.Calc();
    Fruit.Blue = new Fruit("#0000ff");
    Fruit.Blue.Calc();

    Fruits = [Fruit.Red,Fruit.Green,Fruit.Blue];

    General.GameLoopID = setInterval(GameLoop,10);

    window.addEventListener("keydown",doKeyDown,true);
  }

  this.Snake = function(_Color) {
    this.X = Math.round(Math.random()*General.Width);
    this.Y = Math.round(Math.random()*General.Height);
    this.XArray = new Array();
    this.YArray = new Array();
    this.Direction = General.Directions[Math.round(Math.random()*General.Directions.length)];
    this.Radius = General.FullSnakeRadius;
    this.SnakeLength = General.InitSnakeLength;
    this.Velocity = 1;
    this.Score = 0;
    this.PosCount = 0;
    this.Color = _Color;
    this.Name = "Snake";

    this.Draw = function(){
      ctx.beginPath();
      ctx.fillStyle = this.Color;
      for (i=0;i<this.SnakeLength;i++) {
        ctx.rect(this.XArray[this.SnakeLength-i]-this.Radius/2,this.YArray[this.SnakeLength-i],this.Radius,this.Radius);
      }
      ctx.fill();
    }

    this.Move = function(){
      switch (this.Direction) {
        case "down": if (this.Y + this.Velocity < General.Height) this.Y += this.Velocity; else this.Y = 0; break;
        case "up": if (this.Y - this.Velocity > 0) this.Y -= this.Velocity; else this.Y = General.Height; break;
        case "left": if (this.X - this.Velocity > 0) this.X -= this.Velocity; else this.X = General.Width; break;
        case "right": if (this.X + this.Velocity < General.Width) this.X += this.Velocity; else this.X = 0; break;
      }
    }

    this.SortTale = function() {
      this.XArray = this.XArray.splice(0,this.SnakeLength);
      this.YArray = this.YArray.splice(0,this.SnakeLength);
      this.XArray[this.PosCount] = this.X;
      this.YArray[this.PosCount] = this.Y;
      if (this.PosCount < this.SnakeLength)
        this.PosCount++;
      else
        this.PosCount = 0;
    }

    this.HandleFruitCollision = function(_Fruit,_Length,_Score,_Speed) {
      if ((this.X > (_Fruit.X-General.FullFruitRadius) && this.X < (_Fruit.X+General.FullFruitRadius)) && (this.Y > (_Fruit.Y-General.FullFruitRadius) && this.Y < (_Fruit.Y+General.FullFruitRadius*2))) {
        this.SnakeLength += _Length;
        this.Score += Math.round(_Score);
        this.Velocity += _Speed;
        _Fruit.Radius = General.FullFruitRadius;
        _Fruit.Calc();
      }
    }

    this.HandleSnakeCollision = function(_OtherSnake) {
      for (i=0;i<_OtherSnake.SnakeLength;i++) {
        if (_OtherSnake.XArray[i] == this.X && _OtherSnake.YArray[i] == this.Y) {
          _OtherSnake.SnakeLength = General.InitSnakeLength;
        }
      }
    }
  }

  this.Fruit = function(_Color){
    this.Color = _Color;
    this.Radius = General.FullFruitRadius;

    this.Calc = function() {
      this.X = Math.round(Math.random()*(General.Width-this.Radius));
      this.Y = Math.round(Math.random()*(General.Height-this.Radius));
    }

    this.Draw = function() {
      ctx.beginPath();
      ctx.fillStyle = this.Color;
      ctx.arc(this.X,this.Y,this.Radius,0,Math.PI*2,true);
      ctx.fill();
    }
  }

  this.doKeyDown = function(e)
  {
    switch (e.keyCode) {
      case 38:
        if (Player.Direction != "down")
          Player.Direction = "up";
        break;
      case 40:
        if (Player.Direction != "up")
          Player.Direction = "down";
        break;
      case 37:
        if (Player.Direction != "right")
          Player.Direction = "left";
        break;
      case 39:
        if (Player.Direction != "left")
          Player.Direction = "right";
        break;
    }
    if (General.Multiplayer) {
      switch (e.keyCode) {
        case 87:
          if (Player2.Direction != "down")
            Player2.Direction = "up";
          break;
        case 83:
          if (Player2.Direction != "up")
            Player2.Direction = "down";
          break;
        case 65:
          if (Player2.Direction != "right")
            Player2.Direction = "left";
          break;
        case 68:
          if (Player2.Direction != "left")
            Player2.Direction = "right";
          break;
      }
    }
  }

  this.VanishFruit = function(_Fruit) {
    if (_Fruit.Radius > 1)
      _Fruit.Radius -= 0.01;
    else {
      _Fruit.Radius = General.FullFruitRadius;
      _Fruit.Calc();
    }
  }

  this.HandleSnake = function(_Snake,_Other) {
    _Snake.Move();
    _Snake.SortTale();
    _Snake.HandleFruitCollision(Fruit.Red,General.InitSnakeLength,_Snake.SnakeLength,0);
    _Snake.HandleFruitCollision(Fruit.Green,0,_Snake.SnakeLength*2,0);
    _Snake.HandleFruitCollision(Fruit.Blue,General.InitSnakeLength*2,0,0);
    if (General.Multiplayer)
      _Snake.HandleSnakeCollision(_Other);
    _Snake.Draw();
  }

  this.GameLoop = function() {
      document.getElementById("player1").innerHTML = Player.Name + ": " + Player.Score;
    if (General.Multiplayer)
      document.getElementById("player2").innerHTML = Player2.Name + ": " + Player2.Score;
    ctx.clearRect(0,0,General.Width,General.Height);

    HandleSnake(Player,Player2);
    if (General.Multiplayer)
      HandleSnake(Player2,Player);

    for (i=0;i<Fruits.length;i++)
      VanishFruit(Fruits[i]);

    Fruit.Red.Draw();
    Fruit.Green.Draw();
    Fruit.Blue.Draw();
  }
}());
