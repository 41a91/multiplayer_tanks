class Tank
{
    constructor(userId,gameId,username,isLocal,x,y,w,h,hp,container)
    {
        this.userId = userId;
        this.gameId = gameId;
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
        this.rightImg = document.getElementById("rightTank");
        this.leftImg = document.getElementById("leftTank");
        this.upImg = document.getElementById("upTank");
        this.downImg = document.getElementById("downTank");
        this.dir = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        this.hp = hp;
        this.img = this.rightImg;

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
    getDirection()
    {
        return this.isFacing;
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
    setDirection(dir)
    {
        this.isFacing = dir;
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
    setHp(hp)
    {
        this.hp = hp;
    }
    destroy(bool)
    {
        this.dead = bool;
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
    getHp()
    {
        return this.hp;
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
        var tank = this;
        $(document).keypress(function(e)
        {
           switch(e.keyCode)
           {
               case 119:
                   tank.dir.up = true;
                   this.isFacing = "up";
                   break;
               case 100:
                   tank.dir.right = true;
                   this.isFacing = "right";
                   break;
               case 115:
                   tank.dir.down = true;
                   this.isFacing = "down";
                   break;
               case 97:
                   tank.dir.left = true;
                   this.isFacing = "left";
                   break;
               case 32:
                   tank.shoot();
                   break;
           }
        }).keyup(function(e)
        {
           switch(e.keyCode)
           {
               case 87:
                   tank.dir.up = false;
                   break;
               case 68:
                   tank.dir.right = false;
                   break;
               case 83:
                   tank.dir.down = false;
                   break;
               case 65:
                   tank.dir.left = false;
                   break;
           }
        });
    }
    shoot()
    {
        console.log("POW!");
    }
    move()
    {
        if(this.dead)
        {
            return;
        }

        var moveX = 0;
        var moveY = 0;

        if(this.dir.up)
        {
            moveY = -2;
            this.setImg(this.upImg);
        }
        else if(this.dir.down)
        {
            moveY = 2;
            this.setImg(this.downImg);
        }
        if(this.dir.right)
        {
            moveX = 2;
            this.setImg(this.rightImg);
        }
        else if(this.dir.left)
        {
            moveX = -2;
            this.setImg(this.leftImg);
        }

        if(this.dir.left && !this.dir.up && !this.dir.down && !this.dir.right && this.percX > 0)
        {
            this.moveX(moveX);
        }
        if(this.dir.right && !this.dir.up && !this.dir.down && !this.dir.left && this.percX < this.container.width-this.percW)
        {
            this.moveX(moveX);
        }
        if(this.percY > 0 && !this.dir.down && this.dir.up && !this.dir.left && !this.dir.right)
        {
            this.moveY(moveY);
        }
        if(this.percY < this.container.height-this.percH && !this.dir.up && this.dir.down && !this.dir.right && !this.dir.left)
        {
            this.moveY(moveY);
        }
    }
    reposition()
    {

    }
}