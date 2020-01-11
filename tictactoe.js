// *********************************** TIC TAC TOE ***********************************

const readline = require("readline");
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//Creating The Board
var rowOne = new Array(3).fill("_");
var rowTwo = new Array(3).fill("_");
var rowThree = new Array(3).fill("_");
var board = [rowOne, rowTwo, rowThree];
var isComputer = false;
var testing = false;

// This Starts the game with choosing to play against a computer or with a friend.
// You can also watch two computers play by inputting - test

computerOrNot();
function computerOrNot() {
  rl.question(
    `Enter "test" to watch two computers play, enter "y" to play against a computer, or "n" if you'd like to play with a human friend: `,
    response => {
      if (response.toLowerCase() === "test") {
        testing = true;
        return nextPlayer();
      }
      if (response.toLowerCase() === "y") {
        isComputer = true;
        return nextPlayer();
      }
      if (response.toLowerCase() === "n") {
        return nextPlayer();
      } else {
        console.log('please enter a valid response "y" or "n" or "test"!');
        computerOrNot();
      }
    }
  );
}
var turnCount = 1;
var marker = "";
const playerOne = "X";
const playerTwo = "O";
//this tests whether or not the next player should be a computer or a human
//and it also changes the marker ie - X or O
function nextPlayer() {
  if (turnCount % 2 > 0) {
    marker = playerOne;
    if (testing)
      setTimeout(function() {
        computerSelect(marker);
      }, 600);
    else
      setTimeout(function() {
        chooseSpot(marker);
      }, 600);
  } else if (turnCount % 2 === 0 && isComputer) {
    marker = playerTwo;
    setTimeout(function() {
      computerSelect(marker);
    }, 600);
  } else {
    marker = playerTwo;
    if (testing)
      setTimeout(function() {
        computerSelect(marker);
      }, 600);
    else
      setTimeout(function() {
        chooseSpot(marker);
      }, 600);
  }
}
//takes in user input and places their marker using this format - 0,1 - 0,0 - 1,2
function chooseSpot(marker) {
  console.log("------------------");
  console.log(rowOne);
  console.log(rowTwo);
  console.log(rowThree);
  console.log("------------------");
  rl.question(
    `Player: ${marker} Where would you like to place your next move? `,
    answer => {
      if (answer.length === 2) answer = answer.split("");
      else if (answer.includes(',') && answer.length === 3) answer = answer.split(",");
      else{ 
        // making this input improper for the proper inputs to evaluate as false
        answer = ["improperInput0", "improperInput1"];
      }

      var indexOne = parseInt(answer[0]);
      var indexTwo = parseInt(answer[1]);
      var properInputs =
        Number.isInteger(indexOne) &&
        Number.isInteger(indexTwo) &&
        indexOne > -1 &&
        indexOne < 3 &&
        indexTwo > -1 &&
        indexTwo < 3;

      if(!properInputs){
        console.log("You have entered an invalid value. Please select a square accoring to this chart -");
        console.log("------------------");
        console.log("[ '0,0', '0,1', '0,2' ]");
        console.log("[ '1,0', '1,1', '1,2' ]");
        console.log("[ '2,0', '2,1', '2,2' ]");
        console.log("------------------");
        chooseSpot(marker);
      } else if (board[indexOne] && board[indexOne][indexTwo] === "_") {
        board[indexOne][indexTwo] = marker;
        winOrNext(marker);
      } else if (!board[indexOne] || !board[indexOne][indexTwo]) {
        console.log("Sorry, that's not a spot on the board");
        chooseSpot(marker);
      } else {
        console.log("Sorry, that has already been selected. Please try again");
        chooseSpot(marker);
      }
    }
  );
}
// this could be improved by keeping track of this at the same time that
// the move is made, and only checking the potential wins from that move. So a hash map/object would probably be best
// but checking everytime like this here is the best way to go about it, in a limited amount of time
function checkBoard(marker) {
  var winner = null;
  winnerString = marker + marker + marker;
  columns = ["", "", ""];
  diagonal = ["", ""];
  for (var i = 0; i < 3; i++) {
    //checking rows for a winner
    var rows = board[i].join("");

    if (rows === winnerString) {
      winner = marker;
      break;
    }
    for (var k = 0; k < 3; k++) {
      columns[k] += board[i][k];
      if (columns[k] === winnerString) {
        winner = marker;
        i = 3;
        break;
      }
    }

    // there are only two possible diagaonals here,
    // so we're now going to concat all the strings together for each
    // one and compare it to the winner string
    // the if statements aren't really necessary here.
    // I did it this way so that I could visualize what's going on.
    if (i === 0) {
      diagonal[0] = board[i][0];
      diagonal[1] += board[i][2];
    } else if (i === 1) {
      diagonal[0] += board[i][1];
      diagonal[1] += board[i][1];
    }
    if (i === 2) {
      diagonal[0] += board[i][2];
      diagonal[1] += board[i][0];
    }
    if (diagonal.includes(winnerString)) {
      winner = marker;
      i = 3;
      break;
    }
  }
  return winner;
}

// this computer is very simple at the moment. It's only random for now.

function computerSelect(marker) {
  var availableSpacesIncrement = 0;
  var randomSelector = Math.floor(Math.random() * Math.floor(9 - turnCount));
  console.log(`Computer: ${marker} is choosing. `);
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (board[i][j] === "_") {
        // if the amount of iterations is equal to the
        // random number it will place a marker there and then break
        if (availableSpacesIncrement === randomSelector) {
          board[i][j] = marker;
          console.log("------------------");
          console.log(rowOne);
          console.log(rowTwo);
          console.log(rowThree);
          console.log("------------------");
          //there is probably a better way to break out of both of these loops,
          // so i=3 will have to work but I'm not sure at the moment
          i = 3;
          break;
        }
        availableSpacesIncrement++;
      }
    }
  }
  // we would probably want to map this graph out and then randomly select from the available spots
  // we could use a bfs to find the available spots and then randomly select
  // or pick a more intelligent way to play these if (playerone about to win) interrupt this win
  winOrNext(marker);
}
//checks to see if someone has won, if it's a draw or if it should go to the next player
function winOrNext(marker) {
  // no need to check if there aren't enough markers on the board
  if (turnCount < 5) {
    turnCount++;
    nextPlayer();
  } else {
    var winner = checkBoard(marker);

    if (winner) {
      console.log("**********************");
      console.log(rowOne);
      console.log(rowTwo);
      console.log(rowThree);
      console.log(`Player: ${winner} is the winner!`);
      console.log("**********************");
      process.exit();
    }
    // if there is no winner, we will increase the turn count and
    // do the loop again, unless turncount is === to 9
    // if that's the case we have a draw and the game is over
    else if (!winner && turnCount < 9) {
      turnCount++;
      nextPlayer();
    } else {
      console.log("||||||||||||||||||||||||");
      console.log(rowOne);
      console.log(rowTwo);
      console.log(rowThree);
      console.log("Sorry this game was a draw. Please try again");
      console.log("||||||||||||||||||||||||");
      process.exit();
    }
  }
}
