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
        this.bulletWidth = 2;
        this.bulletHeight = 2;

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
            console.log("found local tank");
            tank.setSocket(this.socket);
            this.localTank = tank;
        }
        else
        {
            this.tanks.push(tank);
        }

    }
    addBullet(bulletId,userId,gameId,x,y)
    {
        var bullet = new Bullet(bulletId,userId,gameId,x,y,this.bulletWidth,this.bulletHeight,this.canvas);
        this.bullets.push(bullet);
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
            if(!this.localTank.destroyed())
            {
                this.socket.emit("sync",this.sendLocalTank());
            }
        this.removeBullets();
        this.removeDeadTanks();

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
        info.tanks.forEach(function(tank)
        {
           if(game.localTank.getUserId() == tank.id)
           {
               game.localTank.setHp(tank.hp);
               game.localTank.setLastBulletHit(tank.lastBulletHit);
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
                  if(userTank.getUserId() == tank.id)
                  {
                      userTank.setX(tank.x);
                      userTank.setY(tank.y);
                      userTank.setHp(tank.hp);
                      userTank.setDirection(tank.direction);
                      userTank.setLastBulletHit(tank.lastBulletHit);
                      if(userTank.getHp <= 0)
                      {
                          userTank.destroy(true);
                      }
                      userTank.reposition();
                      exists = true;
                  }
               });
               if(!exists && game.localTank.getUserId() != tank.id)
               {
                   game.addTank(tank.id,info.gameId,tank.username,false,tank.x,tank.y);
               }
           }

        });

        info.bullets.forEach(function(bullet)
        {
           var bulletExists = false;
           game.bullets.forEach(function(clientBullet)
           {
              if(bullet.bulletId === clientBullet.getBulletId())
              {
                  clientBullet.setX(bullet.x);
                  clientBullet.setY(bullet.y);
                  clientBullet.setRemove(bullet.remove);
                  bulletExists = true;
              }
           });
           if(!bulletExists)
           {
            game.addBullet(bullet.bulletId,bullet.userId,bullet.gameId,bullet.x,bullet.y);
           }
        });

    }
    removeBullets()
    {
        this.bullets = this.bullets.filter(function(bullet)
        {
            return !bullet.getRemove();
        });
    }
    removeDeadTanks()
    {
        var game = this;
        var deadTanks = this.tanks.filter(function(tank)
        {
            return tank.hp <= 0;
        });
        deadTanks.forEach(function(tank)
        {
            game.socket.emit("updateScores",{killedBy:tank.getLastBulletHit(),gameId:tank.getGameId()});
        });
        this.tanks = this.tanks.filter(function(tank)
        {
            return tank.hp > 0;
        });
    }
    getLocalTankHp()
    {
        return this.localTank.getHp();
    }


}