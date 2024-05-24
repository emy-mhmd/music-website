import {
    topTracks
}from './artist.js'


let currentSongIndex = 0; // Track the current song index
 // Store the list of top tracks
let isShuffleEnabled = false; // Track shuffle state
let shuffleOrder = []; // Track the shuffle order
export let currentAudio = null;
let playPauseIcon = null; // Reference to the play/pause icon
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


export async function loadSpotifySDK() {
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

export async function playSong(track, index) {
    try {
        const previewUrl = track.preview_url;
        const name = track.name;
        let imageUrl=track.album.images[0].url;

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

    
        imgElement.src=imageUrl
        songNameElement.innerHTML = `${name}<br><div class="subtitle"></div>`;

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

export function togglePlayPause() {
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

export function updateProgressBar() {
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

export function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

export function skipToNext() {
    if (isShuffleEnabled) {
        currentSongIndex = (currentSongIndex + 1) % shuffleOrder.length;
        playSong(topTracks[shuffleOrder[currentSongIndex]], shuffleOrder[currentSongIndex]);
    } else {
        currentSongIndex = (currentSongIndex + 1) % topTracks.length;
        playSong(topTracks[currentSongIndex], currentSongIndex);
    }
}

export function skipToPrevious() {
    if (isShuffleEnabled) {
        currentSongIndex = (currentSongIndex - 1 + shuffleOrder.length) % shuffleOrder.length;
        playSong(topTracks[shuffleOrder[currentSongIndex]], shuffleOrder[currentSongIndex]);
    } else {
        currentSongIndex = (currentSongIndex - 1 + topTracks.length) % topTracks.length;
        playSong(topTracks[currentSongIndex], currentSongIndex);
    }
}

export function shuffleTracks() {
    shuffleOrder = [...Array(topTracks.length).keys()];
    for (let i = shuffleOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffleOrder[i], shuffleOrder[j]] = [shuffleOrder[j], shuffleOrder[i]];
    }
}

export function toggleShuffle() {
    isShuffleEnabled = !isShuffleEnabled;
    if (isShuffleEnabled) {
        shuffleTracks();
    } else {
        currentSongIndex = shuffleOrder[currentSongIndex]; // Reset current index to match original order
    }
}

export function bar()
{
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
}