const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use('/js',express.static(__dirname + '/public/js'));
app.use('/css',express.static(__dirname + '/public/css'));
app.use('/images',express.static(__dirname + '/public/images'));


app.get('',(req,res)=>{
    res.sendFile(__dirname + "/views/login.html");
});
app.get('/playlist',(req,res)=>{
    res.sendFile(__dirname + "/views/playlist.html");
});
app.get('/about',(req,res)=>{
    res.sendFile(__dirname + "/views/about.html");
});
app.get('/artist',(req,res)=>{
    res.sendFile(__dirname + "/views/artist.html");
});
app.get('/choose_songs',(req,res)=>{
    res.sendFile(__dirname + "/views/choose_songs.html");
});
app.get('/login',(req,res)=>{
    res.sendFile(__dirname + "/views/login.html");
});
app.get('/playlist',(req,res)=>{
    res.sendFile(__dirname + "/views/playlist.html");
});
app.get('/profile',(req,res)=>{
    res.sendFile(__dirname + "/views/profile.html");
});
app.get('/result',(req,res)=>{
    res.sendFile(__dirname + "/views/result.html");
});
app.get('/search',(req,res)=>{
    res.sendFile(__dirname + "/views/search.html");
});
app.get('/subscription',(req,res)=>{
    res.sendFile(__dirname + "/views/subscription.html");
});


app.listen(port,()=>console.info('Listening on port '+port));