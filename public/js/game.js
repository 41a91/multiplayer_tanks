class Game
{
    constructor(canvas)
    {
        this.tanks = [];
        this.bullets = [];
        this.canvas = canvas;
        this.graphics = canvas.getContext("2d");
        this.localTank = null;

        this.tankWidth = 50;
        this.tankHeight = 50;

        var t = this;
        setInterval(function()
        {
            t.gameLoop();
        },60);



    }
    addTank(userId,username,isLocal,x,y,hp)
    {
        var tank = new Tank(userId,username,isLocal,x,y,this.tankWidth,this.tankHeight,hp,this.canvas);
        if(isLocal)
        {
            console.log("tanks: ",tank);
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
            this.localTank.draw(this.graphics);
        }
            for(var i = 0; i < this.tanks.length; i++)
            {
                this.tanks[i].draw(this.graphics);
            }
            for(i = 0; i < this.bullets.length; i++)
            {
                this.bullets[i].draw(this.graphics);
            }
            console.log("game is running");
    }








}