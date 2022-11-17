function init(){
    // storing the object visibilities
    cardHolders.forEach(function(cardholder, index) {
        cardholder.id = index;
        cardHolderObjects.push(
            {
                id:index,
                cardholder:cardholder,
                visible:false,
                selected:false,
                matched:false
            }
        )
    })
}
// this will take all the card objects and flip them all together
function flipCard(cardHolderObject){
    // if we want to flip it manually we must re add the class name
    cardHolderObject.cardholder.childNodes.forEach(childImage => {
        if (!("flip" in childImage.classList) ){
            childImage.classList.add("flip");
        }
    })


    let cardFace = cardHolderObject.cardholder.querySelector(".cardFace");
    let cardBack = cardHolderObject.cardholder.querySelector(".cardBack");
    
    // in case they are not visible we must set the visibility to block
    cardFace.style.display = "block";
    cardBack.style.display = "block";
    
    // switch the styles
    let tempClass = cardFace.className;
    cardFace.className = cardBack.className;
    cardBack.className = tempClass;

    // flipping the visibility
    cardHolderObject.visible = ! cardHolderObject.visible
    
}
function stickCard(cardHolderObject, visible = false){

    let cardFace = cardHolderObject.cardholder.querySelector(".cardFace");
    let cardBack = cardHolderObject.cardholder.querySelector(".cardBack");
    
    if("flip" in cardFace.classList) cardFace.classList.remove("flip");
    if("flip" in cardBack.classList) cardBack.classList.remove("flip");
    // setting the
    if(visible && !cardHolderObject.visible ){
        cardBack.style.display = "none";
        cardFace.style.display = "block";
        cardHolderObject.visible = true;
    }else if(!visible && cardHolderObject.visible){
        cardBack.style.display = "block";
        cardFace.style.display = "none";
        cardHolderObject.visible = false;
    }
}
function flipCards() {
    cardHolderObjects.forEach(cardHolderObject => {
        flipCard(cardHolderObject);
    });
}
function swapElements(obj1, obj2) {

    // switch ids
    let tempId =  obj1.id;
    obj1.id = obj2.id;
    obj2.id = tempId;

    // switch visibility
    let tempVisibility =  obj1.visibility;
    obj1.visibility = obj2.visibility;
    obj2.visibility = tempVisibility;

    // switching holders
    obj1Holder = obj1.cardholder;
    obj2Holder = obj2.cardholder;  
    // save the location of obj2
    var parent2 = obj2Holder.parentNode;
    var next2 = obj2Holder.nextSibling;
    // special case for obj1 is the next sibling of obj2Holder
    if (next2 === obj1Holder) {
        // just put obj1Holder before obj2Holder
        parent2.insertBefore(obj1Holder, obj2Holder);
    } else {
        // insert obj2Holder right before obj1Holder
        obj1Holder.parentNode.insertBefore(obj2Holder, obj1Holder);

        // now insert obj1Holder where obj2Holder was
        if (next2) {
            // if there was an element after obj2Holder, then insert obj1Holder right before that
            parent2.insertBefore(obj1Holder, next2);
        } else {
            // otherwise, just append as last child
            parent2.appendChild(obj1Holder);
        }
    }
}
function shuffle(arr) {
    let array = [...arr];
    let currentIndex = array.length,  randomIndex; 
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}
function totalSelected(){
    let total = 0;
    cardHolderObjects.forEach(cardHolderObject => total += 1?cardHolderObject.selected:0)
    return total;
}

