var {GameServer} = require("./gameserver.js");

class GameServers
{
    constructor()
    {
        this.servers = [];
    }
    startServer(gameId)
    {
        this.servers.push(new GameServer(gameId));
    }
    checkServerExists(gameId)
    {
        for(var i = 0; i < this.servers.length; i++)
        {
           if(gameId === this.servers[i].getGameId())
           {
               return true;
           }
        }
        return false;
    }
    accessServer(gameId)
    {
        for(var i = 0; i < this.servers.length; i++)
        {
            if(gameId === this.servers[i].getGameId())
            {
                return this.servers[i];
            }
        }
        return null;
    }
}


module.exports = {GameServers};
