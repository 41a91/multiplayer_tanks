class Tank
{
    constructor(userId,username,isLocal,x,y,w,h,hp,container)
    {
        this.userId = userId;
        this.username = username;
        this.isLocal = isLocal;
        this.container = container;
        this.x = x;
        this.y = y;
        this.percX = Math.round(x/100*this.container.width);
        this.percY = Math.round(y/100*this.container.height);
        this.width = w;
        this.height = h;
        this.percW = Math.round(w/100*this.container.width);
        this.percH = Math.round(h/100*this.container.height);
        this.spdX = 0;
        this.spdY = 0;
        this.isVisible = true;
        this.dead = false;
        this.isFacing = "right";
        this.dir = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        this.hp = hp;
        this.img = null;

        if(this.percW < 1)
        {
            this.percW = 1;
        }
        if(this.percH < 1)
        {
            this.percH = 1;
        }
        if(this.isLocal)
        {
            this.setControls();
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
    getUsername()
    {
        return this.username;
    }
    setImg(img)
    {
        this.img = img;
    }
    setLoc(x,y)
    {
        this.setX(x);
        this.setY(y);
    }
    setVisible(bool)
    {
        this.isVisible = bool;
    }
    setDead(bool)
    {
        this.dead = bool;
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
    getSpdX()
    {
        return this.spdX;
    }
    getSpdY()
    {
        return this.spdY;
    }
    contains(x,y)
    {
        return x >= this.x && x <= this.x+this.width && y >= this.y && y <= this.y+this.height;
    }
    percContains(x,y)
    {
        return x >= this.percX && x <= this.percX+this.percW && y >= this.percY && y <= this.percY+this.percH;
    }
    intersects(tank)
    {
        return this.contains(tank.getX(),tank.getY());
    }
    percIntersects(tank)
    {
        return this.contains(tank.getPercX(),tank.getPercY());
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
    setControls()
    {
        $(document).keypress(function(e)
        {
           switch(e.keyCode)
           {
               case 119:
                   this.dir.up = true;
                   this.moveY(5);
                   this.isFacing = "up";
                   //set image changes here  this.setImg(whatever image is up)
                   break;
               case 100:
                   this.dir.right = true;
                   this.moveX(5);
                   this.isFacing = "right";
                   break;
               case 115:
                   this.dir.down = true;
                   this.moveY(-5);
                   this.isFacing = "down";
                   break;
               case 97:
                   this.dir.left = true;
                   this.moveX(-5);
                   this.isFacing = "left";
                   break;
           }
        }).keyup(function(e)
        {
           switch(e.keyCode)
           {
               case 87:
                   this.dir.up = false;
                   break;
               case 68:
                   this.dir.right = false;
                   break;
               case 83:
                   this.dir.down = false;
                   break;
               case 65:
                   this.dir.left = false;
                   break;
           }
        }).click(function(){
            this.shoot();
        });
    }
    shoot()
    {
        //shoot a bullet!!!!!
    }
}