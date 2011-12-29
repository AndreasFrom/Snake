function Init(multiplayer) {
  SnakeGame = {};
  SnakeGame.General = {};
  SnakeGame.Fruit = {};
  SnakeGame.General.Multiplayer = multiplayer;

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  SnakeGame.General.Width = canvas.width;
  SnakeGame.General.Height = canvas.height;
  SnakeGame.General.Directions = ["up","down","right","left"];
 
  SnakeGame.Player = new Snake("#000");
  if (SnakeGame.General.Multiplayer)
    SnakeGame.Player2 = new Snake("#0000ff");
  
  SnakeGame.Fruit.Red = new Fruit("#ff0000");
  SnakeGame.Fruit.Red.Calc();
  SnakeGame.Fruit.Green = new Fruit("#00ff00");
  SnakeGame.Fruit.Green.Calc();
  SnakeGame.Fruit.Blue = new Fruit("#0000ff");
  SnakeGame.Fruit.Blue.Calc();

  SnakeGame.Fruits = [SnakeGame.Fruit.Red,SnakeGame.Fruit.Green,SnakeGame.Fruit.Blue];

  SnakeGame.General.GameLoopID = setInterval(GameLoop,10);

  window.addEventListener("keydown",doKeyDown,true);
}

function Snake(color) {
  this.X = Math.round(Math.random()*SnakeGame.General.Width);
  this.Y = Math.round(Math.random()*SnakeGame.General.Height);
  this.XArray = new Array();
  this.YArray = new Array();
  this.Direction = SnakeGame.General.Directions[Math.round(Math.random()*3)];
  this.Radius = 10;
  this.SnakeLength = 20;
  this.Velocity = 1;
  this.Score = 0;
  this.PosCount = 0;
  this.Color = color;
  this.Name = "Snake";
  
  this.Draw = function(){
    ctx.beginPath();
    ctx.fillStyle = this.Color;
    for (i=0;i<this.SnakeLength;i++) {
      ctx.rect(this.XArray[this.SnakeLength-i]-this.Radius/2,this.YArray[this.SnakeLength-i]-this.Radius/2,this.Radius,this.Radius);
    }
    ctx.fill();
  }
  
  this.Move = function(){
    switch (this.Direction) {
      case "down": if (this.Y + this.Velocity < SnakeGame.General.Height) this.Y += this.Velocity; else this.Y = 0; break;
      case "up": if (this.Y - this.Velocity > 0) this.Y -= this.Velocity; else this.Y = SnakeGame.General.Height; break;
      case "left": if (this.X - this.Velocity > 0) this.X -= this.Velocity; else this.X = SnakeGame.General.Width; break;
      case "right": if (this.X + this.Velocity < SnakeGame.General.Width) this.X += this.Velocity; else this.X = 0; break;
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
    
    this.HandleFruitCollision = function(fruit,length,score,speed) {
      if (this.X > (fruit.X-fruit.Radius) && this.X < (fruit.X+fruit.Radius) && this.Y > (fruit.Y-fruit.Radius) && this.Y < (fruit.Y+fruit.Radius)) {
        this.SnakeLength += length;
        this.Score += Math.round(score);
        this.Velocity += speed;
        fruit.Radius = 10;
        fruit.Calc();
      }
    }

    this.HandleSnakeCollision = function(collider) {
      for (i=0;i<collider.SnakeLength;i++) {
        if (collider.XArray[i] == this.X && collider.YArray[i] == this.Y) {
          collider.SnakeLength = 20;
        }
      }
    }
}

function Fruit(color){
  this.Color = color;
  this.Radius = 10;
  
  this.Calc = function() {
    this.X = Math.round(Math.random()*(SnakeGame.General.Width-this.Radius));
    this.Y = Math.round(Math.random()*(SnakeGame.General.Height-this.Radius));
  }
  
  this.Draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.Color;
    ctx.arc(this.X,this.Y,this.Radius,0,Math.PI*2,true);
    ctx.fill();
  }
}

function doKeyDown(e)
{
  switch (e.keyCode) {
    case 38:
      if (SnakeGame.Player.Direction != "down")
        SnakeGame.Player.Direction = "up";
      break;
    case 40:
      if (SnakeGame.Player.Direction != "up")
        SnakeGame.Player.Direction = "down";
      break;
    case 37:
      if (SnakeGame.Player.Direction != "right")
        SnakeGame.Player.Direction = "left";
      break;
    case 39:
      if (SnakeGame.Player.Direction != "left")
        SnakeGame.Player.Direction = "right";
      break;
  }
  if (SnakeGame.General.Multiplayer) {
    switch (e.keyCode) {
      case 87:
        if (SnakeGame.Player2.Direction != "down")
          SnakeGame.Player2.Direction = "up";
        break;
      case 83:
        if (SnakeGame.Player2.Direction != "up")
          SnakeGame.Player2.Direction = "down";
        break;
      case 65:
        if (SnakeGame.Player2.Direction != "right")
          SnakeGame.Player2.Direction = "left";
        break;
      case 68:
        if (SnakeGame.Player2.Direction != "left")
          SnakeGame.Player2.Direction = "right";
        break;
    }
  }
}

function VanishFruit(fruit) {
  if (fruit.Radius > 1)
    fruit.Radius -= 0.01;
  else {
    fruit.Radius = 10;
    fruit.Calc();
  }
}

function HandleSnake(snake,other) {
  snake.Move();
  snake.Draw();
  snake.SortTale();
  snake.HandleFruitCollision(SnakeGame.Fruit.Red,20,snake.SnakeLength,0);
  snake.HandleFruitCollision(SnakeGame.Fruit.Green,0,snake.SnakeLength*2,0);
  snake.HandleFruitCollision(SnakeGame.Fruit.Blue,40,0,0);
  if (SnakeGame.General.Multiplayer)
    snake.HandleSnakeCollision(other);
}

function GameLoop() {
  if (SnakeGame.General.Multiplayer)
    document.title = SnakeGame.Player.Name+": "+SnakeGame.Player.Score+" : "+SnakeGame.Player2.Name+": "+SnakeGame.Player2.Score;
  else
    document.title = SnakeGame.Player.Name+": "+SnakeGame.Player.Score;
  ctx.clearRect(0,0,SnakeGame.General.Width,SnakeGame.General.Height);
  
  HandleSnake(SnakeGame.Player,SnakeGame.Player2);
  if (SnakeGame.General.Multiplayer)
    HandleSnake(SnakeGame.Player2,SnakeGame.Player);

  for (i=0;i<SnakeGame.Fruits.length;i++)
    VanishFruit(SnakeGame.Fruits[i]);
  
  SnakeGame.Fruit.Red.Draw();
  SnakeGame.Fruit.Green.Draw();
  SnakeGame.Fruit.Blue.Draw();
}
