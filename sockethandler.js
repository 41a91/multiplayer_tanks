var {escapeHtml} = require("./sanitize.js");
var {isRealString} = require("./utils/validation.js");
var {generateMessage} = require("./utils/message.js");

function handleSocketEvents(io,users,app,gameServers,inGameUsers)
{
    io.on("connection", function(socket)
    {

        socket.on("join",(params,callback)=>
        {

            console.log("user: ",params);
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
            socket.emit("newMessage",generateMessage(params.username,"Welcome to the chat room:"));
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
            console.log("user: ",user);

            if(user)
            {
            user.id = socket.id;
            var initX = randomNumber(20,280);
            var initY = randomNumber(20,480);

            socket.join(user.gameId);
            if(gameServers.checkServerExists(user.gameId))
            {
                gameServers.accessServer(user.gameId).addTank(user.id,user.username,user.kills,initX,initY,100);
            }
            else
            {
                gameServers.startServer(user.gameId);
                gameServers.accessServer(user.gameId).addTank(user.id,user.username,user.kills,initX,initY,100);
            }

               socket.emit("updateTanks",{userId: user.id,username: user.username, x: initX, y:initY, hp:100,isLocal:true});
               socket.to(user.gameId).emit("updateTanks",{userId: user.id,username: user.username, x: initX, y:initY, hp:100,isLocal:false});
           }
        });
        socket.on("leaveGame",()=>
        {
            var user = inGameUsers.removeUser(socket.id);
            console.log("leaving game user: ",user);

            if(user)
            {
                gameServers.accessServer(user.gameId).removeTank(socket.id);
                io.to(user.gameId).emit("updateTanks",gameServers.accessServer(user.gameId).getTanks());
            }
        });








    });


    var randomNumber = function(min,max)
    {
        return Math.floor(Math.random()*(max-min)) + min;
    }

}

module.exports = {handleSocketEvents: handleSocketEvents};