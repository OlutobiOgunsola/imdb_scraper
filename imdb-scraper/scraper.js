const fetch = require("node-fetch");
const cheerio = require("cheerio");

const searchMovies = function(searchTerm) {
  return fetch(`https://www.imdb.com/find?ref_=nv_sr_fn&q=${searchTerm}&s=all`)
    .then(response => response.text())
    .then(body => {
      const movies = [];
      const $ = cheerio.load(body);
      $(".findResult").each(function(i, elem) {
        const $element = $(elem);
        const $image = $element.find("td a img");
        const $title = $element.find("td .result_text a");
        console.log($element.text());

        const movie = {
          image: $image.attr("src"),
          title: $title.text
        };
        movies.push(movie);
      });
    });
};

const movieURL = "https://www.imdb.com/title/";
getMovies = function(imdbID) {
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
      return {
        title,
        rating,
        runTime,
        genres,
        releaseDate,
        imdbID,
        poster,
        summary,
        director
      };
    });
};

module.exports = { searchMovies, getMovies };