function showSelectedCards(){
    cardHolderObjects.forEach(cardHolderObject => {
        if(!cardHolderObject.visible && cardHolderObject.selected){
            // flipCard(cardHolderObject); // we don't need the animation 
            stickCard(cardHolderObject, visible=true); // if you uncomment this.. uncomment the one in the hide selected
        }
    });
}
function hideSelectedCards(unselect = false){
    cardHolderObjects.forEach(cardHolderObject => {
        if(cardHolderObject.visible && cardHolderObject.selected){
            // flipCard(cardHolderObject);
            stickCard(cardHolderObject, visible=false); // this still bugs :(
            if( unselect ){
                cardHolderObject.selected = false;
                cardHolderObject.cardholder.style.border = "none";
            }
        }
    });
}
function hideAllCards(){
    cardHolderObjects.forEach(cardHolderObject => {
        if(cardHolderObject.visible){
            flipCard(cardHolderObject);
        }
    });
}
function selectedMatching(){
    let ids = [];
    let objs = [];
    cardHolderObjects.forEach(cardHolderObject => {
        if(cardHolderObject.selected){
            ids.push(parseInt(cardHolderObject.cardholder.id));
            objs.push(cardHolderObject)
        }
    });

    if(ids.length  == 2){ // this should always be true
        let diff = Math.abs(ids[0] - ids[1]); // if the cards match their sum should be in this array [1, 5, 9, 13]
        let sum = ids[0] + ids[1];
        if ( diff == 1 && sum%4 == 1){
            objs.forEach(function(obj){
                obj.cardholder.style.border = '5px solid aqua';
                obj.matched = true;
                obj.selected = false;
            })
            // let's see how many elements are matched already
            countMatched(); // this function will automatically end the game if the maximum cards is reached
            return true;
        }
    }
    return false;
}
function addScore(score = 10){

    totalScore = parseInt(document.querySelector(".total-score").innerText);
    totalScore += score;
    document.querySelector(".total-score").innerText = totalScore;
    if(totalScore==80) alert("Congratulations !!!")
    if(totalScore > highScore ){
        highScore = totalScore;
        document.querySelector(".high-score").innerText = highScore;
    }
}
function timerCount(){
    console.log(timeLeft);
    if(timeLeft>0 && gameRunning){
        timeLeft -=1;
        setTimeout(timerCount, 1000);
        document.querySelector(".time-left").innerText = timeLeft+" s";
    }
    else{
        console.log("time ended");
        gameRunning = false;
    }
}
function countMatched(){
    let totalMatched = 0;
    cardHolderObjects.forEach(cardHolderObject => totalMatched += 1?cardHolderObject.matched:0);
    gameRunning = cardHolderObjects.length > totalMatched;
    if(!gameRunning){
        endCardFlip();
    }
}
function helpPlayer(){
    
    if(gameRunning){ 
        var notMatched = {
            found:false
        };
        cardHolderObjects.forEach(function(cardHolderObject){
            if (!cardHolderObject.matched && !notMatched.found){
                notMatched.found = true;
                notMatched.value = cardHolderObject;
                console.log("found not matching ", cardHolderObject)
            }
            if(notMatched.found && notMatched.value!=cardHolderObject){
                let nm = notMatched.value;
                let ids = [parseInt(nm.cardholder.id), parseInt(cardHolderObject.cardholder.id)];
                let objs = [nm, cardHolderObject];
                let diff = Math.abs(ids[0] - ids[1]); // if the cards match their sum should be in this array [1, 5, 9, 13]
                let sum = ids[0] + ids[1];
                if ( diff == 1 && sum%4 == 1){
                    objs.forEach(function(obj){
                        obj.cardholder.style.border = '3px solid red';
                        setTimeout(()=>{
                            obj.cardholder.style.border = 'none';
                            console.log("itar end");
                        }, 1500); // this function should take a function and keep running it until the time passes
                    })
                    
                }
            }

        })
    }
}
function shuffleCards(){
    for(let i = 0; i < 40; i++){
        shuffletorandom();
        console.log("clicked");
    }
}
function startCardFlip(){
    // enable the settings
    gameStarted = true;
    gameRunning = true;
    shuffleCards();
    timerCount();
    
    cardHolderObjects.forEach(cardHolderObject => {
        if(cardHolderObject.visible){
            flipCard(cardHolderObject);
        }
        cardHolder = cardHolderObject.cardholder;
        cardHolder.childNodes.forEach(childImage => {
            childImage.classList.remove("flip");
        })

        cardHolder.addEventListener("click", ()=>{
            if (!cardHolderObject.matched && gameRunning){ // if the cards isn't already matched
                cardHolderObject.selected = !cardHolderObject.selected
                selected = totalSelected()
                if (selected <= 2 ){
                    // this will show the border on the card when selected
                    if (cardHolderObject.selected ){
                        // cardHolderObject.cardholder.style.border="3px solid yellow";
                    }else{
                        cardHolderObject.cardholder.style.border = "none";
                    }
                    if (selected == 2){
                        // this will display the selected cards
                        showSelectedCards();
                        if(selectedMatching()){ // if the selected cards match
                            console.log("match");
                            addScore(10);
                        }else{
                            setTimeout(function(){
                                hideSelectedCards(unselect = true);
                            }, 1500)
                        }
                    }
                }
            }



        })
    });

    enableGameButtons();
    disableNonGameButtons();
    // disable the difficulty setting
    // document.getElementById("difficulty").disabled = true;


}
function endCardFlip(){
    cardHolderObjects.forEach(function(cardHolderObject) {
        
        cardHolderObject.cardholder.style.border = "none"; // free the border style
        cardHolderObject.matched = false;
        cardHolderObject.selected = false;

    })
    gameRunning = false;
    enableNonGameButtons();
    disableGameButtons();
    document.getElementById("difficulty").disabled = false;
    if(difficulty == "easy") document.querySelector(".help").disabled = true;
}
function resetCardFlip(){
    cardHolderObjects = [];
    cardField.innerHTML = resetCardFieldHTML;
    cardHolders = document.querySelectorAll(".card-holder")
    cardHolders.forEach(function(cardholder, index) {
        cardholder.id = index;
        cardHolderObjects.push(
            {
                id:index,
                cardholder:cardholder,
                visible:false,
                selected:false,
                matched:false
            }
        )
    })

    endCardFlip();

    totalScore = 0;
    document.querySelector(".total-score").innerText = totalScore;

}
function disableNonGameButtons(){
    document.querySelectorAll("button.non-game-button").forEach(button => {
        button.disabled = true;
    })
}
function enableNonGameButtons() {
    document.querySelectorAll("button.non-game-button").forEach(button => {
        button.disabled = false;
    })
}
function enableGameButtons() {
    document.querySelectorAll("button.game-button").forEach(button => {
        button.disabled = false;
        if (button.classList.contains("help") && difficulty != "easy"){
            button.disabled = true;
        }
    })
}
function disableGameButtons() {
    document.querySelectorAll("button.game-button").forEach(button => {
        button.disabled = true;
    })
}

