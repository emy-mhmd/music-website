var buttonIndexFlag = [];
function ButtonData(text, clicked) {
  this.text = text;
  this.clicked = clicked;
  // You can add other properties here (e.g., style, additional data)
}
function isNotClicked(id,button){
    return buttonIndexFlag[id][button.textContent.slice(1)] === undefined || buttonIndexFlag[id][button.textContent.slice(1)].clicked == false
}



function createbuttons(list , id) {
    buttonIndexFlag[id] = [] //set flag array for each function call
    var buttonContainer = document.getElementById(id); // Assuming an existing container
    for (var item of list) {
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
          }
          else{
            buttonIndexFlag[id][this.textContent.slice(1)].clicked =false;
              this.textContent = '+'+this.textContent.slice(1);
              this.style.backgroundColor = "";
          }
          
        });
    }
}
function addButtons(){
    genre = ["Rock", "Rap", "Jazz", "JPOP", "Dupstep", "Dupstep"]
    id="genre-container"
    createbuttons(genre,id);
    artists = ["Eve", "Post Malone", "Metro", "Lisa", "Dupstep"];
    id="artist-container"
    createbuttons(artists,id);
    language = ["Arabic", "English", "Japanese", "Korean", "Dutch"];
    id="language-container";
    createbuttons(language,id);
}

window.onload = function() {
    addButtons()

  }