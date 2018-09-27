//Greedy Game

//Array that holds dice values
var dice = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six"
];

//Array that determines which dice have been selected (starts as false)
var selected = [false, false, false, false, false, false];

//Variable that determines the first roll
var firstRoll = true;

//Score variables (start at 0)
var p1score = 0;
var p2score = 0;
var p1scoreDiv = document.getElementById("p1score");
var p2scoreDiv = document.getElementById("p2score");
p1scoreDiv.textContent = "Player One: " + p1score;
p2scoreDiv.textContent = "Player Two: " + p2score;

function rollClick() {
    //Holds random dice roll
    var randomRoll;

    //Random dice roll (first roll before anything is selected)
    if (firstRoll === true) {
        for (var i = 0; i < dice.length; i++) {
            randomRoll = Math.floor(Math.random() * dice.length);
    
            //Store dice rolls and change the image source
            if (randomRoll === 0) {
                dice[i] = "one";
                document.getElementById("die" + (i + 1)).src = "assets/images/one.jpg";
            }
            if (randomRoll === 1) {
                dice[i] = "two";
                document.getElementById("die" + (i + 1)).src = "assets/images/two.jpg";
            }
            if (randomRoll === 2) {
                dice[i] = "three";
                document.getElementById("die" + (i + 1)).src = "assets/images/three.jpg";
            }
            if (randomRoll === 3) {
                dice[i] = "four";
                document.getElementById("die" + (i + 1)).src = "assets/images/four.jpg";
            }
            if (randomRoll === 4) {
                dice[i] = "five";
                document.getElementById("die" + (i + 1)).src = "assets/images/five.jpg";
            }
            if (randomRoll === 5) {
                dice[i] = "six";
                document.getElementById("die" + (i + 1)).src = "assets/images/six.jpg";
            }
        }
    }

    //The user may only press the roll button again if they select at least one die with point value
    if (firstRoll === false) {
        for (var i = 0; i < dice.length; i++) {
            
        }
    }

    firstRoll = false;

    console.log(firstRoll);
    

    console.log(dice);
}

function endTurnClick() {
}

function imgClick(id) {

    //Give the image a border if selected
    for (var i = 0; i < dice.length; i++) {
        if (selected[i] === false && id === "die" + (i+1)) {
            document.getElementById("die" + (i + 1)).style.border = "2px solid red";
            selected[i] = true;
        }
        else if (selected[i] === true && id === "die" + (i+1)) {
            document.getElementById("die" + (i + 1)).style.border = "none";
            selected[i] = false;
        }
    }

    console.log(selected);

}

function reset() {
    //Reset dice, set score to 0, and selected to false
    for (var i = 0; i < dice.length; i++) {
        if (i === 0) {
            dice[i] = "one";
            document.getElementById("die" + (i + 1)).style.border = "none";
            selected[i] = false;
            document.getElementById("die" + (i + 1)).src = "assets/images/one.jpg";
        }
        if (i === 1) {
            dice[i] = "two";
            document.getElementById("die" + (i + 1)).style.border = "none";
            selected[i] = false;
            document.getElementById("die" + (i + 1)).src = "assets/images/two.jpg";
        }
        if (i === 2) {
            dice[i] = "three";
            document.getElementById("die" + (i + 1)).style.border = "none";
            selected[i] = false;
            document.getElementById("die" + (i + 1)).src = "assets/images/three.jpg";
        }
        if (i === 3) {
            dice[i] = "four";
            document.getElementById("die" + (i + 1)).style.border = "none";
            selected[i] = false;
            document.getElementById("die" + (i + 1)).src = "assets/images/four.jpg";
        }
        if (i === 4) {
            dice[i] = "five";
            document.getElementById("die" + (i + 1)).style.border = "none";
            selected[i] = false;
            document.getElementById("die" + (i + 1)).src = "assets/images/five.jpg";
        }
        if (i === 5) {
            dice[i] = "six";
            document.getElementById("die" + (i + 1)).style.border = "none";
            selected[i] = false;
            document.getElementById("die" + (i + 1)).src = "assets/images/six.jpg";
        }
    }

    firstRoll = true;

    p1score = 0;
    p2score = 0;

    console.log(dice, selected, p1score, p2score, firstRoll);
}