// clickers setup

// shuffle 2 random cards
function shuffletorandom(){
    let n = 2;
    const shuffled = shuffle(cardHolderObjects);
    let selected = Array.from(shuffled).slice(0, n);
    swapElements(selected[0], selected[1]);

}
// show all 
// document.querySelector(".show-all").addEventListener("click",showAllCards)
// // hide all
// document.querySelector(".hide-all").addEventListener("click",hideAllCards)
// start start-card-flip game
document.querySelector(".start-card-flip").addEventListener("click",startCardFlip)
// end end-card-flip
document.querySelector(".end-card-flip").addEventListener("click",endCardFlip)
// reset Card Flip
document.querySelector(".reset-card-flip").addEventListener("click",resetCardFlip)
// the difficulty


// var radios = document.querySelectorAll('input[type=radio][name="difficulty"]');

function easy(){

    document.querySelector("button.help").disabled = false;
    timeLeft = 60;
    document.querySelector(".time-left").innerText = timeLeft+" s";
    document.querySelector('.help').style.display="inline-block";
}

function medium(){
        document.querySelector("button.help").disabled = false;
        timeLeft = 60;
        document.querySelector(".time-left").innerText = timeLeft+" s";
        document.querySelector('.help').style.display="none";
        
}         
function hard(){
    document.querySelector("button.help").disabled = false;
    timeLeft = 30;
    document.querySelector(".time-left").innerText = timeLeft+" s";
    document.querySelector('.help').style.display="inline-block";
   }



document.querySelector(".help").addEventListener("click",helpPlayer)

// game settings 
var gameStarted = false;
var gameRunning = false;
var totalScore = 0;
var difficulty = "easy";
var selected = 0;
var highScore = 0;
var timerStarted = false;
var timerRunning = false;
var timeLeft = 60; // default is easy

var cardField = document.querySelector(".card-field")
// on hover we'll set all the cards flip when hovering on them
// by default all the cards are visible 
var cardHolders = document.querySelectorAll(".card-holder");
var cardHolderObjects = [];
// these variables will be important for the reset
var resetCardFieldHTML = cardField.innerHTML;


init()