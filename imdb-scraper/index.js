const express = require("express");
const app = express();
const scraper = require("./scraper");

const cors = require("cors");

const port = process.env.PORT || 3000;

app.use(cors());
app.listen(port, () => {
  console.log(`App listening on ${port}`);
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
