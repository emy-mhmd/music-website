

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const item = urlParams.get('item');
    const header = document.querySelector('main h1');
    header.textContent = item;
    if (type && item) {
        fetchAndDisplayData(type, item);
    }
});
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
async function fetchAndDisplayData(selectedType, selectedItem) {
    const accessToken = await fetchAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?q=${selectedItem}&type=track`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    displayData(data);
}

function displayData(data) {
    const trackList = document.querySelector('.popular_artists');
    trackList.innerHTML = ''; // Clear previous results

    data.tracks.items.forEach(track => {
        // Create a div to hold track information
        const trackDiv = document.createElement('div');
        trackDiv.classList.add('track-item');

        // Create an image element for the track's album cover
        const albumImage = document.createElement('img');
        albumImage.src = track.album.images[0].url;
        albumImage.alt = track.name;
        albumImage.classList.add('album-cover');
        albumImage.style.width = '100px'; // Adjust as needed
        albumImage.style.height = '100px';
        trackDiv.appendChild(albumImage);

        // Create a div to hold track name
        const trackName = document.createElement('div');
        trackName.textContent = track.name;
        trackName.classList.add('track-name');
        trackDiv.appendChild(trackName);

        // Append the track div to the track list
        trackList.appendChild(trackDiv);
    });
    trackList.style.display = 'grid';
    trackList.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))'; // Adjust as needed
    trackList.style.gap = '20px'; 
}

