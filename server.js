var express = require("express");
var session = require("express-session");
var bcrypt = require("bcrypt");
var bodyParser = require("body-parser");
var path = require("path");
var mysql = require("mysql");

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




/////////////Start Get Requests///////////////////////////////
app.get("/",function(req,res)
{
   /*if(req.session && res.session.activated === true)
   {
       res.redirect("/private/lobby");
   }
   else
   {*/
    res.render("index");
   //}
});
app.get("/private/lobby",function(req,res)
{
   res.render("lobby"); 

});


app.listen(port);









