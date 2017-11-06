var {escapeHtml} = require("./sanitize.js");

function handleSocketEvents(io,tanks)
{
    io.sockets.on("connection", function(socket,tank)
    {

    });
}

module.exports = {handleSocketEvents: handleSocketEvents};