
// Function to retrieve song information from localStorage
function retrieveFromLocalStorage() {
    const storedSong = JSON.parse(localStorage.getItem('currentSong'));
    const storedIndex = parseInt(localStorage.getItem('currentSongIndex'));
    const storedShuffle = localStorage.getItem('isShuffleEnabled') === "true";
    return { storedSong, storedIndex, storedShuffle };
}

// Function to resume playback if there's stored song information
function resumePlayback() {
    const { storedSong, storedIndex, storedShuffle } = retrieveFromLocalStorage();
    if (storedSong && storedIndex >= 0) {
        playSong(storedSong, storedIndex, storedShuffle ? "shuffle" : "normal");
    }
}

// When the new page loads, retrieve song information from localStorage and resume playback if necessary
window.addEventListener('DOMContentLoaded', () => {
    resumePlayback();
});


// Function to fetch access token
async function fetchAccessToken() {
    const clientId = "f7307ada475e4b34ac69626209ee0d79"; // Your Spotify Client ID
    const clientSecret = "615b7efbe7324750983956c9cb19cde2"; // Your Spotify Client Secret
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';

    const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    return data.access_token;
}
function clearCategoriesAndTracks() {
    document.querySelector('.categories').innerHTML = '';
    document.querySelector('.trending-tracks').innerHTML = '';
}
// Function to search for artist or song
async function search(term) {
    clearCategoriesAndTracks();
    const accessToken = await fetchAccessToken();

    // Fetch data from Spotify API
    const response = await fetch(`https://api.spotify.com/v1/search?q=${term}&type=artist,track&limit=1`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const data = await response.json();

    // Check if the search result contains artists or tracks
    if (data.artists.items.length > 0) {
        // Artist found
        const artist = data.artists.items[0];
        displayArtist(artist);
    } else if (data.tracks.items.length > 0) {
        // Track found
        const track = data.tracks.items[0];
        displayTrack(track);
    } else {
        // No results found
        alert('No results found.');
    }
}

// Function to display artist information
function displayArtist(artist) {
    const artistInfo = document.getElementById('artist-info');
    artistInfo.innerHTML = `
        <div>
        <a href="/artist?id=${artist.id}">
        <img src="${artist.images[0].url}" alt="${artist.name}" width="200">
        </a>
        <h2>${artist.name}</h2>
        </div>
    `;
}

function displayTrack(track) {
    const artistInfo = document.getElementById('artist-info');
    artistInfo.innerHTML = `
        <div>
        
        <img src="${track.album.images[0].url}" alt="${track.name}" width="200">
       
        <h2>${track.name}</h2>
        </div>
    `;
}

document.querySelector('.search-bar input[type="text"]').addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        // If the Enter key is pressed, trigger the search action
        performSearch();
    }
});
document.querySelector('.search-bar button').addEventListener('click', performSearch);
const originalCategoriesContent = document.querySelector('.categories').innerHTML;
const originalTrendingTracksContent = document.querySelector('.trending-tracks').innerHTML;

function performSearch() {
    const searchTerm = document.querySelector('.search-bar input[type="text"]').value;
    if (searchTerm === '') {
       
        restoreCategoriesAndTracks();
    }
    else{
    search(searchTerm);
    }
}
function restoreCategoriesAndTracks() {
    // Set the innerHTML of categories and trending-tracks sections to their original content
    document.querySelector('.categories').innerHTML = originalCategoriesContent;
    document.querySelector('.trending-tracks').innerHTML = originalTrendingTracksContent;
    document.getElementById('artist-info').innerHTML = '';
}

// Add event listeners to categories
const categories = document.querySelectorAll('.category');
categories.forEach(category => {
    category.addEventListener('click', () => {
        const categoryName = category.textContent;
        const selectedType = 'category'; 
        fetchAndDisplaySongs(categoryName, selectedType);
    });
});

// Add event listeners to trending tracks
const trendingTracks = document.querySelectorAll('.track');
trendingTracks.forEach(track => {
    track.addEventListener('click', () => {
        const trackName = track.textContent;
        const selectedType = 'trending'; 
        fetchAndDisplaySongs(trackName, selectedType);
    });
});

async function fetchAndDisplaySongs(selectedItem, selectedType) {
   
        // Pass selected item and type to the result page
        const queryString = `type=${selectedType}&item=${encodeURIComponent(selectedItem)}`;
        window.location.href = `/result?${queryString}`;
    }

