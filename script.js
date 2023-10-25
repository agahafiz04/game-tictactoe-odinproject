let playerOne;
let playerTwo;

// Prototypal Inheritance Object Factory Function
// Create Player Factory
function createPlayer(name, mark) {
  const aliasName = "Tic-Tac-" + name;
  const marker = mark;

  return { name, aliasName, marker };
}

// Create Player Properties Factory (Inheritance)
function createPlayerProperties(name, mark) {
  const user = createPlayer(name, mark);

  let score = 0;

  const getScore = () => score;
  const giveScore = () => score++;

  return Object.assign({}, user, { getScore, giveScore });
}

// Revealing Module Pattern
const mainMenu = (function () {
  const choosePlayerEl = document.querySelector(".choose-player");
  const chooseComputerEl = document.querySelector(".choose-computer");
  const chooseThePlayerEl = document.querySelector(".choose-the-player");

  const formUlEl = document.querySelector(".form-ul");
  const buttonStart = document.querySelector(".button-start");
  const buttonBack = document.querySelector(".button-back");

  choosePlayerEl.addEventListener("click", () => {
    formUlEl.setAttribute("style", "display:unset");
    buttonStart.setAttribute("style", "display:unset");
    buttonBack.setAttribute("style", "display:unset");

    choosePlayerEl.setAttribute("style", "display:none");
    chooseComputerEl.setAttribute("style", "display:none");
    chooseThePlayerEl.setAttribute("style", "display:none");
  });

  buttonBack.addEventListener("click", () => {
    formUlEl.setAttribute("style", "display:none");
    buttonStart.setAttribute("style", "display:none");
    buttonBack.setAttribute("style", "display:none");

    choosePlayerEl.setAttribute("style", "display:unset");
    chooseComputerEl.setAttribute("style", "display:unset");
    chooseThePlayerEl.setAttribute("style", "display:unset");
  });

  const buttonEl = document.querySelector(".button-start");

  const menuModalEl = document.querySelector(".main-menu");
  const inputEl1 = document.querySelector("#name-1");
  const inputEl2 = document.querySelector("#name-2");

  buttonEl.addEventListener("click", function () {
    if (inputEl1.value == "" || inputEl2.value == "") {
    } else if (!inputEl1.value == "" && !inputEl2.value == "") {
      createObject();
    }
  });

  function createObject() {
    playerOne = createPlayerProperties(`${inputEl1.value}`, "X");
    playerTwo = createPlayerProperties(`${inputEl2.value}`, "O");

    menuModalEl.remove();

    startGame.createBoard();
    infoBoard.createInfoBoard();
    gameBoard.squareBoxEvent();
  }
})();

// Start Game Module (Initial)
const startGame = (function () {
  const rows = 3;
  const columns = 3;
  let rowsCount = 0;
  let columnsCount = 0;

  function createBoard() {
    const boardEl = document.querySelector(".tic-tac-board");
    boardEl.setAttribute(
      "style",
      `grid: repeat(${rows}, 1fr) / repeat(${columns}, 1fr)`
    );

    for (let i = 0; i < rows * columns; i++) {
      const createSquareBoxEl = document.createElement("div");
      const createSquareBoxParEl = document.createElement("p");

      createSquareBoxEl.classList.add("square-box");

      if (i % rows == 0) {
        rowsCount++;
      }

      if (i % columns == 0) {
        columnsCount = 0;
      }

      createSquareBoxEl.dataset.rows = rowsCount - 1;
      createSquareBoxEl.dataset.columns = columnsCount++;

      createSquareBoxEl.append(createSquareBoxParEl);
      boardEl.append(createSquareBoxEl);
    }
  }

  function getBoard() {
    return { rows, columns };
  }

  return { createBoard, getBoard };
})();

