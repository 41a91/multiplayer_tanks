class Bullet
{

    constructor(bulletId,userId, gameId,x,y,width,height,container)
    {
        this.bulletId = bulletId;
        this.userId = userId;
        this.gameId = gameId;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.container = container;
        this.percX = Math.round(x/100*this.container.width);
        this.percY = Math.round(y/100*this.container.height);
        this.percW = Math.round(width/100*this.container.width);
        this.percH = Math.round(height/100*this.container.height);
        this.speed = 4;
        this.isVisible = true;
        this.remove = false;
        this.img = document.getElementById("bullet");
        if(this.percW < 1)
        {
            this.percW = 1;
        }
        if(this.percH < 1)
        {
            this.percH = 1;
        }
    }
    getX()
    {
        return this.x;
    }
    getY()
    {
        return this.y;
    }
    getPercX()
    {
        return this.percX;
    }
    getPercY()
    {
        return this.percY;
    }
    getWidth()
    {
        return this.width;
    }
    getHeight()
    {
        return this.height;
    }
    getPercW()
    {
        return this.percW;
    }
    getPercH()
    {
        return this.percH;
    }
    getGameId()
    {
        return this.gameId;
    }
    getBulletId()
    {
        return this.bulletId;
    }
    setX(x)
    {
        this.x = x;
        this.percX =  Math.round(x/100*this.container.width);
    }
    setY(y)
    {
        this.y = y;
        this.percY = Math.round(y/100*this.container.height);
    }
    setWidth(w)
    {
        this.width = w;
        this.percW = Math.round(w/100*this.container.width);
    }
    setHeight(h)
    {
        this.height = h;
        this.percH =  this.percH = Math.round(h/100*this.container.height);
    }
    setRemove(bool)
    {
        this.remove = bool;
    }
    getCenterX()
    {
        return (this.x + this.width)/2;
    }
    getCenterPercX()
    {
        return (this.percX + this.percW)/2;
    }
    getCenterY()
    {
        return (this.y + this.height)/2;
    }
    getCenterPercY()
    {
        return (this.percY + this.percH)/2;
    }
    getCenter()
    {
        return {x:this.getCenterX(), y:this.getCenterY()};
    }
    getPercCenter()
    {
        return {percX:this.getPercX(), percY:this.getCenterPercY()};
    }
    getUserId()
    {
        return this.userId;
    }
    getRemove()
    {
        return this.remove;
    }
    setVisible(bool)
    {
        this.isVisible = bool;
    }
    moveX(dx)
    {
        this.x += dx;
        this.percX += Math.round(dx/100*this.container.width);
        this.spdX = dx;
        this.spdY = 0;
    }
    moveY(dy)
    {
        this.y += dy;
        this.percY += Math.round(dy/100*this.container.height);
        this.spdY = dy;
        this.spdX = 0;
    }
    resize()
    {
        this.percX = Math.round(this.x/100*this.container.width);
        this.percY = Math.round(this.y/100*this.container.height);
        this.percW = Math.round(this.width/100*this.container.width);
        this.percH = Math.round(this.height/100*this.container.height);
        if(this.percW < 1)
        {
            this.percW = 1;
        }
        if(this.percH < 1)
        {
            this.percH = 1;
        }
    }
    draw(graphics)
    {
        if(this.isVisible)
        {
            graphics.save();
            graphics.drawImage(this.img,0,0,this.img.width,this.img.height,this.x,this.y,this.width,this.height);
            graphics.restore();
        }
    }
    percDraw(graphics)
    {
        if(this.isVisible)
        {
            graphics.save();
            graphics.drawImage(this.img,0,0,this.img.width,this.img.height,this.percX,this.percY,this.percW,this.percH);
            graphics.restore();
        }
    }
}