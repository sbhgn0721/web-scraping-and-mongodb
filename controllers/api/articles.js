const express = require('express'),
    router = express.Router(),
    request = require('request'),
    cheerio = require('cheerio'),
    axios = require('axios'),
    Article = require('../../models/article');

// get all articles from database
router.get('/', function (req, res) {
    Article
        .find({})
        .exec(function (error, docs) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(200).json(docs);
            }
        });
});

// get all saved articles
router.get('/saved', function (req, res) {
    Article
        .find({})
        .where('saved').equals(true)
        .where('deleted').equals(false)
        .populate('notes')
        .exec(function (error, docs) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(200).json(docs);
            }
        });
});

// get all deleted articles
/*router.get('/deleted', function (req, res) {
    Article
        .find({})
        .where('deleted').equals(true)
        .exec(function (error, docs) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(200).json(docs);
            }
        });
});*/

// save an article
router.post('/save/:id', function (req, res) {
    Article.findByIdAndUpdate(req.params.id, {
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

// dismiss scraped article
router.post('/delete', function (req, res) {
    Article.deleteMany({"saved":false},function (error, doc) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.redirect('/');
            }
        });
});

//dismiss saved articles
router.post('/saved/delete', function (req, res) {
    Article.deleteMany({"saved":true},function (error, doc) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.redirect('/saved');
            }
        });
});


// delete a saved article
router.delete('/:id', function(req, res) {
    Article.findByIdAndUpdate(req.params.id,
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

// scrape articles
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
                Article.create(result)
                    .then(function (dbArticle) {
                        //view the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            }

        });
        res.redirect('/');
    })

});



module.exports = router;