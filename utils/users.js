
class Users
{
    constructor()
    {
        this.users = [];
    }
    addUser(id,username,kills)
    {
        var user = {id,username,kills};
        this.users.push(user);
        return user;

    }
    removeUser(id)
    {
        var foundUser = this.getUser(id);
        if(foundUser)
        {
            this.users = this.users.filter( (user)=>{
                return user.id !== id;
            });
        }
        return foundUser;
    }
    getUser(id)
    {
        var foundUser = this.users.filter( (user) =>{
            return user.id === id;
        });
        return foundUser[0];
    }
    getUserList()
    {
        var list = [];
       for(var i = 0; i < this.users.length; i++)
       {
           list[i] = this.users[i].username;
       }
       return list;
    }
}

module.exports = {Users};