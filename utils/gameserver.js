class GameServer
{
    constructor(id)
    {
        this.currentTanks = [];
        this.bullets = [];
        this.id = id;
    }
    addTank(id,username,kills,x,y,hp)
    {
        var tank = {id,username,kills,x,y,hp};
        this.currentTanks.push(tank);
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
    getTank(id)
    {
        var foundTank = this.currentTanks.filter( (tank) =>{
            return tank.id === id;
        });
        return foundTank[0];
    }
}

module.exports = {GameServer};