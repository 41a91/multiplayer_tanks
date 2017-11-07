var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");
var http = require("http");
var socket = require("socket.io");

var mysession;
var users = [];

var port = process.env.PORT || 8080;

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




var {createRoutes} = require("./routes.js");
var {handleSocketEvents} = require("./sockethandler");

createRoutes(app,publicPath,mysession);
handleSocketEvents(io,users);

server.listen(port);









