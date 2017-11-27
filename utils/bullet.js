class Bullet
{
    constructor(userId,gameId,x,y,isFacing,container)
    {
        this.userId = userId;
        this.gameId = gameId;
        this.x = x;
        this.y = y;
        this.container = container;
        this.speed = 4;
        this.direction = isFacing;
        this.remove = false;
    }
    setRemove(bool)
    {
        this.remove = bool;
    }
    getCanvas()
    {
        return this.container;
    }
    controlBullet()
    {
        if(this.direction === "up")
        {
            this.y -= this.speed;
        }
        if(this.direction === "down")
        {
            this.y += this.speed;
        }
        if(this.direction === "left")
        {
            this.x -= this.speed;
        }
        if(this.direction === "right")
        {
            this.x += this.speed;
        }
    }
    getRemove()
    {
        return this.remove;
    }
}
module.exports = {Bullet};