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
    
    var tmp = (!(General.Timer) ? General.Timer = 60 : 0);

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
  };

  this.Point = function (x,y){this.X=x;this.Y=y;};
  
  this.Snake = function(_Color) {
    this.Pos= [];
    this.Pos[0] = new Point(~~(Math.random()*General.Width),~~(Math.random()*General.Height));
    this.Direction = General.Directions[Math.round(Math.random()*3)];
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
      for (var i=0;i<this.SnakeLength;i++){
        if (this.Pos[i]) {
          ctx.rect(this.Pos[i].X-this.Radius/2,this.Pos[i].Y-this.Radius/2,this.Radius,this.Radius);
        }
      }
      ctx.fill();
    };

    this.Move = function(){
      switch (this.Direction) {
        case "down": if (this.Pos[0].Y + this.Velocity < General.Height) this.Pos[0].Y += this.Velocity; else this.Pos[0].Y = 0; break;
        case "up": if (this.Pos[0].Y - this.Velocity > 0) this.Pos[0].Y -= this.Velocity; else this.Pos[0].Y = General.Height; break;
        case "left": if (this.Pos[0].X - this.Velocity > 0) this.Pos[0].X -= this.Velocity; else this.Pos[0].X = General.Width; break;
        case "right": if (this.Pos[0].X + this.Velocity < General.Width) this.Pos[0].X += this.Velocity; else this.Pos[0].X = 0; break;
      }
      this.Pos[this.PosCount] = new Point(this.Pos[0].X,this.Pos[0].Y);
      if (this.PosCount < this.SnakeLength) {
        this.PosCount++;
      }
      else
        this.PosCount = 0;
    };

    this.HandleFruitCollision = function(_Fruit,_Length,_Score,_Speed) {
      if (this.Pos[0].X+this.Radius/2 >= (_Fruit.Pos.X-_Fruit.Radius) && this.Pos[0].X-this.Radius/2 <= (_Fruit.Pos.X+_Fruit.Radius) && this.Pos[0].Y+this.Radius/2 >= (_Fruit.Pos.Y-_Fruit.Radius) && this.Pos[0].Y-this.Radius/2 <= (_Fruit.Pos.Y+_Fruit.Radius)) {
        this.SnakeLength += _Length;
        this.Score += Math.round(_Score);
        this.Velocity += _Speed;
        _Fruit.Radius = General.FullFruitRadius;
        _Fruit.Calc();
      }
    };

    this.HandleSnakeCollision = function(_OtherSnake) {
      for (var i=1;i<_OtherSnake.SnakeLength;i++) {
        if (i != this.PosCount-1) {
          if (_OtherSnake.Pos[i]) {
            if (this.Pos[0].X == _OtherSnake.Pos[i].X && this.Pos[0].Y == _OtherSnake.Pos[i].Y) {
              _OtherSnake.SnakeLength = General.InitSnakeLength+1;
              _OtherSnake.Pos = _OtherSnake.Pos.splice(0,General.InitSnakeLength);
            }
          }
        }
      }
    };
  };

  this.Fruit = function(_Color){
    this.Color = _Color;
    this.Radius = General.FullFruitRadius;

    this.Calc = function() {
      this.Pos = new Point(Math.random()*(General.Width-this.Radius),Math.random()*(General.Height-this.Radius));
    };

    this.Draw = function() {
      ctx.beginPath();
      ctx.fillStyle = this.Color;
      ctx.arc(this.Pos.X,this.Pos.Y,this.Radius,0,Math.PI*2,true);
      ctx.fill();
    };
  };

  this.doKeyDown = function(e)
  {
    switch (e.keyCode) {
      case 38: (Player.Direction != "down" ? Player.Direction = "up" : 0); break;
      case 40: (Player.Direction != "up" ? Player.Direction = "down" : 0); break;
      case 37: (Player.Direction != "right" ? Player.Direction = "left" : 0); break;
      case 39: (Player.Direction != "left" ? Player.Direction = "right" : 0); break;
    }
    if (General.Multiplayer) {
      switch (e.keyCode) {
        case 87: (Player2.Direction != "down" ? Player2.Direction = "up" : 0); break;
        case 83: (Player2.Direction != "up" ? Player2.Direction = "down" : 0); break;
        case 65: (Player2.Direction != "right" ? Player2.Direction = "left" : 0); break;
        case 68: (Player2.Direction != "left" ? Player2.Direction = "right" : 0); break;
      }
    }
  };

  this.VanishFruit = function(_Fruit) {
    if (_Fruit.Radius > 1)
      _Fruit.Radius -= 0.01;
    else {
      _Fruit.Radius = General.FullFruitRadius;
      _Fruit.Calc();
    }
  };

  this.HandleSnake = function(_Snake,_Other) {
    _Snake.Move();
    _Snake.HandleFruitCollision(Fruit.Red,General.InitSnakeLength,_Snake.SnakeLength,0);
    _Snake.HandleFruitCollision(Fruit.Green,0,_Snake.SnakeLength*2,0);
    _Snake.HandleFruitCollision(Fruit.Blue,General.InitSnakeLength*2,0,0);
    _Snake.HandleSnakeCollision(_Snake);
    if (General.Multiplayer)
      _Snake.HandleSnakeCollision(_Other);
    _Snake.Draw();
  };

  this.SecToStr = function(sec)
  {
    sec = Math.abs(sec);
    var minutes = ~~(sec / 60),rsec = sec - (minutes * 60);
    return (minutes < 10 ? "0"+minutes : minutes) + ":"+ (rsec < 10 ? "0"+rsec : rsec);
  };

  this.GameLoop = function() {
    ctx.clearRect(0,0,General.Width,General.Height);

    HandleSnake(Player,Player2);
    if (General.Multiplayer)
      HandleSnake(Player2,Player);

    for (var i=0;i<Fruits.length;i++)
      VanishFruit(Fruits[i]);

    if (General.Timer > 0) {
      General.Timer -= 0.01;
      document.getElementById("timer").innerHTML = SecToStr(~~(General.Timer));
    }
    else
      clearInterval(General.GameLoopID);

    Fruit.Red.Draw();
    Fruit.Green.Draw();
    Fruit.Blue.Draw();
  };
}());
