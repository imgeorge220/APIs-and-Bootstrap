/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  let response = await axios.get('http://api.tvmaze.com/search/shows', {params: {q: query}})
  console.log(response)
  let showList = [];
  for (let show in response.data) {
    let defaultImg = 'https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300';
    let { id, image, name, summary } = response.data[show].show;
    // let image = response.data[show].show.image;
    // let name = response.data[show].show.name;
    // let summary = response.data[show].show.summary;
    image = image ? image.medium : defaultImg;
    let newShow = {id, name, summary, image};
    showList.push(newShow);
  }
  return showList;
}


/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let showId = show.id;
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
            <img class="card-img-top" src="${show.image}">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button id="show-episodes-${show.id}">Show Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
    $(`#show-episodes-${show.id}`).on('click', async function(e){
     let episodesList = await getEpisodes(showId);
     //console.log(episodesList);
     //populateEpisodes(episodesList);
    })
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (query === '') return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  console.log('id',id);
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  //console.log(response);
  let episodeList = [];
  for (let episode in response.data) {
    let { name, season, number} = response.data[episode];
    let newEpisodeList = {id, name, season, number};
    episodeList.push(newEpisodeList);
  }
  return episodeList;
}
function populateEpisodes(episodes) {
  let $episodeContainer = $('#episodes-list');
  for (let episode of episodes) {
    let newEpisode = `<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`;
    $episodeContainer.append(newEpisode);
  }
  $('#episodes-area').show();
}

