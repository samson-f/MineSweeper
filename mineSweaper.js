// ! MINE Sweeper

// ? MODEL
// TODO: metrice 10 x 10 -- Optional size in not nesacry..
// TODO: function to create mines.
// TODO: Function to count amount of mines around(ix, y).
// TODO: Function to find what's in square (right click).
// // TODO: Function to flag square (left function).
// TODO: Function to check if lost.
// TODO: Function to check if won.
// TODO: Function to restart after win/loss.
// -- Will hide all squares.
// --Will activate 'create mines's function
// ? VISUAL
// TODO: Board of squares, DIV: 1. not pressed, 2. num, 3. mine, 4. empty, -- 5. ?
// TODO: Button - new game.
// ? CONTROLLER
// TODO: Press on square
// TODO:Press on 'new game' button

// Game timer
class Timer{
    constructor () {
        this.isRunning = false;
        this.countSeconds = 0;
        this.countMinutes = 0;

        this.minSingTag = document.getElementById('minSing');
        this.secTensTag = document.getElementById('secTens');
        this.secSingTag = document.getElementById('secSing');
        this.minTensTag = document.getElementById('minTens');
    }
    start () {
        if (this.isRunning) return;
        this.isRunning = true;

        this.interval = setInterval(() => {
            this.countSeconds++;
            if (this.countSeconds == 60){
                this.countMinutes++;
                this.countSeconds = 0;
            }
            if (this.countMinutes == 100) this.pause();

            this.updateTime();
        }, 1000)
    }
    pause () {
        this.isRunning = false;
        clearInterval(this.interval);

        
    }
    reset () {
        // this.pause();
        this.countSeconds = 0;
        this.countMinutes = 0;
        this.updateTime();
    }
    updateTime () {
        this.a = this.secSingTag.innerText = this.countSeconds % 10;
        this.b = this.secTensTag.innerText = Math.floor(this.countSeconds / 10);
        this.c = this.minSingTag.innerText = this.countMinutes % 10;
        this.d = this.minTensTag.innerText = Math.floor(this.countMinutes / 10);
    }
}
const gameTimer = new Timer();


// ? MODEL
class MineSweeper {
    constructor() {
    this.board = this.createBoard();
    createBoard(this.board);
    this.gamesWon = 0;
    this.bestMin = 59;
    this.bestSec = 59;
    }

    newGame() {
    this.nonOpenedCells = 88;
    this.flags = 12;
    this.board = this.createBoard();
    createBoard(this.board);
    gameTimer.reset()
    }

    createBoard() {
    let board = [];
    for (let i = 0; i < 10; i++) {
        const row = [];
        for (let j = 0; j < 10; j++) {
        row.push(0);
        }
        board.push(row);
    }
    return board;
    }

    createMines(board, j, k) {
    let mines = 0;
    while (mines < 12) {
        let row = Math.floor(Math.random() * 10);
        let col = Math.floor(Math.random() * 10);

        let isNear = false;
        for (let m = j - 1; m <= j + 1; m++) {
            // if (m < 0 || m >= 10) continue;
            for (let l = k - 1; l <= k + 1; l++) {
                if (l < 0 || l >= 10 || m < 0 || m >= 10) continue;
                if (m == row && l == col) {
                    isNear = true;
                    break;
                }
            }
            if (isNear) continue;
        }

        if (!isNear && board[row][col] == 0) {
            board[row][col] = 1;
            mines++;
        }
    }
    }

    checkSquare(i, j) {
    if (this.board[i][j] >= 2) return; // isOut doesnt run for nothing;
    if (this.isOut(i, j)) return;
    this.countAround(i, j);
    this.isWon();
    }

    isOut(i, j) {
    if (this.board[i][j] == 1) {
        updateCell(i, j, 1, 0);
        document.querySelector("h1").innerHTML = "You lost!";
        this.activeGame = false;
        this.exposeMines();
        gameTimer.pause();
        return true;
    }
    }

    countAround(i, j) {
    if (this.board[i][j] >= 2) return;
    this.board[i][j] = 2; //Open
    this.nonOpenedCells--;

    let mineAround = 0;
    let coordinates = [];
    for (let k = i - 1; k <= i + 1; k++) {
        if (k < 0 || k >= 10) continue;
        for (let l = j - 1; l <= j + 1; l++) {
        if (l < 0 || l >= 10 || this.board[k][l] == 2) continue;

        if (this.board[k][l] == 0) coordinates.push([k, l]);
        else if (this.board[k][l] == 1 || this.board[k][l] == 4) mineAround++;
        }
    }
    updateCell(i, j, 0, mineAround);

    if (mineAround === 0)
        for (let [x, y] of coordinates) this.countAround(x, y);
    }

