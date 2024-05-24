// JavaScript functions to toggle between songs and albums
var songsSection = document.getElementById("songs");
var albumsSection = document.getElementById("albums");
const urlParams = new URLSearchParams(window.location.search);
const artistId = urlParams.get('id');
let currentAudio = null; // Global variable to keep track of the currently playing audio element
let currentSongIndex = 0; // Track the current song index
let topTracks = []; // Store the list of top tracks
let isShuffleEnabled = false; // Track shuffle state
let shuffleOrder = []; // Track the shuffle order
let playPauseIcon = null; // Reference to the play/pause icon
let albumsongs=[];
flag="";

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
    const accessToken = await fetchAccessToken();

    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const data = await response.json();
    topTracks = data.tracks; // Store the top tracks

    // Display top tracks
    const tracksList = document.getElementById('songs');
    tracksList.innerHTML = '';
    data.tracks.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = track.name;
        li.style.fontSize = '22px';
        li.style.paddingTop = '50px';
        li.style.cursor= 'pointer';
        li.classList.add('songs-item')
        
        li.addEventListener('click', () => {
            flag="song";
            playSong(track, index,flag); // Add click event
        });
            
            
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
    const accessToken = await fetchAccessToken();

    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&limit=10`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const data = await response.json();

    // Display albums
    const albumsList = document.getElementById('albums');
    albumsList.innerHTML = '';

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
            topTracks=songsData.items;
            if (album.images.length > 0) {
                const albumImg = document.createElement('img');
                albumImg.src = album.images[0].url;
                albumImg.alt = album.name;
                albumImg.style.width = '100px'; // Adjust image size as needed
                songsList.appendChild(albumImg);
            }
            songsData.items.forEach((track, index) => {
                const li = document.createElement('li');
                li.textContent = track.name;
                li.style.fontSize = '22px';
                li.style.paddingTop = '50px';
                li.style.cursor= 'pointer';
                li.classList.add('songs-item');
            
                li.addEventListener('click', () =>{
                    flag="album";
                    playSong(track, index,flag);
                } ); // Modify this line
                songsList.appendChild(li);
            });
            
            

            show_albums_Songs();
        });
        albumsList.appendChild(li);
    });
}

async function loadSpotifySDK() {
    const script = document.createElement('script');
    script.src = "https://sdk.scdn.co/spotify-player.js";
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
        fetchAccessToken().then(token => {
            const player = new Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            // Error handling
            player.addListener('initialization_error', ({ message }) => { console.error(message); });
            player.addListener('authentication_error', ({ message }) => { console.error(message); });
            player.addListener('account_error', ({ message }) => { console.error(message); });
            player.addListener('playback_error', ({ message }) => { console.error(message); });

            // Playback status updates
            player.addListener('player_state_changed', state => { console.log(state); });

            // Ready
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            // Connect to the player
            player.connect();
        });
    };
}

async function playSong(track, index, flagg) {
    try {
        const previewUrl = track.preview_url;
        const name = track.name;
        let imageUrl;

        if (!previewUrl) {
            console.error('Preview URL not available.');
            return;
        }

        // Stop and remove the previous audio if any
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.remove();
        }

        // Select elements within the master_play section
        const masterPlaySection = document.querySelector('.master_play');
        const imgElement = masterPlaySection.querySelector('img');
        const songNameElement = masterPlaySection.querySelector('h5');
        playPauseIcon = masterPlaySection.querySelector('.bi-play-fill, .bi-pause-fill');

        // Update the song details
        if (flagg === "song") {
            imageUrl = track.album.images[0].url;
        }
        else if (flagg === "album") {
            imageUrl = track.images[0].url;
        }
        imgElement.src=imageUrl
        songNameElement.innerHTML = `${name}<br><div class="subtitle">Eve</div>`;

        // Append and play the new audio
        const audioElement = document.createElement('audio');
        audioElement.src = previewUrl;
        audioElement.controls = false; // We will manage controls via JS
        audioElement.autoplay = true;
        masterPlaySection.appendChild(audioElement);

        // Update the currentAudio reference
        currentAudio = audioElement;
        currentSongIndex = index; // Update the current song index

        // Handle play/pause functionality
        playPauseIcon.classList.remove('bi-play-fill');
        playPauseIcon.classList.add('bi-pause-fill');
        playPauseIcon.addEventListener('click', togglePlayPause);

        // Update the progress bar and volume
        audioElement.addEventListener('timeupdate', updateProgressBar);

        const seekBar = masterPlaySection.querySelector('#seek');
        seekBar.addEventListener('input', () => {
            audioElement.currentTime = (seekBar.value / 100) * audioElement.duration;
        });

        const volumeControl = masterPlaySection.querySelector('#vol');
        volumeControl.addEventListener('input', () => {
            audioElement.volume = volumeControl.value / 100;
        });

        // Handle song end to automatically play next song
        audioElement.addEventListener('ended', () => {
            skipToNext();
        });
    } catch (error) {
        console.error('Error in playSong:', error);
    }
}

function togglePlayPause() {
    if (currentAudio.paused) {
        currentAudio.play();
        playPauseIcon.classList.remove('bi-play-fill');
        playPauseIcon.classList.add('bi-pause-fill');
    } else {
        currentAudio.pause();
        playPauseIcon.classList.remove('bi-pause-fill');
        playPauseIcon.classList.add('bi-play-fill');
    }
}

function updateProgressBar() {
    const masterPlaySection = document.querySelector('.master_play');
    const seekBar = masterPlaySection.querySelector('#seek');
    const currentTimeElement = masterPlaySection.querySelector('#currentStart');
    const durationElement = masterPlaySection.querySelector('#currentEnd');
    
    if (currentAudio) {
        const currentTime = currentAudio.currentTime;
        const duration = currentAudio.duration;
        const progress = (currentTime / duration) * 100;

        seekBar.value = progress;
        currentTimeElement.textContent = formatTime(currentTime);
        durationElement.textContent = formatTime(duration);
    }
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function skipToNext() {
    if (isShuffleEnabled) {
        currentSongIndex = (currentSongIndex + 1) % shuffleOrder.length;
        playSong(topTracks[shuffleOrder[currentSongIndex]], shuffleOrder[currentSongIndex],flag);
    } else {
        currentSongIndex = (currentSongIndex + 1) % topTracks.length;
        playSong(topTracks[currentSongIndex], currentSongIndex,flag);
    }
}

function skipToPrevious() {
    if (isShuffleEnabled) {
        currentSongIndex = (currentSongIndex - 1 + shuffleOrder.length) % shuffleOrder.length;
        playSong(topTracks[shuffleOrder[currentSongIndex]], shuffleOrder[currentSongIndex],flag);
    } else {
        currentSongIndex = (currentSongIndex - 1 + topTracks.length) % topTracks.length;
        playSong(topTracks[currentSongIndex], currentSongIndex,flag);
    }
}

function shuffleTracks() {
    shuffleOrder = [...Array(topTracks.length).keys()];
    for (let i = shuffleOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffleOrder[i], shuffleOrder[j]] = [shuffleOrder[j], shuffleOrder[i]];
    }
}

function toggleShuffle() {
    isShuffleEnabled = !isShuffleEnabled;
    if (isShuffleEnabled) {
        shuffleTracks();
    } else {
        currentSongIndex = shuffleOrder[currentSongIndex]; // Reset current index to match original order
    }
}




document.addEventListener("DOMContentLoaded", () => {
    loadSpotifySDK();
    fetchArtistData();
    fetchTopTracks();
    fetchAlbums();

    // Add event listener for seek bar
    const seekBar = document.querySelector('.master_play #seek');
    seekBar.addEventListener('input', () => {
        const seekTo = (seekBar.value / 100) * currentAudio.duration;
        currentAudio.currentTime = seekTo;
    });

    // Add event listener for volume control
    const volumeControl = document.querySelector('.master_play #vol');
    volumeControl.addEventListener('input', () => {
        currentAudio.volume = volumeControl.value / 100;
    });

    // Add event listeners for next and previous buttons
    document.querySelector('.bi-skip-start-fill').addEventListener('click', skipToPrevious);
    document.querySelector('.bi-skip-end-fill').addEventListener('click', skipToNext);

    // Add event listener for shuffle button if exists
    const shuffleButton = document.querySelector('.bi-shuffle');
    if (shuffleButton) {
        shuffleButton.addEventListener('click', toggleShuffle);
    }
});

playPauseIcon.addEventListener('click', () => {
    if (currentAudio.paused) {
        currentAudio.play();
        playPauseIcon.classList.remove('bi-play-fill');
        playPauseIcon.classList.add('bi-pause-fill');
        updateLocalStorage(topTracks[currentSongIndex], currentSongIndex, isShuffleEnabled ? "shuffle" : "normal", true);
    } else {
        currentAudio.pause();
        playPauseIcon.classList.remove('bi-pause-fill');
        playPauseIcon.classList.add('bi-play-fill');
        updateLocalStorage(topTracks[currentSongIndex], currentSongIndex, isShuffleEnabled ? "shuffle" : "normal", false);
    }
});

// Event listener for when a new song starts playing
audioElement.addEventListener('playing', () => {
    updateLocalStorage(topTracks[currentSongIndex], currentSongIndex, isShuffleEnabled ? "shuffle" : "normal", true);
});

// Event listener for when a song ends
audioElement.addEventListener('ended', () => {
    skipToNext();
});


// When the play window loads, resume playback if there's any stored song information
window.addEventListener('DOMContentLoaded', () => {
    resumePlayback();
});