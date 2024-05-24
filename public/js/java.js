var redirect = "http://localhost:3000/playlist";
var client_id = "f7307ada475e4b34ac69626209ee0d79"; //f7307ada475e4b34ac69626209ee0d79 mine   abdalla 6afe7714f2974fb494a0eb858a88c2e4
var client_secret = "615b7efbe7324750983956c9cb19cde2"; //615b7efbe7324750983956c9cb19cde2 mine  abdalla b6b2039ab21a45ce8eeeca2934c8eb22
const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token"
const ARTISTS = "https://api.spotify.com/v1/me/artists?offset=0&limit=2&time_range=long_term"
const TRACKS = "https://api.spotify.com/v1/me/tracks";
const RECOMMENDATIONS = "https://api.spotify.com/v1/recommendations?seed_artists=58oPVy7oihAEXE0Ott6JOf,4BKC2HOGEqtYz2Xbgp9N1q&seed_genres=0JQ5DAqbMKFziKOShCi009,0JQ5DAqbMKFQ00XGBls6ym&limit=15";
const POPULAR ="https://api.spotify.com/v1/recommendations?seed_artists=0Riv2KnFcLZA3JSVryRg4y,56chSp36PsMhpQvUn1kdR3,&seed_genres=0JQ5DAqbMKFSi39LMRT0Cy,0JQ5DAqbMKFCfObibaOZbv&limit=15";
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

    console.log("fname:"+localStorage.getItem("user_Fname"));
    console.log("lname:"+localStorage.getItem("user_Lname"));
    console.log("mail:"+localStorage.getItem("user_email"));
    console.log("pw:"+localStorage.getItem("user_password"));
    console.log("genre:"+localStorage.getItem("user_genre"));
    console.log("artist:"+localStorage.getItem("user_artist"));
    console.log("country:"+localStorage.getItem("user_country"));
    //alert("item count "+ data.items.length);
    //removeMenuSongList();
    //alert("item count "+ data.items.length);
    for(i = 0; i < data.items.length; i++) {
        //alert(data.items[i].track.name);
        //alert(data.items[i].track.album.images[0].url);
        //alert(data.items[i].track.album.artists[0].name);
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


        popularArtistList.appendChild(song_img_li);
    }
}


function prepare_popularArtistApi(){
    artists = '';
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


function removeMenuSongList() {
    //alert("remove");
    while (menuSongList.firstChild) {
        //alert("1")
        menuSongList.removeChild(menuSongList.firstChild);
    }
    //alert(" after  remove");
}