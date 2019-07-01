var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose")


//require all models
//var db = require("./models");

//set up port
var PORT = 8080;

// initialize express
var app = express();

// server static content for the app from the "public" directory
app.use(express.static("public"));

//configure middleware
//use morgan logger for logging requests
app.use(logger("dev"));

//parse request body as JSON
app.use(express.urlencoded({ extended: true }));

//set handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

//connect to the Mongo DB
mongoose.connect("mongodb://localhost/webscrapingdb", {useNewUrlParser: true});

//Import routes and give the server access to them
var routes = require("./controllers/scrapingIntoMongoDB.js");
app.use(routes)


// start the server
app.listen(PORT, function(){
    console.log("App running on port " + PORT + "!")
})