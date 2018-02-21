const axios = require('axios');
const config = require('./config.js');

function discoverMovie(kind, genreId, language) {
  console.log("Calling discoverMovie Function");
  return axios.get(`https://api.themoviedb.org/3/discover/${kind}`, {
    params: {
      api_key: config.MOVIEDB_TOKEN,
      sort_by: 'popularity.desc',
      include_adult: false,
      with_genres: genreId,
      with_original_language: language,
    },
  }).then(results => {
    if (results.length === 0) {
      console.log("No RESULT");
      return [{
        type: 'quickReplies',
        content: {
          title: 'Sorry, but I could not find any results for your request :(',
          buttons: [{ title: 'Start over', value: 'Start over' }],
        },
      }];
    }

    console.log(typeof(results.data.results))
    console.log(results.data.results);

    const cards = results.data.results.slice(0, 10).map(movie => ({
      title: movie.title || movie.name,
      subtitle: movie.overview,
      imageUrl: `https://image.tmdb.org/t/p/w640${movie.poster_path}`,
      buttons: [
        {
          type: 'web_url',
          value: `https://www.themoviedb.org/movie/${movie.id}`,
          title: 'View More',
        },
      ],
    }));

    console.log(cards);

    return [
      {
        type: 'text',
        content: "Here's what I found for you!",
      },
      { type: 'carousel', content: cards },
    ];
  });
}

discoverMovie('movie', '35', 'en');

module.exports = discoverMovie;
