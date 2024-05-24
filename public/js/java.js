//import {addClick2Song} from "./playlist.js"


var redirect = "http://localhost:3000/playlist";
var client_id = "f7307ada475e4b34ac69626209ee0d79"; //f7307ada475e4b34ac69626209ee0d79 mine   abdalla 6afe7714f2974fb494a0eb858a88c2e4
var client_secret = "615b7efbe7324750983956c9cb19cde2"; //615b7efbe7324750983956c9cb19cde2 mine  abdalla b6b2039ab21a45ce8eeeca2934c8eb22
const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
const ARTISTS = "https://api.spotify.com/v1/me/artists?offset=0&limit=2&time_range=long_term";
const TRACKS = "https://api.spotify.com/v1/me/tracks";
var RECOMMENDATIONS = "https://api.spotify.com/v1/recommendations?";//seed_artists=58oPVy7oihAEXE0Ott6JOf,4BKC2HOGEqtYz2Xbgp9N1q&seed_genres=0JQ5DAqbMKFziKOShCi009,0JQ5DAqbMKFQ00XGBls6ym&limit=15
const POPULAR ="https://api.spotify.com/v1/recommendations?seed_artists=5D2ui1KD49TfyCDb35zf5V,56chSp36PsMhpQvUn1kdR3,&seed_genres=0JQ5DAqbMKFSi39LMRT0Cy,0JQ5DAqbMKFCfObibaOZbv&limit=15";
var POPULARARTIST = "https://api.spotify.com/v1/artists?ids=";
var menuSongList = document.getElementsByClassName("menu_song")[0];
var recommendedSongList = document.getElementsByClassName("recommended_songs")[0];
var popularSongList = document.getElementsByClassName("pop_song")[0];
var uniqueSet = [];
uniqueSet.push("58oPVy7oihAEXE0Ott6JOf");
uniqueSet.push("0Riv2KnFcLZA3JSVryRg4y");
uniqueSet.push("0RrQBLmeSCUkYFs0vncrhb");
uniqueSet.push("2I4hRNCYkPKJQlkoEZKjYx");
uniqueSet.push("53XhwfbYqKCa1cC15pYq2q");
uniqueSet.push("4AK6F7OLvEQ5QYCBNiQWHq");
uniqueSet.push("2IeMt1qx6ZVt1HFjdfE5tl");
uniqueSet.push("0bAsR2unSRpn6BQPEnNlZm");
uniqueSet.push("3eNYrVLcWfjJ9JdH9kiPJO");
uniqueSet.push("0iEtIxbK0KxaSlF7G42ZOp");
uniqueSet.push("7dGJo4pcD2V6oG8kP0tJRR");
uniqueSet.push("56chSp36PsMhpQvUn1kdR3");

let currentSongIndex = 0; // Track the current song index
 // Store the list of top tracks
let isShuffleEnabled = false; // Track shuffle state
let shuffleOrder = []; // Track the shuffle order
let currentAudio = null;
let playPauseIcon = null; // Reference to the play/pause icon
let topTracks=[];

var popularArtistList = document.getElementsByClassName("item")[0];


function authorize() {
    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect);
    url += "&show_dialog=true";
    url += "&scope=user-read-playback-state playlist-read-private user-library-read";  //old user-read-private user-read-email user-read-playback-state user-top-read
    window.location.href = url;
}



function onPageLoad() {
    if (window.location.search.length > 0) {
        //alert("redirect")
        handleRedirect();
        loadSpotifySDK();
    }
    else {
        //alert("onload eshta8al")
        getSongs();
    }
}

function handleRedirect() {
    let code = getCode();
    fetchAccessToken(code);
    window.history.pushState("","", redirect);
}

function getCode() {
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0) {
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
    }
    return code;
}

function fetchAccessToken (code) {
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthApi(body);
}

function callAuthApi(body) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa (client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthResponse;
}

function refreshAccessToken() {
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthApi(body);
}

