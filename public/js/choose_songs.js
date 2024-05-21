
var buttonIndexFlag = [];
function ButtonData(text, clicked) {
  this.text = text;
  this.clicked = clicked;
  // You can add other properties here (e.g., style, additional data)
}
function isNotClicked(id,button){
    return buttonIndexFlag[id][button.textContent.slice(1)] === undefined || buttonIndexFlag[id][button.textContent.slice(1)].clicked == false
}

var genreClicked = [];
var artistClicked = [];
var countryClicked = [];

function add(id,item){
  if(item == "genre-container"){
    genreClicked.push(id);
    console.log(genreClicked);
    var serializedArray = JSON.stringify(genreClicked);
    localStorage.setItem("genre-container", serializedArray);
  }
  else if (item == "artist-container"){
    artistClicked.push(id);
    console.log(artistClicked);
    var serializedArray = JSON.stringify(artistClicked);
    localStorage.setItem("artist-container", serializedArray);
  }
  else {
    countryClicked.push(id);
    console.log(countryClicked);
    var serializedArray = JSON.stringify(countryClicked);
    localStorage.setItem("language-container", serializedArray);
  }
}

function remove(id,itemm){
  if(itemm == "genre-container"){
    genreClicked = array.filter(item => item !== id);
    var serializedArray = JSON.stringify(genreClicked);
    localStorage.setItem("genre-container", serializedArray);
  }
  else if (itemm == "artist-container"){
    artistClicked = array.filter(item => item !== id);
    var serializedArray = JSON.stringify(artistClicked);
    localStorage.setItem("artist-container", serializedArray);
  }
  else {
    countryClicked = array.filter(item => item !== id);
    var serializedArray = JSON.stringify(countryClicked);
    localStorage.setItem("language-container  ", serializedArray);
  }
}


function createbuttons(list , id) {
    buttonIndexFlag[id] = [] //set flag array for each function call
    var buttonContainer = document.getElementById(id); // Assuming an existing container
    for (let item of list) {       
        var newButton = document.createElement("button");
        newButton.classList.add("genre-button");
        newButton.textContent = '+ '+item; // Set button text to list item
        buttonContainer.appendChild(newButton);
        newButton.addEventListener("mouseover", function() {
          if(isNotClicked(id,this)){
              this.style.backgroundColor = "lightblue";
          }
        });
        newButton.addEventListener("mouseout", function() {
            if (isNotClicked(id,this)){
              this.style.backgroundColor = "";
            }
        });
        newButton.addEventListener("click", function() {
          if (isNotClicked(id,this)) {
              buttonIndexFlag[id][this.textContent.slice(1)] = new ButtonData(this.textContent.slice(1), true);
              this.textContent = '-'+this.textContent.slice(1);
              this.style.backgroundColor = "blue";
              add(item,id);
          }
          else{
            buttonIndexFlag[id][this.textContent.slice(1)].clicked =false;
              this.textContent = '+'+this.textContent.slice(1);
              this.style.backgroundColor = "";
              remove(item,id);
          }
          
        });
    }
}
function addButtons(){
    genre = ["Rock", "Hip-Hop", "Jazz", "J-Pop Hits", "K-pop", "Pop"]
    item="genre-container"
    createbuttons(genre,item);
    artists = ["Eve", "Post Malone", "Metro Boomin", "LISA", "Aimer"];
    item="artist-container"
    createbuttons(artists,item);
    language = ["Egypt", "Middle East", "Europe", "USA"];
    item="language-container";
    createbuttons(language,item);
}

window.onload = function() {
    addButtons()

  }


genreId = []
async function load_genre() {
    
    var genres = JSON.parse(localStorage.getItem("genre-container"));
    const genreId = [];

    // Create an array of promises
    const promises = genres.map(name => {
        return new Promise((resolve, reject) => {
            $.post('/search_genre', { Name: name })
                .done(function(response) {
                    console.log("genre " + name + " id: " + response.id);
                    genreId.push(response.id);
                    console.log(genreId + " da el id men el list");
                    resolve(response.id);
                })
                .fail(function(error) {
                    alert("error bruh" + error.responseText);
                    reject(error);
                });
        });
    });

    // Wait for all promises to complete
    await Promise.all(promises);

    //alert("shait maite" + JSON.stringify(genreId));
    return JSON.stringify(genreId);
}

artistId = []
async function load_artist() {

  var artists = JSON.parse(localStorage.getItem("artist-container"));
  const artistId = [];

  // Create an array of promises
  const promises = artists.map(name => {
      return new Promise((resolve, reject) => {
          $.post('/search_artist', { Name: name })
              .done(function(response) {
                  console.log("artist " + name + " id: " + response.id);
                  artistId.push(response.id);
                  resolve(response.id);
              })
              .fail(function(error) {
                  //alert("errorerer" + error.responseText);
                  reject(error);
              });
      });
  });

  // Wait for all promises to complete
  await Promise.all(promises);

  //alert("da? " + JSON.stringify(artistId));
  return JSON.stringify(artistId);
}