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
    var chatBoxHeight = document.getElementById("scrollingChat").scrollHeight;
    $("#scrollingChat").scrollTop(chatBoxHeight);
}

app.controller("chatController",function($scope,$http,socket)
{

    $scope.users = [];
    $scope.messages = [];

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

    socket.on("updateUserList",function(users)
    {
        $scope.users = users;
    });
    socket.on("newMessage",function(message)
    {
        $scope.messages.push(message);
        updateScroll();

    });
    socket.on("grabScore",function()
    {
        $http.post("/private/amountofkills",{username:$("#username").html()}).then(function(response)
        {
            $("#kills").html(response.data);

        },function(error)
        {
            console.log("error uploading score");
        });
    });
    $("#send").click(function()
    {
        socket.emit("createMessage",{text:$("#message").val()},function(data)
        {
            $("#message").val("");
        });
    });
    $(".games").click(function(evt)
    {
       socket.emit("connectToGame",{gameId: $(this).attr("id")});
       window.location.href="/private/game";
    });
});
