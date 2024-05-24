const express = require('express');
const mongoose = require('mongoose');
const User = require("./Models/users.js");
const Genre =require("./Models/genres.js");
const Artist=require("./Models/artists.js");
//const Auth = require("./public/js/java.js");
const app = express();
const PORT = 3000;
var user_mail = null;
const connectionString = 'mongodb+srv://samboz:M2uoggIDWhnGbJUV@beatbliss.x8gjrzh.mongodb.net/music?retryWrites=true&w=majority&appName=beatbliss';

mongoose.connect(connectionString)
    .then((result)=>{
        app.listen(PORT,()=>console.info('Listening on PORT '+PORT));
    })
    .catch((err)=>{
        console.log("failed to connect to database");
        console.log(err);
    })
;


app.use(express.static('public'));
app.use('/js',express.static(__dirname + '/public/js'));
app.use('/css',express.static(__dirname + '/public/css'));
app.use('/images',express.static(__dirname + '/public/images'));


app.get('',(req,res)=>{
    res.sendFile(__dirname + "/views/login.html");
});
app.get('/playlist',(req,res)=>{
    if(user_mail){
        res.sendFile(__dirname + "/views/playlist.html");
    }
    else{
        res.redirect('/login');
    }
});
app.get('/about',(req,res)=>{
    if(user_mail){
        res.sendFile(__dirname + "/views/about.html");
    }
    else{
        res.redirect('/login');
    }
});
app.get('/artist',(req,res)=>{
    if(user_mail){
        res.sendFile(__dirname + "/views/artist.html");
    }
    else{
        res.redirect('/login');
    }
});
app.get('/choose_songs',(req,res)=>{
    res.sendFile(__dirname + "/views/choose_songs.html");
});
app.get('/login',(req,res)=>{
    res.sendFile(__dirname + "/views/login.html");
});
app.get('/playlist',(req,res)=>{
    if(user_mail){
        res.sendFile(__dirname + "/views/playlist.html");
    }
    else{
        res.redirect('/login');
    }
});
app.get('/profile',(req,res)=>{
    if(user_mail){
        res.sendFile(__dirname + "/views/profile.html");
    }
    else{
        res.redirect('/login');
    }
});
app.get('/result',(req,res)=>{
    if(user_mail){
        res.sendFile(__dirname + "/views/result.html");
    }
    else{
        res.redirect('/login');
    }
});
app.get('/search',(req,res)=>{
    if(user_mail){
        res.sendFile(__dirname + "/views/search.html");
    }
    else{
        res.redirect('/login');
    }
});
app.get('/subscription',(req,res)=>{
    if(user_mail){
        res.sendFile(__dirname + "/views/subscription.html");
    }
    else{
        res.redirect('/login');
    }
});


app.use(express.urlencoded({ extended: true }));
app.post('/register', async (req, res) => {
    try {
        let user = new User(req.body);
        let result = await user.save();
        //console.log("the result in the register:"+result);
        res.status(200).send(result);
        user_mail = req.body.email;
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.use(express.urlencoded({extended: true}));
app.post('/sign_in', async (req, res) => {
    try {
        const result = await User.findOne({ email: req.body.email, password: req.body.password });
        if (result) {
            user_mail = req.body.email;
            console.log("found the user");
            //console.log(result.email);
            res.status(200).send(result);
        } else {
            console.log("bruh result is null");
            res.status(401).send("Invalid email or password");
        }
    } catch (err) {
        console.log("wrong data");
        res.status(500).send("Server error");
    }
});

app.use(express.urlencoded({extended: true}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Ensure JSON request bodies are parsed

app.post('/update_preference', async (req, res) => {
    try {
        // Debugging logs
        console.log("Received data:", req.body);

        // Perform the update
        const result = await User.updateOne(
            { email: user_mail },
            {
                $set: {
                    genre: req.body.genre,
                    artist: req.body.artist,
                    country: req.body.country
                }
            }
        );

        if (result.modifiedCount > 0) {
            const send_back = {
                genre: req.body.genre,
                artist: req.body.artist,
                country: req.body.country
            };
            res.status(200).send(send_back);
        } else {
            res.status(400).send("No preferences were updated");
        }
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).send("Server error");
    }
});

app.use(express.urlencoded({extended: true}));
app.post('/search_artist',async(req,res)=>{
    const options = {
        projection: {_id: 0 }, // Include only the email field
    };
    await Artist.findOne({Name : req.body.Name},options)
        .then((result)=>{
            if(result){
                //console.log(result);
                res.send(result)
            }
            else{
                console.log("artist result is nullfor name "+req.body.Name);
            }
        })
        .catch((err)=>{
            console.log("artist search error"+err+" for name"+req.body.Name);
        });
});


app.use(express.urlencoded({extended: true}));
app.post('/search_genre',async(req,res)=>{
    const options = {
        projection: {_id: 0 }, // Include only the email field
    };
    await Genre.findOne({Name : req.body.Name},options)
        .then((result)=>{
            if(result){
                //console.log(result);
                res.send(result)
            }
            else{
                console.log("genre result is null for name "+req.body.Name);
            }
        })
        .catch((err)=>{
            console.log("genre search error"+err+" for name"+req.body.Name);
        });
});

