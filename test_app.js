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


app.use(express.urlencoded({extended: true}));
app.post('/register',(req,res)=>{
    //console.log(req.body);
    let user = User(req.body);
    user.save()
        .then((result=>{
            //res.redirect("/login");
        }))
        .catch((err)=>{
            console.log(err);
        })
        user_mail =  req.body.email;
})
app.use(express.urlencoded({extended: true}));
app.post('/sign_in',async (req,res)=>{
    await User.findOne({email: req.body.email , password: req.body.password})
    .then((result)=>{
        //console.log("this is the result"+result);
        if(result){
            user_mail =  req.body.email;
            //console.log("found the user");
            //Auth.authorize();
        }
        else{
            console.log("bruh");
        }
    })
    .catch((err)=>{
        console.log("wrong data");
    })
});

app.use(express.urlencoded({extended: true}));
app.post('/update_preference', (req,res)=>{
    console.log("genre "+req.body.genre);
    console.log("genre "+req.body.artist);
    console.log("country"+req.body.country);
    User.updateOne(
        { "email": user_mail },
        { 
          $set: { 
            "genre": req.body.genre,
            "artist": req.body.artist,
            "country": req.body.country
          } 
        }
      ).then(result => {
        //console.log("Document updated successfully:", result);
      }).catch(error => {
        console.error("Error updating document:", error);
      });
});

app.use(express.urlencoded({extended: true}));
app.post('/search_artist',async(req,res)=>{
    const options = {
        projection: {_id: 0 }, // Include only the email field
    };
    await Artist.findOne({Name : req.body.Name},options)
        .then((result)=>{
            if(result){
                console.log(result);
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
                console.log(result);
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










