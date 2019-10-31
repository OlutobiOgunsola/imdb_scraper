const form = document.querySelector("form");
const searchInput = document.querySelector("input");
const resultsList = document.querySelector("#results");

const BASE_URL = "http://localhost:3000";

const formSubmitted = e => {
  e.preventDefault();

  const searchTerm = searchInput.value;
  getSearchResults(searchTerm).then(results => showResults(results));
};

const getSearchResults = searchTerm => {
  return fetch(`${BASE_URL}/search/${searchTerm}`).then(response =>
    response.json()
  );
};

const showResults = results => {
  results.forEach(result => {
    const li = document.createElement("li");
    const img = document.createElement("img");
    img.src = result.image;
    li.appendChild(img);
    const span = document.createElement("span");
    span.textContent = result.title;
    li.appendChild(span);
    resultsList.appendChild(li);
  });
};

form.addEventListener("submit", formSubmitted);
