var {Bullet} = require("./bullet.js");

class GameServer
{
    constructor(id)
    {
        this.currentTanks = [];
        this.bullets = [];
        this.id = id;
        this.currentBullet = 0;
    }
    addTank(id,username,kills,x,y,hp,direction)
    {
        var tank = {id,username,kills,x,y,hp,direction};
        this.currentTanks.push(tank);
    }
    addBullet(userId,gameId,x,y,isFacing,containerHeight,containerWidth)
    {
        this.currentBullet++;
        var bullet = new Bullet(this.currentBullet,userId,gameId,x,y,isFacing,containerHeight,containerWidth);
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
        var bullets = [];
        this.bullets.forEach(function(bullet)
        {
           bullets.push(bullet.getBulletInfo());
        });
        return bullets;
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
            if(bullet.x < -5 || bullet.x > bullet.getCanvas().width ||bullet.y < -5 || bullet.y > bullet.getCanvas().height)
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