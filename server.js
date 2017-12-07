var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");
var http = require("http");
var socket = require("socket.io");

var {createRoutes} = require("./routes.js");
var {handleSocketEvents} = require("./sockethandler");
var {Users} = require("./utils/users.js");
var {InGameUsers} = require("./utils/ingameusers.js");
var {GameServers} = require("./utils/gameservers.js");

var mysession;
var users = new Users();
var inGameUsers = new InGameUsers();
var gameServers = new GameServers();


var port = 9898;

var app = express();
var server = http.Server(app);
var io = socket(server);

var publicPath = path.join(__dirname, "public");

app.set("view engine","ejs");
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({secret: "dennisiscool",resave:true,saveUninitialized:true}));
app.use(function(req, res, next){
    res.locals.authorized  = req.session.authorized;
    res.locals.profile = req.session.profile;
    next();
});






createRoutes(app,publicPath,mysession);
handleSocketEvents(io,users,app,gameServers,inGameUsers);

server.listen(port);









