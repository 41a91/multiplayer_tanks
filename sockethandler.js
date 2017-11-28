var {escapeHtml} = require("./sanitize.js");
var {isRealString} = require("./utils/validation.js");
var {generateMessage} = require("./utils/message.js");
var {Bullet} = require("./utils/bullet.js");


function handleSocketEvents(io,users,app,gameServers,inGameUsers)
{
    io.on("connection", function(socket)
    {

        socket.on("join",(params,callback)=>
        {
           if(!isRealString(params.username) || !isRealString(params.kills))
           {
               callback("incorrect username or password");
           }
           params.username = escapeHtml(params.username);
           params.kills = escapeHtml(params.kills);
           socket.join("chat");
           users.removeUser(socket.id);
           users.addUser(socket.id,params.username,params.kills);
           io.to("chat").emit("updateUserList",users.getUserList());
            socket.emit("newMessage",generateMessage("Admin","Welcome to the chat room: " + params.username));
            socket.broadcast.to("chat").emit("newMessage",generateMessage("Admin",params.username + " has joined the chat room!"));
            callback();
        });

        socket.on("createMessage",(message,callback)=>
        {
            var user = users.getUser(socket.id);
            message.text = escapeHtml(message.text);

            if(user && isRealString(message.text))
            {
                io.to("chat").emit("newMessage",generateMessage(user.username,message.text));
                callback("This is from the server");
            }
        });

        socket.on("disconnect",()=>
        {
            console.log(socket.username + " was disconnected");

            var user = users.removeUser(socket.id);

            if(user)
            {
                io.to("chat").emit("updateUserList",users.getUserList());
                io.to("chat").emit("newMessage",generateMessage("admin","The user " + user.username + " has disconnected"));
            }
        });

        socket.on("connectToGame",(params)=>
        {
           var user = users.removeUser(socket.id);

           if(user)
           {
               io.to("chat").emit("updateUserList",users.getUserList());
               io.to("chat").emit("newMessage",generateMessage("admin","The user " + user.username + " has joined: " + params.gameId));

               inGameUsers.addUser(user.id,user.username,params.gameId);
           }
        });
        socket.on("preparedGame",(params)=>
        {
            var user = inGameUsers.getUserByName(params.username);

            if(user)
            {
            user.id = socket.id;
            var initX = randomNumber(5,80);
            var initY = randomNumber(5,100);

            socket.join(user.gameId);
            if(gameServers.checkServerExists(user.gameId))
            {
                    gameServers.accessServer(user.gameId).addTank(user.id,user.username,0,initX,initY,100,"right");
            }
            else
            {
                gameServers.startServer(user.gameId);
                gameServers.accessServer(user.gameId).addTank(user.id,user.username,0,initX,initY,100,"right");
            }

               socket.emit("updateTanks",{userId: user.id,username: user.username, x: initX, y:initY, hp:100,isLocal:true,gameId: user.gameId});
               socket.broadcast.to(user.gameId).emit("updateTanks",{userId: user.id,username: user.username, x: initX, y:initY, hp:100,isLocal:false, gameId: user.gameId});
           }
        });
        socket.on("leaveGame",()=>
        {
            var user = inGameUsers.removeUser(socket.id);
            console.log("leaving game user: ",user);

            if(user)
            {
                gameServers.accessServer(user.gameId).removeTank(socket.id);
                io.to(user.gameId).emit("removeTank",{userId: user.id});
            }
        });
        socket.on("sync",(tank)=>
        {
            //TODO when i leave the game it still think the tank is in the array when its not
            if(gameServers.accessServer(tank.gameId).getTank(tank.userId))
            {
                gameServers.accessServer(tank.gameId).getTank(tank.userId).x = tank.x;
                gameServers.accessServer(tank.gameId).getTank(tank.userId).y = tank.y;
                gameServers.accessServer(tank.gameId).getTank(tank.userId).direction = tank.direction;

                socket.emit("sync",{tanks:gameServers.accessServer(tank.gameId).getTanks(),gameId:tank.gameId,bullets:gameServers.accessServer(tank.gameId).getBullets()});
                socket.broadcast.to(tank.gameId).emit("sync",{tanks:gameServers.accessServer(tank.gameId).getTanks(),gameId:tank.gameId,bullets:gameServers.accessServer(tank.gameId).getBullets()});

            }
            setTimeout(function(){
                gameServers.accessServer(tank.gameId).removeBullets();
                gameServers.accessServer(tank.gameId).removeDeadTanks();
                gameServers.accessServer(tank.gameId).syncBullets();},0)

        });
        socket.on("fireBullet",(bullet)=>
        {
            gameServers.accessServer(bullet.gameId).addBullet(bullet.userId,bullet.gameId,bullet.x,bullet.y,bullet.isFacing,bullet.containerHeight,bullet.containerWidth);
        });
        socket.on("updateScores",(userInfo)=>
        {
            var username = gameServers.accessServer(userInfo.gameId).getTank(userInfo.killedBy).username;
            gameServers.accessServer(userInfo.gameId).getTank(userInfo.killedBy).kills += 1;
            console.log( gameServers.accessServer(userInfo.gameId).getTank(userInfo.killedBy).kills);
            socket.emit("updateScores",{kills:gameServers.accessServer(userInfo.gameId).getTank(userInfo.killedBy).kills,username:username});
        });
    });



    var randomNumber = function(min,max)
    {
        return Math.floor(Math.random()*(max-min)) + min;
    }

}

module.exports = {handleSocketEvents: handleSocketEvents};