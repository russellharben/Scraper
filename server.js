// Server file with node/nodemon --> open public/app.js.

// Dependencies
var express = require("express");
// var mongojs = require("mongojs");
var cheerio = require("cheerio");
var axios = require("axios");
var bodyParser = require("body-parser");

// First, tell the console what server.js is doing
// console.log("\n***********************************\n" +
//   "Grabbing every thread name and link\n" +
//   "from reddit's webdev board:" +
//   "\n***********************************\n");

// Express
var app = express();

var PORT = process.env.PORT || 3000;

// Serve static public directory
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// An empty array to save the data that we'll scrape
var results = [];
// Making a request via axios for reddit's "webdev" board. We are sure to use old.reddit due to changes in HTML structure for the new reddit. The page's Response is passed as our promise argument.
axios.get("https://old.reddit.com/r/webdev").then(function (response) {

  // Load the Response into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(response.data);

  // results.push("Response = ", response.data);
  // console.log("Response Data = ", results);
  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $("p.title").each(function (i, element) {

    // Save the text of the element in a "title" variable
    var title = $(element).text();

    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    var link = $(element).children().attr("href");

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: link
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  // console.log(results);

});

app.get('/api/reddit', function (req, res) {
  res.json(results)
})

// Set the app to listen on port 3000
app.listen(PORT, function () {
  console.log("App running on port 3000!");
});
