import memoizee from "memoizee";

const API_URL =
  "https://api.code-du-travail-numerique.incubateur.social.gouv.fr/api/v1";

const fetchResults = endpoint => (query = "", excludeSources = "") => {
  const url = `${API_URL}/${endpoint}?q=${encodeURIComponent(
    query
  )}&excludeSources=${encodeURIComponent(excludeSources)}&size=25`;
  return fetch(url).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error("Un problème est survenu.");
  });
};
const searchResults = fetchResults("search");
const suggestResults = fetchResults("suggest");

const suggestMin = (query, excludeSources) => {
  if (query.length > 2) {
    return suggestResults(query, excludeSources);
  } else {
    return Promise.resolve({ hits: { hits: [] } });
  }
};

// memoize search results
const searchResultsMemoized = memoizee(searchResults, {
  promise: true,
  length: 2 // ensure memoize work for function with es6 default params
});

// memoize suggestions results
const suggestResultsMemoized = memoizee(suggestMin, {
  promise: true,
  length: 2 // ensure memoize work for function with es6 default params
});

export {
  suggestResultsMemoized as suggestResults,
  searchResultsMemoized as searchResults
};
