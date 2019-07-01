var express = require("express");
var router = express.Router();

//require scraping tools
var axios = require("axios");
var cheerio = require("cheerio")


// Import the model to use its database functions
// require all models
var db = require("../models");

//create all routes and set up logic within those routes where required
router.get("/scrape", function(req, res) {
    axios.get("https://www.finimize.com/wp/").then(function(response) {

    var $ = cheerio.load(response.data);

    //save an empty result object 
    var result = {};
    
    $("article.article").each(function(i, element) {
        
        

        //add the title and excerpt of every article, and save them as properties of the result
        result.title = $(this).find("h3.title").text();
        result.excerpt = $(this).find("p.excerpt").text()

        //console.log(result);
        // create a new article using the "result" object built from scraping
        db.Article.create(result)
        .then(function(dbArticle) {
            //view the added result in the console
            console.log(dbArticle);
        })
        .catch(function(err) {
            console.log(err);
        });
    });
    
    

    })
    
})

// export routes for server.js to use
module.exports = router;
