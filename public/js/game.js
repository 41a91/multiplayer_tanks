class Game
{
    constructor(canvas,socket)
    {
        this.tanks = [];
        this.bullets = [];
        this.canvas = canvas;
        this.graphics = canvas.getContext("2d");
        this.localTank = null;
        this.socket = socket;

        this.tankWidth = 10;
        this.tankHeight = 10;

        var t = this;
        setInterval(function()
        {
            t.graphics.clearRect(0,0,t.canvas.width,t.canvas.height);
            t.gameLoop();
        },60);



    }
    addTank(userId,gameId,username,isLocal,x,y,hp)
    {
        var tank = new Tank(userId,gameId,username,isLocal,x,y,this.tankWidth,this.tankHeight,hp,this.canvas);
        if(isLocal)
        {
            this.localTank = tank;
        }
        else
        {
            this.tanks.push(tank);
        }

    }
    removeTank(userId)
    {
        var foundTank = this.getTank(userId);
        if(foundTank)
        {
            this.tanks = this.tanks.filter( (tank)=>{
                return tank.getUserId() !== userId;
            });
        }
        return foundTank;
    }
    getTank(userId)
    {
        var foundTank = this.tanks.filter( (tank) =>{
            return tank.getUserId() === userId;
        });
        return foundTank[0];
    }
    gameLoop()
    {
        if(this.localTank)
        {
            this.localTank.move();
            this.localTank.percDraw(this.graphics);
        }
            for(var i = 0; i < this.tanks.length; i++)
            {
                this.tanks[i].percDraw(this.graphics);
            }
            for(i = 0; i < this.bullets.length; i++)
            {
                this.bullets[i].percDraw(this.graphics);
            }
            this.socket.emit("sync",this.sendLocalTank());

    }
    sendLocalTank()
    {
        var info = {
            gameId: this.localTank.getGameId(),
            userId: this.localTank.getUserId(),
            x: this.localTank.getX(),
            y: this.localTank.getY(),
            direction: this.localTank.getDirection()
        };

        return info;
    }
    updateServerTanks(info)
    {
        var game = this;
        //TODO not sending my tank data from the server only the local tank

        info.tanks.forEach(function(tank)
        {
            console.log("tank: " ,tank);
           if(game.localTank.getUserId() === tank.id)
           {
               game.localTank.setHp(tank.hp);
               if(game.localTank.getHp() <= 0)
               {
                   game.localTank.destroy(true);
               }
           }
           else
           {
               var exists = false;

               game.tanks.forEach(function(userTank)
               {
                  if(userTank.getUserId() === tank.id)
                  {
                      userTank.setX(tank.x);
                      userTank.setY(tank.y);
                      userTank.setHp(tank.hp);
                      userTank.setDirection(tank.direction);
                      if(userTank.getHp <= 0)
                      {
                          userTank.destroy(true);
                      }
                      userTank.reposition();
                      exists = true;
                  }
                  console.log(exists);

                  if(!exists && game.localTank.getUserId() !== tank.id)
                  {
                      console.log("found the tank: " + tank.id);
                      game.addTank(tank.id,info.gameId,tank.username,false,tank.x,tank.y,tank.hp);
                  }
               });


           }

        });

    }








}