// GameBoard Module
const gameBoard = (function () {
  let board = startGame.getBoard();

  let rows = board.rows;
  let columns = board.columns;
  let gameBoard = [];

  let arrayValue = 0;

  initialGameBoardArray();

  function initialGameBoardArray() {
    for (let i = 0; i < rows; i++) {
      gameBoard[i] = [];
      for (let j = 0; j < columns; j++) {
        gameBoard[i][j] = arrayValue++;
      }
    }
  }

  let myElArray = [];

  function squareBoxEvent() {
    const squareBoxEl = document.querySelectorAll(".square-box");

    squareBoxEl.forEach((el) => {
      el.addEventListener("click", function () {
        myElArray.push(el);
      });

      el.addEventListener("click", squareBoxClick);
    });

    function handlerRemover() {
      squareBoxEl.forEach((el) => {
        el.removeEventListener("click", squareBoxClick);
      });
    }

    return { handlerRemover };
  }

  function squareBoxClick() {
    let el = myElArray.pop();

    const myElChild = el.firstElementChild;
    const myElColumns = el.getAttribute("data-columns");
    const myElRows = el.getAttribute("data-rows");

    renderMark(myElChild, myElColumns, myElRows);
    infoBoard.renderInfoBoard();

    let condition = winCondition.check();

    if (condition == "win" || condition == "draw") {
      squareBoxEvent().handlerRemover();
    }
  }

  function renderMark(elChild, elColumns, elRows) {
    if (typeof gameBoard[elRows][elColumns] == "string") {
      return;
    }

    if (elChild.textContent == "") {
      gameBoard[elRows][elColumns] = player.playerTurn().marker;
      elChild.textContent = gameBoard[elRows][elColumns];

      if (gameBoard[elRows][elColumns] == "X") {
        elChild.setAttribute("id", "p1");
      } else {
        elChild.setAttribute("id", "p2");
      }
    }
  }

  return { gameBoard, myElArray, squareBoxEvent, initialGameBoardArray };
})();

// Player Turn Module
const player = (function () {
  let currentTurn = 0;

  function playerTurn() {
    if (currentTurn === 0) {
      currentTurn = 1;
      return playerOne;
    } else if (currentTurn === 1) {
      currentTurn = 0;
      return playerTwo;
    }
  }

  function getCurrentTurn() {
    return currentTurn;
  }

  return { playerTurn, getCurrentTurn };
})();

// InfoBoard Turn Module
const infoBoard = (function () {
  const newH1El = document.createElement("h1");

  function createInfoBoard() {
    const infoBoardEl = document.querySelector(".info-board");
    infoBoardEl.append(newH1El);
    newH1El.innerHTML = `Current Turn : <span id="p1">${playerOne.name} (${playerOne.marker})</span> `;
  }

  function renderInfoBoard() {
    let currentTurn = player.getCurrentTurn();

    if (currentTurn == 0) {
      newH1El.innerHTML = `Current Turn : <span id="p1">${playerOne.name} (${playerOne.marker})</span>`;
    } else if (currentTurn == 1) {
      newH1El.innerHTML = `Current Turn : <span id="p2">${playerTwo.name} (${playerTwo.marker})</span>`;
    }
  }

  return { createInfoBoard, renderInfoBoard };
})();

// WinCondition Module
const winCondition = (function () {
  let boardArray = gameBoard.gameBoard;
  const boardCells = startGame.getBoard();

  let theWinner;

  const horizontalCheck = () => {
    const horizontalCheckX = (el) => el === `${playerOne.marker}`;
    const horizontalCheckO = (el) => el === `${playerTwo.marker}`;

    for (let i = 0; i < boardCells.columns; i++) {
      if (boardArray[i].every(horizontalCheckX)) {
        theWinner = "Player One";
        return true;
      } else if (boardArray[i].every(horizontalCheckO)) {
        theWinner = "Player Two";
        return true;
      }
    }
  };

  const verticalCheck = () => {
    let newArray = [];

    for (let i = 0; i < boardCells.columns; i++) {
      newArray[i] = [];
      for (let j = 0; j < boardCells.rows; j++) {
        newArray[i][j] = boardArray[j][i];
      }
    }

    const verticalCheckX = (el) => el === `${playerOne.marker}`;
    const verticalCheckO = (el) => el === `${playerTwo.marker}`;

    for (let i = 0; i < newArray.length; i++) {
      if (newArray[i].every(verticalCheckX)) {
        theWinner = "Player One";
        newArray = [];
        return true;
      } else if (newArray[i].every(verticalCheckO)) {
        theWinner = "Player Two";
        newArray = [];
        return true;
      }
    }
  };

  const diagonalCheck = () => {
    let newArray = [];

    newArray.push([boardArray[0][2], boardArray[1][1], boardArray[2][0]]);
    newArray.push([boardArray[0][0], boardArray[1][1], boardArray[2][2]]);

    const diagonalCheckX = (el) => el === `${playerOne.marker}`;
    const diagonalCheckO = (el) => el === `${playerTwo.marker}`;

    for (let i = 0; i < newArray.length; i++) {
      if (newArray[i].every(diagonalCheckX)) {
        theWinner = "Player One";
        newArray = [];

        return true;
      } else if (newArray[i].every(diagonalCheckO)) {
        theWinner = "Player Two";
        newArray = [];

        return true;
      }
    }
  };

  const initialCheck = () => {
    const horizontalCheckInitial = (el) => typeof el === "number";

    for (let i = 0; i < boardCells.columns; i++) {
      if (boardArray[i].some(horizontalCheckInitial)) {
        return true;
      }
    }
  };

  const check = () => {
    if (horizontalCheck() || diagonalCheck() || verticalCheck()) {
      endGame.removeBoard();
      endGame.congratsPlayer();
      endGame.createButton();
      return "win";
    } else if (!initialCheck()) {
      endGame.removeBoard();
      endGame.draw();
      endGame.createButton();

      return "draw";
    } else {
      return "init";
    }
  };

  const getWinner = () => {
    return theWinner;
  };

  const setWinner = () => {
    theWinner = null;
  };

  return { check, getWinner, setWinner };
})();

