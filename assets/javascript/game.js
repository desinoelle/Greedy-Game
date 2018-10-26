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

//Only allows dice selection after the first roll
var canSelect = false;

//Score variables (start at 0)
var p1score = 0;
var p2score = 0;
$("#p1score").text("Player One: " + p1score);
$("#p2score").text("Player Two: " + p2score);

function rollClick() {
    //Holds random dice roll
    var randomRoll;

    //Can now select dice for points
    canSelect = true;

    //Random dice roll
        for (var i = 0; i < dice.length; i++) {
            randomRoll = Math.floor(Math.random() * dice.length);
    
            //Only roll unselected dice
            if (selected[i] === false) {

                //Store dice rolls and change the image source
                if (randomRoll === 0) {
                    dice[i] = "one";
                    $("#die" + (i + 1)).attr("src", "assets/images/one.jpg");
                    //document.getElementById("die" + (i + 1)).src = "assets/images/one.jpg";
                }
                if (randomRoll === 1) {
                    dice[i] = "two";
                    $("#die" + (i + 1)).attr("src", "assets/images/two.jpg");
                    //document.getElementById("die" + (i + 1)).src = "assets/images/two.jpg";
                }
                if (randomRoll === 2) {
                    dice[i] = "three";
                    $("#die" + (i + 1)).attr("src", "assets/images/three.jpg");
                    //document.getElementById("die" + (i + 1)).attr("src", ) = "assets/images/three.jpg";
                }
                if (randomRoll === 3) {
                    dice[i] = "four";
                    $("#die" + (i + 1)).attr("src", "assets/images/four.jpg");
                    //document.getElementById("die" + (i + 1)).attr("src", ) = "assets/images/four.jpg";
                }
                if (randomRoll === 4) {
                    dice[i] = "five";
                    $("#die" + (i + 1)).attr("src", "assets/images/five.jpg");
                    //document.getElementById("die" + (i + 1)).attr("src", ) = "assets/images/five.jpg";
                }
                if (randomRoll === 5) {
                    dice[i] = "six";
                    $("#die" + (i + 1)).attr("src", "assets/images/six.jpg");
                    //document.getElementById("die" + (i + 1)).src = "assets/images/six.jpg";
                }
            }     
        }
    
    console.log(dice);
}

function endTurnClick() {
}

function imgClick(id) {

    //Only select if there has been a roll first
    if (canSelect === true) {

        //Give the image a border if selected
        for (var i = 0; i < dice.length; i++) {
            if (selected[i] === false && id === "die" + (i+1)) {
                $("#die" + (i + 1)).css("border", "2px solid red");
                selected[i] = true;
            }
            else if (selected[i] === true && id === "die" + (i+1)) {
                $("#die" + (i + 1)).css("border", "none");
                selected[i] = false;
            }
        }
    }

    console.log(selected);

}

function reset() {
    //Reset dice, set score to 0, and selected to false
    for (var i = 0; i < dice.length; i++) {
        if (i === 0) {
            dice[i] = "one";
            $("#die" + (i + 1)).css("border", "none");
            selected[i] = false;
            $("#die" + (i + 1)).attr("src", "assets/images/one.jpg");
        }
        if (i === 1) {
            dice[i] = "two";
            $("#die" + (i + 1)).css("border", "none");
            selected[i] = false;
            $("#die" + (i + 1)).attr("src", "assets/images/two.jpg");
        }
        if (i === 2) {
            dice[i] = "three";
            $("#die" + (i + 1)).css("border", "none");
            selected[i] = false;
            $("#die" + (i + 1)).attr("src", "assets/images/three.jpg");
        }
        if (i === 3) {
            dice[i] = "four";
            $("#die" + (i + 1)).css("border", "none");
            selected[i] = false;
            $("#die" + (i + 1)).attr("src", "assets/images/four.jpg");
        }
        if (i === 4) {
            dice[i] = "five";
            $("#die" + (i + 1)).css("border", "none");
            selected[i] = false;
            $("#die" + (i + 1)).attr("src", "assets/images/five.jpg");
        }
        if (i === 5) {
            dice[i] = "six";
            $("#die" + (i + 1)).css("border", "none");
            selected[i] = false;
            $("#die" + (i + 1)).attr("src", "assets/images/six.jpg");
        }
    }

    p1score = 0;
    p2score = 0;
    canSelect = false;

    console.log(dice, selected, p1score, p2score, firstRoll);
}

