var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");

var mysession;

var port = process.env.PORT || 8080;

var app = express();
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
    next();
});

var {createRoutes} = require("./routes.js");

createRoutes(app,publicPath,mysession);


app.listen(port);









