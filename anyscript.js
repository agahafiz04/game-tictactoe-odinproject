/**
 * Checks if a player has filled a row.
 * If someone filled a row it returns true, else it returns false.
 * @param {gameBoard} board - call with the gameBoard
 */
const _checkForRows = (board) => {
  for (let i = 0; i < 3; i++) {
    let row = [];
    for (let j = i * 3; j < i * 3 + 3; j++) {
      row.push(board.getField(j));
    }

    if (
      row.every((field) => field == "X") ||
      row.every((field) => field == "O")
    ) {
      return true;
    }
  }
  return false;
};

/**
 * Checks if a player has filled a column.
 * If someone filled a column it returns true, else it returns false.
 * @param {gameBoard} board - call with the gameBoard
 */
const _checkForColumns = (board) => {
  for (let i = 0; i < 3; i++) {
    let column = [];
    for (let j = 0; j < 3; j++) {
      column.push(board.getField(i + 3 * j));
    }

    if (
      column.every((field) => field == "X") ||
      column.every((field) => field == "O")
    ) {
      return true;
    }
  }
  return false;
};

/**
 * Checks if a player has filled a diagonal.
 * If someone filled a diagonal it returns true, else it returns false.
 * @param {gameBoard} board - call with the gameBoard
 */
const _checkForDiagonals = (board) => {
  diagonal1 = [board.getField(0), board.getField(4), board.getField(8)];
  diagonal2 = [board.getField(6), board.getField(4), board.getField(2)];
  if (
    diagonal1.every((field) => field == "X") ||
    diagonal1.every((field) => field == "O")
  ) {
    return true;
  } else if (
    diagonal2.every((field) => field == "X") ||
    diagonal2.every((field) => field == "O")
  ) {
    return true;
  }
};

const checkForWin = (board) => {
  if (
    _checkForRows(board) ||
    _checkForColumns(board) ||
    _checkForDiagonals(board)
  ) {
    return true;
  }
  return false;
};

/**
 * Checks if the game is a draw.
 * If its a draw it returns true, else it returns false.
 * @param {gameBoard} board
 */
const checkForDraw = (board) => {
  if (checkForWin(board)) {
    return false;
  }
  for (let i = 0; i < 9; i++) {
    const field = board.getField(i);
    if (field == undefined) {
      return false;
    }
  }
  return true;
};
