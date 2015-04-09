var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var pg = require('pg');
var ejs = require('ejs');
var methodOverride = require('method-override');

var app = express();
var db = require('./models');

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));

// we have our root route that renders our index view
app.get('/', function(req,res) {
	var error = null;
  	res.render('site/index', {error: error});
});

// we have our search route that renders our search view
app.get('/search', function(req,res) {
  	//console.log("\n\n\n\nI AM REQ.QUERY",req.query);
  	var urlEndpoint = 'http://www.omdbapi.com?s=';
 	var title = req.query.q;
  
  	request(urlEndpoint + title, function(err, response, body) {
    	//console.log("****RESPONSE BELOW*****");
    	var error = JSON.parse(response.body);
    	//console.log(error.Error);
    	if (error.Error === "Movie not found!") {
    		res.render('site/index', {error: error.Error})
    	} else {
      		var apiMovies = JSON.parse(body);
			var searchResults = apiMovies.Search;
      		res.render('site/search', {movies: searchResults});
    	}
  	});
});
// we have our movie route that renders our movie view
app.get('/movie', function(req,res) {
  	//console.log("\n\n\n\nI AM REQ.QUERY",req.query);
  	var urlEndpoint = 'http://www.omdbapi.com?i=';
  	var id = req.query.id;

  	request(urlEndpoint + id, function(err, response, body) {
    	if (!err && response.statusCode === 200) {
      		var apiMovie = JSON.parse(body);
      		res.render('site/movie', {movie: apiMovie});
      		}
  	});
});

app.get('/favorites', function(req, res) {
	db.Favorite.findAll()
		.then(function(dbFavorites) {
		res.render('favorites/index', {ejsFavorites: dbFavorites});
		});
});

app.post('/favorites', function(req, res) {
	var title = req.body.favorite.title;
  var plot = req.body.favorite.plot;
  var genre = req.body.favorite.genre;
  //split string, get rid of min and get number
  var runtime = Number(req.body.favorite.runtime.split(" ")[0]);
	var favorite = {title: title, plot: plot, genre: genre, runtime: runtime};
  db.Favorite.create(favorite)
		.then(function() {
		res.redirect('/favorites');
		});
});

// app.delete('/favorites', function(req,res) {
//   var faveId = req.params.id;
//   db.Favorite.find(faveId)
//         .then(function(fave){
//          fave.destroy()
//             .then(function() {
//             	res.redirect('/favorites');
//                 });
//         });
// });


app.listen(3000);

