


// JavaScript functions to toggle between songs and albums
var songsSection = document.getElementById("songs");
var albumsSection = document.getElementById("albums");
const urlParams = new URLSearchParams(window.location.search);
const artistId = urlParams.get('id');
function showSongs() {
    fetchTopTracks();
    songsSection.style.display = "block";
    albumsSection.style.display = "none";
   
}

function showAlbums() {
    songsSection.style.display = "none";
    albumsSection.style.display = "block";
}

function show_albums_Songs() {
    
    songsSection.style.display = "block";
    albumsSection.style.display = "none";
   
}
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

async function fetchArtistData() {
    // const artistId = '6qqNVTkY8uBg9cP3Jd7DAH'; // Billie Eilish's Spotify ID
    const accessToken = await fetchAccessToken();

    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const data = await response.json();

    // Display artist data
    document.getElementById('artist-image').src = data.images[0].url;
    document.getElementById('artist-name').innerText = data.name;
}

async function fetchTopTracks() {
    // const artistId = '6qqNVTkY8uBg9cP3Jd7DAH'; // Billie Eilish's Spotify ID
    const accessToken = await fetchAccessToken();

    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const data = await response.json();

    // Display top tracks
    const tracksList = document.getElementById('songs');
    tracksList.innerHTML='';
    data.tracks.forEach(track => {
        const li = document.createElement('li');
        li.textContent = track.name;
        li.style.fontSize = '22px';
        li.style.paddingTop = '50px'; 
        if (track.album.images.length > 0) {
                    const img = document.createElement('img');
                    img.src = track.album.images[0].url;
                    img.alt = track.name;
                    img.style.width = '50px'; // Adjust image size as needed
                    li.appendChild(img);
                }

                tracksList.appendChild(li);
        
    });
}

async function fetchAlbums() {
    // const artistId = '6qqNVTkY8uBg9cP3Jd7DAH'; // Billie Eilish's Spotify ID
    const accessToken = await fetchAccessToken();

    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&limit=10`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const data = await response.json();

    // Display albums
    const albumsList = document.getElementById('albums');
    data.items.forEach(album => {
        const li = document.createElement('li');
        li.textContent = album.name;
        if (album.images.length > 0) {
            const img = document.createElement('img');
            img.src = album.images[0].url;
            img.alt = album.name;
            img.style.width = '50px'; // Adjust image size as needed
            li.appendChild(img);
        }
        li.addEventListener('click', async () => {
            // Clear existing songs
            const songsList = document.getElementById('songs');
            songsList.innerHTML = '';

            // Fetch songs in the album
            const albumId = album.id;
            const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const songsData = await response.json();
            songsData.items.forEach(song => {
                const li = document.createElement('li');
                li.textContent = song.name;
                li.style.fontSize = '22px';
                li.style.paddingTop = '50px'; 
                if (song.album && song.album.images && song.album.images.length > 0) {
                    const img = document.createElement('img');
                    img.src = song.album.images[0].url;
                    img.alt = song.name;
                    img.style.width = '50px'; 
                    li.appendChild(img);
                } else {
                    console.log("No image found for song:", song.name);
                }
                
                songsList.appendChild(li);
            });
                        
            show_albums_Songs();
                
        });
        albumsList.appendChild(li);
    });
}

// Call functions to fetch and display artist data
fetchArtistData();
fetchTopTracks();
fetchAlbums();