//  EndGame Module
const endGame = (function () {
  const boardEl = document.querySelector(".board");
  const divEl = document.createElement("div");
  divEl.classList.add("end-game");

  const infoBoardEl = document.querySelector(".info-board");
  const ticTacBoard = document.querySelector(".tic-tac-board");
  const scoreBoard = document.querySelector(".score-board");

  function removeBoard() {
    // while (boardEl.firstChild) {
    //    boardEl.removeChild(boardEl.firstChild);
    // }
    infoBoardEl.classList.add("hide");
    ticTacBoard.classList.add("hide");
    scoreBoard.classList.add("hide");

    gameBoard.gameBoard = [];
    gameBoard.initialGameBoardArray();
    gameBoard.myElArray = [];

    boardEl.append(divEl);
  }

  function createButton() {
    winCondition.setWinner();

    const buttonEl1 = document.createElement("button");
    const buttonEl2 = document.createElement("button");

    buttonEl1.classList.add("button-reset");
    buttonEl2.classList.add("button-menu");

    buttonEl1.textContent = "Play Again?";
    buttonEl2.textContent = "Main Menu";

    divEl.append(buttonEl1, buttonEl2);

    buttonEl1.addEventListener("click", () => {
      const squareBox = document.querySelectorAll(".square-box");

      squareBox.forEach((item) => {
        item.childNodes.forEach((item) => {
          item.textContent = "";
        });
      });

      infoBoardEl.classList.remove("hide");
      ticTacBoard.classList.remove("hide");
      scoreBoard.classList.remove("hide");

      infoBoard.createInfoBoard();
      gameBoard.squareBoxEvent();

      const winnerEl = document.querySelector(".winner");

      winnerEl.remove();

      buttonEl1.remove();
      buttonEl2.remove();
      divEl.remove();
    });

    buttonEl2.addEventListener("click", () => {
      location.reload();
    });
  }

  function congratsPlayer() {
    const congratsTitle = document.createElement("h1");
    congratsTitle.classList.add("winner");
    divEl.append(congratsTitle);

    if (winCondition.getWinner() == "Player One") {
      congratsTitle.innerHTML = `Congratulation <br><span id="p1">${playerOne.name}</span><br> You Won The Game!`;
    } else if (winCondition.getWinner() == "Player Two") {
      congratsTitle.innerHTML = `Congratulation <br><span id="p2">${playerTwo.name}</span><br> You Won The Game!`;
    }
  }

  function draw() {
    const congratsTitle = document.createElement("h1");
    congratsTitle.classList.add("winner");
    divEl.append(congratsTitle);

    congratsTitle.innerHTML = `Its A Draw!`;
    congratsTitle.setAttribute("style", "text-align: center; color: white;");
  }

  return { removeBoard, congratsPlayer, draw, createButton };
})();

// VS Computer (AI) Module
