const express = require("express");
const nodemon = require("nodemon");
const app = express();
const scraper = require("./scraper");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  `App listening on ${port}`;
});

app.get("/", (req, res) => {
  res.json({
    message: "scraping is fun"
  });
});

app.get("/search/:title", (req, res) => {
  scraper.searchMovies(req.params.title).then(movies => {
    res.json(movies);
  });
});

app.get("/movie/:imdbID", (req, res) => {
  scraper.getMovies(req.params.imdbID).then(movie => res.json(movie));
});
