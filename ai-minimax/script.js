/* Pseudocode
* 1. Basic setup of variables
* 2. Determine winner
* 3. Basic AI and winner notification
* 4. Apply Minimax algorithm
*/

var originalBoard;
const humanPlayer = "o";
const aiPlayer = "x";
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

const cells = document.querySelectorAll(".cell");
start();

function start() {
  document.querySelector(".end").style.display = "none";
  originalBoard = Array.from(Array(9).keys());
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
}

function turnClick(square) {
  console.log(square.target.id);
  if (typeof originalBoard[square.target.id] == "number") {
    turn(square.target.id, humanPlayer);
    // Let AI player take a turn, yet check if there's a tie in the game
    if (!checkTie()) turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  originalBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(originalBoard, player);
  if (gameWon) gameOver(gameWon);
}

// Determine winner

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) =>
    (e === player) ? a.concat(i) : a, []); //bug
  let gameWon = null;
  for (let [index, win] of winningCombinations.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winningCombinations[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == humanPlayer ? "#00d6ff" : "#ff4040";
  }
  for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
  declareWinner(gameWon.player == humanPlayer ? "You Win!" : "You lose!");
}

// Basic AI and winner notification
function emptySquares() {
  return originalBoard.filter(s => typeof s == "number");
}

function declareWinner(who) {
  document.querySelector(".end").style.display = "block";
  document.querySelector(".end .text").innerText = who;
}

function bestSpot() {
  // return emptySquares()[0];
  return minimax(originalBoard, aiPlayer).index;
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "#12e67b";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!")
      return true;
  }
  return false;
}

/* Implement AI Minimax Algorithm
*
* How does the Minimax algorithm works?
* 1. Returns a value if a terminal state is found (+10, 0, -10)
* 2. goes through available spots on the board
* 3. calls the minimax function on each available spot via recursion
* 4. evaluates the returning values from function calls
* 5. lastly, it returns the best value
*/

function minimax(newBoard, player) {
	var availableSpots = emptySquares();

	if (checkWin(newBoard, humanPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availableSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availableSpots.length; i++) {
		var move = {};
		move.index = newBoard[availableSpots[i]];
		newBoard[availableSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availableSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
