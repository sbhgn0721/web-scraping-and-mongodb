const express = require('express'),
      router = express.Router(),
      Article = require('../models/article');

// root route
router.get('/', function(req, res) {
    Article
        .find({})
        .where('saved').equals(false)
        .where('deleted').equals(false)
        .sort('-date')
        .limit(20)
        .exec(function(error, articles) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                console.log(articles);
                let hbsObj = {
                    title: 'MONGO SCRAPER',
                    subtitle: 'Finimize',
                    articles: articles
                };
                res.render('index', hbsObj);
            }
        });
});

// saved articles
router.get('/saved', function(req, res) {
    Article
        .find({})
        .where('saved').equals(true)
        .where('deleted').equals(false)
        .populate('notes')
        .sort('-date')
        .exec(function(error, articles) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                console.log(articles);
                let hbsObj = {
                    title: 'SAVED ARTICLES',
                    subtitle: 'YOUR SAVED ARTICLES',
                    articles: articles
                };
                res.render("saved" ,hbsObj);
            }
        });
});

// require controllers
router.use('/api', require('./api'));

module.exports = router;


/* var express = require('express');
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

//create routes and set up logic within those routes where required

//router.get('/', function (req, res) {
    //res.render('index');
//});

router.get("/scrape", function (req, res) {
    axios.get("https://www.finimize.com/wp/").then(function (response) {

        var $ = cheerio.load(response.data);

        //save an empty result object 
        var result = {};

        $("article.article").each(function (i, element) {
            if (i <= 5) {
                //add the title and excerpt of every article, and save them as properties of the result
                result.title = $(this).find("h3.title").text();
                result.excerpt = $(this).find("p.excerpt").text();
                result.link = $(this).find("div").attr("onclick").replace(/location.href='/, "").slice(0, -1);

                //console.log(result);
                // create a new article using the "result" object built from scraping
                db.Article.create(result)
                    .then(function (dbArticle) {
                        //view the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            }

        });
    })

})

// root route for getting all scraped articles from the db
router.get('/', function(req, res) {
    db.Article
        .find({"saved": false, "deleted": false})
        .sort({"date": -1})
        .then(function(error, Article) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                console.log(Article);
                res.render('index', {title: "MONGO SCRAPER",subtitle: "Finimize", articles: Article} );
            }
        });
});

// route for clearing scraped articles
router.delete("/delete", function (req, res) {
    db.Article.remove({})
    .then(function (error, doc) {
        if (error) {
            console.log(error);
            res.status(500);
        } else {
            res.redirect('/saved');
        }
    })

})

// route for saving an article
router.post('/save/:id', function (req, res) {
    db.Article.findByIdAndUpdate(req.params.id, {
        $set: { saved: true }
    },
        { new: true },
        function (error, doc) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.redirect('/');
            }
        });
});


// route for getting all saved articles
router.get('/saved', function(req, res) {
    db.Article
        .find({"saved": true, "deleted": false})
        .populate("note")
        .sort({"date": -1})
        .then(function(error, Article) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                console.log(Article);
                let hbsObj = {
                    title: "SAVED ARTICLES",
                    subtitle: "YOUR SAVED ARTICLES",
                    articles: Article
                };
                res.render("saved" ,hbsObj);
            }
        });
});

// route for deleting a saved article
router.delete('/articles/:id', function(req, res) {
    db.Article.findByIdAndUpdate(req.params.id,
        { $set: { deleted: true} },
        { new: true },
        function(error, doc) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.redirect('/saved');
            }
        }
    );
});


// route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


// export routes for server.js to use
module.exports = router; */
