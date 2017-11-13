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


    }
    addTank(userId,username,isLocal,x,y,hp)
    {
        var tank = new Tank(userId,username,isLocal,x,y,this.tankWidth,this.tankHeight,hp,this.canvas);
        if(isLocal)
        {
            this.localTank = tank;
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








}