    isWon() {
    if (this.nonOpenedCells == 0) {
        document.querySelector("h1").innerHTML = "You won!";
        this.activeGame = false;
        this.exposeMines();
        gameTimer.pause()

        this.gamesWon = amountGamesWon(this.gamesWon);
        bestTime(gameTimer.a, gameTimer.b, gameTimer.c, gameTimer.d);
        this.bestMin = Number(gameTimer.d * 10) + Number(gameTimer.c );
        this.bestSec = Number(gameTimer.b * 10) + Number(gameTimer.a );     
    }
    }

    flagSquares(row, col) {
    if (this.flags > 0) {
        this.flags--;
        this.board[row][col] += 3;
        const cell = document.querySelector(
        `.cell[data-row='${row}'][data-col='${col}']`
        );
        cell.textContent = "🚩";
        updateFlagAmnt(this.flags);
    }
    }

    unFlagSqares(row, col) {
    this.flags++;
    this.board[row][col] -= 3;
    const cell = document.querySelector(
        `.cell[data-row='${row}'][data-col='${col}']`
    );
    cell.textContent = "";
    updateFlagAmnt(this.flags);
    }

    exposeMines() {
    for (let i = 0; i < 10; i++)
        for (let j = 0; j < 10; j++)
        if (this.board[i][j] == 1 || this.board[i][j] == 4) {
            const cell = document.querySelector(
            `.cell[data-row='${i}'][data-col='${j}']`
            );
            if (this.nonOpenedCells == 0) {
            cell.classList.add("mineWon");
            cell.textContent = "🫡";
            } else {
            cell.textContent = "💣";
            }
        }
    }
}


// ? VISUAL
const boardElement = document.getElementById("board");
let game = new MineSweeper();

function createBoard(board) {
  document.querySelector("h1").innerHTML = "Mine Sweeper!💣";
  document.getElementById('flagAmnt').innerText = '12';

  boardElement.innerHTML = "";
  for (let i = 0; i < board.length; i++)
    for (let j = 0; j < board[i].length; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      boardElement.appendChild(cell);
    }
}
// createBoard(game.board);

function updateCell(row, col, status, number) {
  const cell = document.querySelector(
    `.cell[data-row='${row}'][data-col='${col}']`
  );

  if (status == 1) {
    cell.classList.add("mine");
    cell.textContent = "💣";
  } else if (status == 0) {
    cell.classList.add("open");
    if (number) cell.textContent = number;
  }
} 

function updateFlagAmnt(flagAmnt) {
    document.getElementById('flagAmnt').innerText = `${flagAmnt}`;
}

// Update amount of games won.
const amountGamesWon = (counter) => {
  counter++;
  const spanTag = document.getElementById("gamesWon");
  spanTag.innerText = counter;
  return counter;
};

// Update best time
const bestTime = (s2, s1, m2, m1) => {
    if (Number(m1 * 10) + Number(m2) > game.bestMin ||
    (Number(m1 * 10) + Number(m2) == game.bestMin &&
    Number(s1 * 10) + Number(s2) > game.bestSec))
        return;

    const mi1 = document.getElementById('m1');
    const mi2 = document.getElementById('m2');
    const se1 = document.getElementById('s1');
    const se2 = document.getElementById('s2');

    mi1.textContent = m1
    mi2.textContent = m2
    se1.textContent = s1
    se2.textContent = s2
}


// ? CONTROLER
// Control right clicks on board
boardElement.addEventListener("click", (event) => {
    const target = event.target;
    const row = Number(target.dataset.row);
    const col = Number(target.dataset.col);
    if (target.classList.contains("cell") && !game.activeGame) {
        game.newGame();
        game.createMines(game.board, row, col);
        game.activeGame = true;
        gameTimer.reset();
        gameTimer.start();
    }
    if (target.classList.contains("cell") && game.activeGame) {

    game.checkSquare(Number(row), Number(col));
    }
});

// controll left clicks on board.
boardElement.addEventListener("contextmenu", (event) => {
  event.preventDefault(); // 
  const target = event.target;
  if (target.classList.contains("cell") && game.activeGame) {
    const row = Number(target.dataset.row);
    const col = Number(target.dataset.col);
    if (game.board[row][col] < 2) game.flagSquares(row, col);
    else if (game.board[row][col] > 2) game.unFlagSqares(row, col);
  }
});

// Reset game
function reset() {
  const btnReset = document.getElementById("resetBtn");

  btnReset.addEventListener("click", () => {
    game.activeGame = false;
    game.newGame();
    gameTimer.pause();
  });
}
reset();