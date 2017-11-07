var {escapeHtml} = require("./sanitize.js");
var {isRealString} = require("./utils/validation.js");

function handleSocketEvents(io,users)
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




        });



    });
}

module.exports = {handleSocketEvents: handleSocketEvents};