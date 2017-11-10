
class InGameUsers {
    constructor() {
        this.users = [];
    }

    addUser(id, username, gameId) {
        var user = {id, username, gameId};
        this.users.push(user);
        return user;

    }

    removeUser(id) {
        var foundUser = this.getUser(id);
        if (foundUser) {
            this.users = this.users.filter((user) => {
                return user.id !== id;
            });
        }
        return foundUser;
    }

    getUser(id) {
        var foundUser = this.users.filter((user) => {
            return user.id === id;
        });
        return foundUser[0];
    }

    getUserList(gameId) {
        var users = this.users.filter((user) => {
            return user.gameId === gameId;
        });
        var namesArray = users.map((user) => {
            return user.username;
        });
        return namesArray;
    }

    getUserByName(username) {
        var foundUser = this.users.filter((user) => {
            return user.username === username;
        });
        return foundUser[0];
    }
}

module.exports = {InGameUsers};