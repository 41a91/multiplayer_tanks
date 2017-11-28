class Bullet
{
    constructor(bulletId,userId,gameId,x,y,isFacing,containerHeight,containerWidth)
    {
        this.bulletId = bulletId;
        this.userId = userId;
        this.gameId = gameId;
        this.x = x;
        this.y = y;
        this.containerHeight = containerHeight;
        this.containerWidth = containerWidth;
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
        return {height: this.containerHeight, width: this.containerWidth};
    }
    getBulletId()
    {
        return this.bulletId;
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
    getBulletInfo()
    {
        return {bulletId: this.bulletId,userId: this.userId,gameId: this.gameId,x: this.x,y: this.y,remove: this.remove};
    }
}
module.exports = {Bullet};