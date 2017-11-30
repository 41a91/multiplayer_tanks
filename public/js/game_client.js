var app = angular.module("gameApp",[]);
var currentImg = 3;
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

app.controller("gameController",function($scope,$http,socket)
{

    socket.on("connect",function()
    {
        socket.emit("preparedGame",{username:$("#username").html()});
    });
    socket.on("updateTanks",(tank)=>
    {
        console.log("We got the tank ",tank);
        $scope.game.addTank(tank.userId,tank.gameId,tank.username,tank.isLocal,tank.x,tank.y,tank.hp);
    });
    socket.on("removeTank",(tank)=>
    {
       $scope.game.removeTank(tank.userId);
    });
    socket.on("sync",(tanks)=>
    {
       $scope.game.updateServerTanks(tanks);
       if($scope.game.getLocalTankHp() > 0)
       {
           $scope.localHealth = $scope.game.getLocalTankHp();
           controlAmmoVisuals($scope.game);
       }
       else
       {
           $("#overlay").css("display","block");
           $scope.localHealth = "Destroyed!";
       }

    });
    socket.on("updateScores",function(userInfo)
    {
        console.log("post the new score!");
        if(userInfo)
        {
            $http.post("/private/updatescore",{kills:userInfo.kills,username:userInfo.username}).then(function(response)
            {
                console.log("successful upload of score");
            },function(error)
            {
                console.log("error uploading score");
            });
        }else
        {
            console.log("both players died at same time!");
        }
    });

    $(document).ready(function()
    {
        $scope.game = new Game(document.getElementById("game"),socket);
        $scope.localHealth = 100;
        var overlay = $("#overlay");

        $("#overlayButton").click(function()
        {
           $scope.game.localTank = null;
           //$scope.game.localTank.setDead(false);
           //$scope.localHealth = 100;
            socket.emit("respawnTank");
           overlay.css("display","none");
            $("#currentAmmo").css("display","block");
            $("#reloadBar").css("display","none");
            $("#currentAmmo").attr("src","../images/Three_Bullets.png");
        });

       /* if(performance.navigation.type === 1)
        {
            socket.emit("leaveGame");
            console.log("refreshed page");
            //window.location.href = "/private/lobby";
        }*/




        $("#leaveGame").click(function(evt)
        {
            socket.emit("leaveGame");
        });
    });
});

function controlAmmoVisuals(game)
{
    var currentAmmo = game.localTank.getCurrentAmmo();


    var ammoImage = $("#currentAmmo");
    var reloadBar = $("#reloadBar");

if(currentAmmo === 3 && currentImg === 3)
{
    ammoImage.attr("src","../images/Three_Bullets.png");
    currentImg--;
}
else if(currentAmmo === 2 && currentImg === 2)
{
    ammoImage.attr("src","../images/Two_Bullets.png");
    reloadBar.css("width",game.localTank.getLocalTime() + "%");
    currentImg--;
}
else if(currentAmmo === 1 && currentImg === 1)
{
    ammoImage.attr("src","../images/Bullet.png");
    currentImg--;
}
else if(currentAmmo === 0)
{
    if(currentImg === 0)
    {
        ammoImage.css("display","none");
        reloadBar.css("display","block");
        currentImg = -1;
    }

    reloadBar.css("width",game.localTank.getLocalTime() + "%");
    if(game.localTank.getLocalTime() >= 83)
    {
        reloadBar.css("display","none");
        ammoImage.css("display","block");
        currentImg = 3;
    }
}
}
