var {Bullet} = require("./bullet.js");

class GameServer
{
    constructor(id)
    {
        this.currentTanks = [];
        this.bullets = [];
        this.id = id;
    }
    addTank(id,username,kills,x,y,hp,direction)
    {
        var tank = {id,username,kills,x,y,hp,direction};
        this.currentTanks.push(tank);
    }
    addBullet(userId,gameId,x,y,isFacing,container)
    {
        var bullet = new Bullet(userId,gameId,x,y,isFacing,container);
        this.bullets.push(bullet);
    }
    removeTank(tankId)
    {
        this.currentTanks = this.currentTanks.filter(function(t)
        {
           return t.id !== tankId;
        });
    }
    hurtTank(tank)
    {
        tank.hp -= 10;
    }
    getGameId()
    {
        return this.id;
    }
    getTanks()
    {
        return this.currentTanks;
    }
    getBullets()
    {
        return this.bullets;
    }
    getBullet(id)
    {
        var foundBullet = this.bullets.filter( (bullet) =>{
            return bullet.userId === id;
        });
        return foundBullet[0];
    }
    getTank(id)
    {
        var foundTank = this.currentTanks.filter( (tank) =>{
            return tank.id === id;
        });
        return foundTank[0];
    }
    syncBullets()
    {
        var game = this;

        this.bullets.forEach(function(bullet)
        {
            if(bullet.x < 0 || bullet.x > bullet.getCanvas().width ||bullet.y < 0 || bullet.y > bullet.getCanvas().height)
            {
                bullet.setRemove(true);
            }
            else
            {
                bullet.controlBullet();
            }
        });
    }
    removeDeadTanks()
    {
        this.currentTanks = this.currentTanks.filter(function(tank)
        {
           return tank.hp > 0;
        });
    }
    removeBullets()
    {
        this.bullets = this.bullets.filter(function(bullet)
        {
           return !bullet.getRemove();
        });
    }
}

module.exports = {GameServer};