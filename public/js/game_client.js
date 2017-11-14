var app = angular.module("gameApp",[]);

app.factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});

app.controller("gameController",function($scope,socket)
{

    socket.on("connect",function()
    {
        socket.emit("preparedGame",{username:$("#username").html()});
    });
    socket.on("updateTanks",(tank)=>
    {
        console.log("We got the tank ",tank);
        $scope.game.addTank(tank.userId,tank.username,tank.isLocal,tank.x,tank.y,tank.hp);
    });

    $(document).ready(function()
    {
        $scope.game = new Game(document.getElementById("game"));





       $scope.game.gameLoop();




        $("#leaveGame").click(function(evt)
        {
            socket.emit("leaveGame");
        });
    });
});