function handleAuthResponse() {
    if(this.status == 200) {
        //alert("handle auth")
        var data = JSON.parse(this.responseText);
        if (data.access_token != undefined) {
            access_token = data.access_token;
            //alert(access_token)
            localStorage.setItem("access_token", access_token);
        }
        if (data.refresh_token != undefined) {
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        getSongs();
    }
    else{
        console.log(this.responseText);
        //alert(this.responseText);
    }
}
function getSongs() {
    callApi("GET", TRACKS, null, handleSongResponse), // for menu songs
    prepare_recommendedSongsApi();
    console.log("recom"+RECOMMENDATIONS);
    callApi("GET", RECOMMENDATIONS, null, handleRecommendationResponse), // for the recommended
    callApi("GET", POPULAR, null, handlePopularResponse) // for the popular

    prepare_popularArtistApi();
    callApi("GET", POPULARARTIST, null, handlePopularArtistsResponse);
}

function callApi (method, url, body, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    //alert(localStorage.getItem("access_token"));
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("access_token"));
    //alert("auth xhr");
    //alert('Authorization: '+ 'Bearer ' + localStorage.getItem("access_token"));
    xhr.send(body);
    xhr.onload = callback;
    //alert("api " + url + " done");
}

function handleSongResponse() {
    //alert("handle el songs raga3");
    if (this.status == 200) {
        
        var data = JSON.parse(this.responseText);
        console.log(data);
        
        menuSongListLoad(data);
        //alert("200");
    }
    else if (this.status == 401) {
        //alert("401");
        refreshAccessToken();
    }
    else {
        //alert("else error");
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function menuSongListLoad(data){

    for(i = 0; i < data.items.length; i++) {
        const songName = data.items[i].track.name;
        const albumImage = data.items[i].track.album.images[0].url;
        const artistName = data.items[i].track.album.artists[0].name;

        const song_list_item = document.createElement('li');
        const songNum_span = document.createElement('span');//done
        const song_image = document.createElement('img');//done
        const song_info_h5 = document.createElement('h5');//done
        const song_subtitle_div = document.createElement('div');//done
        const song_play_button_i = document.createElement('i');//done
        
        song_list_item.classList.add('song_item');
        song_subtitle_div.classList.add('subtitle')
        
        //span
        let text = (i+1).toString();
        if (text.length === 1) {
            text = '0' + text;
        }
        const textNode = document.createTextNode(text);
        songNum_span.appendChild(textNode);
        
        //image
        song_image.setAttribute('src', albumImage);
        song_image.setAttribute('alt', songName + " - " + artistName);

        //info
        const songNameNode = document.createTextNode(songName);
        const artistNameNode = document.createTextNode(artistName);
        song_subtitle_div.appendChild(artistNameNode);
        song_info_h5.appendChild(songNameNode);
        song_info_h5.appendChild(song_subtitle_div);
        
        //play button
        song_play_button_i.classList.add("bi", "playListPlay", "bi-play-circle-fill");
        song_play_button_i.id = i;
        
        //appending all of them
        song_list_item.appendChild(songNum_span);
        song_list_item.appendChild(song_image);
        song_list_item.appendChild(song_info_h5);
        song_list_item.appendChild(song_play_button_i);

        //console.log(" data.items[i].track:"+data.items[i].track)
        let TRACK = data.items[i].track;
        topTracks = data.items;
        song_list_item.addEventListener('click', () => {

            playSong(TRACK, i); // Add click event
        });
        //alert("after all of them");
        menuSongList.appendChild(song_list_item);
        //alert("item "+i+" done");
    }
}

function handleRecommendationResponse() {
    //alert("handle el songs raga3");
    if (this.status == 200) {
        
        var data = JSON.parse(this.responseText);
        console.log(data);
        
        recommendationListLoad(data);
        //alert("200");
    }
    else if (this.status == 401) {
        //alert("401");
        refreshAccessToken();
    }
    else {
        //alert("else error");
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function recommendationListLoad(data){
    for(i = 0; i < data.tracks.length; i++) {

        const songName = data.tracks[i].name;
        const albumImage = data.tracks[i].album.images[0].url;
        const artistName = data.tracks[i].artists[0].name;
        const artistId = data.tracks[i].artists[0].id;

        const song_list_item = document.createElement('li');
        const song_img_div = document.createElement('div');
        const song_img_img = document.createElement('img');
        const song_play_button_i = document.createElement('i');
        const song_info_h5 = document.createElement('h5');
        const song_subtitle_div = document.createElement('div');
        
        song_img_div.classList.add('img_play');
        song_subtitle_div.classList.add('subtitle')
        
        //image
        song_img_img.setAttribute('src', albumImage);
        song_img_img.setAttribute('alt', songName + " - " + artistName);

        //play button
        song_play_button_i.classList.add("bi", "playListPlay", "bi-play-circle-fill");
        song_play_button_i.id = i;

        //info
        const songNameNode = document.createTextNode(songName);
        const artistNameNode = document.createTextNode(artistName);
        song_subtitle_div.appendChild(artistNameNode);
        song_info_h5.appendChild(songNameNode);
        song_info_h5.appendChild(song_subtitle_div);

        song_img_div.appendChild(song_img_img);
        song_img_div.appendChild(song_play_button_i);

        song_list_item.appendChild(song_img_div);
        song_list_item.appendChild(song_info_h5);
        topTracks = data.tracks
        let TRACK = data.tracks[i]
        song_list_item.addEventListener('click', () => {

            playSong(TRACK, i); // Add click event
        });

        recommendedSongList.appendChild(song_list_item);
        uniqueSet.push(artistId);

    }
    //alert(uniqueSet.length);
}

function handlePopularResponse() {
    //alert("handle el songs raga3");
    if (this.status == 200) {
        
        var data = JSON.parse(this.responseText);
        console.log(data);
        
        popularListLoad(data);
        //alert("200");
    }
    else if (this.status == 401) {
        //alert("401");
        refreshAccessToken();
    }
    else {
        //alert("else error");
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function popularListLoad(data){
    for(i = 0; i < data.tracks.length; i++) {

        const songName = data.tracks[i].name;
        const albumImage = data.tracks[i].album.images[0].url;
        const artistName = data.tracks[i].artists[0].name;
        const artistId = data.tracks[i].artists[0].id;

        const song_list_item = document.createElement('li');
        const song_img_div = document.createElement('div');
        const song_img_img = document.createElement('img');
        const song_play_button_i = document.createElement('i');
        const song_info_h5 = document.createElement('h5');
        const song_subtitle_div = document.createElement('div');
        
        song_img_div.classList.add('img_play');
        song_subtitle_div.classList.add('subtitle')
        
        //image
        song_img_img.setAttribute('src', albumImage);
        song_img_img.setAttribute('alt', songName + " - " + artistName);

        //play button
        song_play_button_i.classList.add("bi", "playListPlay", "bi-play-circle-fill");
        song_play_button_i.id = i;

        //info
        const songNameNode = document.createTextNode(songName);
        const artistNameNode = document.createTextNode(artistName);
        song_subtitle_div.appendChild(artistNameNode);
        song_info_h5.appendChild(songNameNode);
        song_info_h5.appendChild(song_subtitle_div);

        song_img_div.appendChild(song_img_img);
        song_img_div.appendChild(song_play_button_i);

        song_list_item.appendChild(song_img_div);
        song_list_item.appendChild(song_info_h5);


        let TRACK = data.tracks[i]
        song_list_item.addEventListener('click', () => {

            playSong(TRACK, i); // Add click event
        });

        popularSongList.appendChild(song_list_item);

        uniqueSet.push(artistId);
        //alert(artistId.type);

    }
    //alert(uniqueSet.length);
}

function handlePopularArtistsResponse() {
    //alert("handle el songs raga3");
    if (this.status == 200) {
        
        var data = JSON.parse(this.responseText);
        console.log(data);
        
        popularArtistsListLoad(data);
        //alert("200");
    }
    else if (this.status == 401) {
        //alert("401");
        refreshAccessToken();
    }
    else {
        //alert("else error");
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function popularArtistsListLoad(data){
    for(i = 0; i < data.artists.length; i++) {
        const artistName = data.artists[i].name;
        const artistId = data.artists[i].id;
        const artistImage = data.artists[i].images[0].url;

        const song_img_li = document.createElement('li');
        const song_img_img= document.createElement('img');

        song_img_img.setAttribute('src',artistImage);
        song_img_img.setAttribute('alt',artistName);

        song_img_li.appendChild(song_img_img);

        song_img_li.addEventListener('click', () => {
            const artistUrl = '/artist?id='+artistId;
            window.location.href = artistUrl;
        });
        popularArtistList.appendChild(song_img_li);
    }
}


function prepare_popularArtistApi(){
    let artists = '';
    //alert(uniqueSet.length);
    for(let value of uniqueSet){
        artists = artists + value + ",";
        //alert("artists"+artists+"  unique"+value);
    }
    artists = artists.substring( 0 , artists.length-1);
    POPULARARTIST+=artists;
    POPULARARTIST += "&limit=10";
    //alert(POPULARARTIST);
}

function prepare_recommendedSongsApi(){
    
    let artists = 'seed_artists=';
    //alert(uniqueSet.length);
    //console.log("getItem(user_artist"+localStorage.getItem("user_artist"));
    let storedArtists = JSON.parse(localStorage.getItem("user_artist"));
    for(let value of storedArtists){
        artists = artists + value + ",";
        //alert("artists"+artists+"  unique"+value);
    }
    artists = artists.substring( 0 , artists.length-1);
    RECOMMENDATIONS+=artists;
    //alert(POPULARARTIST);

    genre = '&seed_genres=';
    let storedGenre = JSON.parse(localStorage.getItem("user_genre"));
    for(let value of storedGenre){
        genre = genre + value + ",";
        //alert("artists"+artists+"  unique"+value);
    }
    genre = genre.substring( 0 , artists.length-1);
    RECOMMENDATIONS+=genre;
    RECOMMENDATIONS += "&limit=15";
}


function removeMenuSongList() {
    //alert("remove");
    while (menuSongList.firstChild) {
        //alert("1")
        menuSongList.removeChild(menuSongList.firstChild);
    }
    //alert(" after  remove");
}








///////////////////////////////////////////////////// EMAAAAAAAAAAAAAAAAAAAAAAAAN //////////////////////////////////////////////////////////////////////////////////////////////////////////
async function fetchAccessTokenEman() {
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


async function loadSpotifySDK() {
    const script = document.createElement('script');
    script.src = "https://sdk.scdn.co/spotify-player.js";
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
        fetchAccessTokenEman().then(token => {
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

async function playSong(track, index) {
    try {
        const previewUrl = track.preview_url;
        const name = track.name;
        //data.items[i].track.album.images[0].url
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
        playSong(topTracks[shuffleOrder[currentSongIndex]], shuffleOrder[currentSongIndex]);
    } else {
        currentSongIndex = (currentSongIndex + 1) % topTracks.length;
        playSong(topTracks[currentSongIndex], currentSongIndex);
    }
}

function skipToPrevious() {
    if (isShuffleEnabled) {
        currentSongIndex = (currentSongIndex - 1 + shuffleOrder.length) % shuffleOrder.length;
        playSong(topTracks[shuffleOrder[currentSongIndex]], shuffleOrder[currentSongIndex]);
    } else {
        currentSongIndex = (currentSongIndex - 1 + topTracks.length) % topTracks.length;
        playSong(topTracks[currentSongIndex], currentSongIndex);
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

function bar()
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