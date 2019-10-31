const fetch = require("node-fetch");
const cheerio = require("cheerio");

const movieCache = {};
const searchCache = {};

const searchMovies = function(searchTerm) {
  if (searchCache[searchTerm]) {
    Promise.resolve(searchCache[searchTerm]);
  }
  return fetch(`https://www.imdb.com/find?ref_=nv_sr_fn&q=${searchTerm}&s=all`)
    .then(response => response.text())
    .then(body => {
      const movies = [];
      const $ = cheerio.load(body);
      $(".findResult").each(function(i, elem) {
        const $element = $(elem);
        const $image = $element.find("td a img");
        const $title = $element.text().trim();
        // console.log($element.text());
        const movie = {
          image: $image.attr("src"),
          title: $title
        };
        movies.push(movie);
      });

      searchCache[searchTerm] = movies;

      return movies;
    });
};

const movieURL = "https://www.imdb.com/title/";
getMovies = function(imdbID) {
  if (movieCache[imdbID]) {
    Promise.resolve(movie);
  }
  return fetch(`${movieURL}${imdbID}`)
    .then(response => response.text())
    .then(body => {
      const $ = cheerio.load(body);
      const $title = $(".title_wrapper h1");
      const title = $title
        .first()
        .contents()
        .filter(function() {
          return this.type === "text";
        })
        .text()
        .trim();
      const rating = $(".ratingValue span").text();
      const runTime = $("time")
        .first()
        .contents()
        .filter(function() {
          return this.type === "text";
        })
        .text()
        .trim();
      let genres = [];
      $(".subtext a").each(function(i, element) {
        const genre = $(element).text();
        genres.push(genre);
      });
      const releaseDate = genres.pop().trim();
      const poster = $("div.poster a img").attr("src");
      const summary = $("div.summary_text")
        .text()
        .trim();
      let summaries = [];
      $("div.credit_summary_item a").each(function(i, summary) {
        summaries.push($(summary).text());
      });
      const director = summaries[0];
      let writers = [];
      $("div.credit_summary_item a").each(function(i, summary) {
        const $element = $(summary);
        if ($element.attr("href")[0] === "/" && i !== 0) {
          writers.push($element.text());
        }
      });

      movieCache[imdbID] = movie;
      return {
        title,
        rating,
        runTime,
        genres,
        releaseDate,
        imdbID,
        poster,
        summary,
        director,
        writers
      };
    });
};

module.exports = { searchMovies, getMovies };
