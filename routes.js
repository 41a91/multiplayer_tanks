var mysql = require("mysql");
var bcrypt = require("bcrypt");

function createRoutes(app,publicPath,mysession)
{

    var connection = mysql.createConnection({

        host     : 'localhost',
        user     : 'root',
        password : 'dennisiscool',
        database : 'tank_profiles'

    });



    //////////////////////////////Start Gets//////////////////////////////////
    app.get("/",function(req,res)
    {
        if(req.session.authorized && res.session.authorized  === true)
        {
            res.redirect("/private/lobby");
        }
        else
        {
        res.render("index");
        }
    });
    app.get("/private/lobby",function(req,res)
    {
        res.render("lobby");

    });
    app.get("/private/logout",function(req,res)
    {
        req.session.destroy(function(err)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                res.redirect("/");
            }
        });
    });
    app.get("/register",function(req,res)
    {
       res.render("register");
    });




    ////////////////////Start Posts//////////////////////////
    app.post("/register",function(req,res)
    {
        var username = req.body.username;
        var password = req.body.password;

       /* connection.query("Select * from profile where profile_username = ?",[username],function(err,result,fields)
        {
            console.log(result);
           if(result === undefined)
           {*/
               bcrypt.genSalt(10,function(err,salt)
               {
                   bcrypt.hash(password,salt,function(err,hash)
                   {
                       connection.query("INSERT into profile (profile_username,profile_password) values (?,?)",[username,hash],function(err,result,fields)
                       {
                           if(err)
                           {
                               console.log("err",err);
                           }
                           else
                           {
                               res.render("index",{error: "Account has been created"});
                           }
                       });
                   });
               });
           /*}
           else
           {
               res.render("register",{error:"That user already exists"});
           }
        });*/


    });

    app.post("/login",function(req,res)
    {
        var username = req.body.username;
        var password = req.body.password;

        connection.query("select * from profile where profile_username =? limit 1",[username],function(err,result)
        {
            if(err)
            {
                res.render("index",{error: "Incorrect username or password"});
            }
            else {
                if (result[0]) {
                    var profile = result[0];
                    bcrypt.compare(password, profile.profile_password, function (err, compareResult) {
                        if (err) {
                            res.render("index", {
                                error: "Incorrect username or password"
                            });
                        }
                        else {
                             if(compareResult)
                            {
                                mysession = req.session;
                                mysession.authorized = true;
                                res.redirect("/private/lobby");
                            }
                            else {
                                console.log(compareResult);
                                res.render("index", {
                                    error: "Incorrect username or password"
                                });
                            }
                        }
                    });
                }
                else
                {
                    res.render("index", {error: "Incorrect username or password"});
                }

            }
        });
    });





}

module.exports = {createRoutes: createRoutes};