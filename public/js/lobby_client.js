var app = angular.module("chatApp",[]);

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

function updateScroll()
{
    var chatBox = $(".messageSender");
    chatBox.scrollTop = chatBox.scrollHeight;
}

app.controller("chatController",function($scope,socket)
{
    $scope.users = [];
    $scope.messages = [];

    console.log("scope: " + $scope.kills);

    socket.on("connect",function()
    {
        socket.emit("join",{username:$("#username").html(),kills:$("#kills").html()},function(error)
        {
            if(error)
            {
                alert(error);
                window.location.href="/";
            }
            else
            {
                console.log("Joined Succeessfully");
            }
        });
    });




});
