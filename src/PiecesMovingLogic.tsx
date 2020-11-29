type BoardProps = {
  value: string;
  isCellMarked: boolean;
  color: string;
  isFirstMove: boolean;
};

type CoordsProps = {
  clickedRow: number;
  clickedColumn: number;
  currentRow: number;
  currentColumn: number;
};

let board: BoardProps[][],
  clickedRow: number,
  clickedColumn: number,
  currentRow: number,
  currentColumn: number;

const isValidMove = (
  gameBoard: BoardProps[][],
  wantedRow: number,
  wantedColumn: number,
  row: number,
  column: number
) => {
  board = gameBoard;
  clickedRow = wantedRow;
  clickedColumn = wantedColumn;
  currentRow = row;
  currentColumn = column;

  if (board[currentRow][currentColumn].value === "rook") {
    return isRookValidMove();
  }
  if (board[currentRow][currentColumn].value === "pawn") {
    return isPawnValidMove();
  }
  if (board[currentRow][currentColumn].value === "bishop") {
    return isBishopValidMove();
  }
  if (board[currentRow][currentColumn].value === "queen") {
    return isQueenValidMove();
  }
  if (board[currentRow][currentColumn].value === "king") {
    return isKingValidMove();
  }
  if (board[currentRow][currentColumn].value === "knight") {
    return isKnightValidMove();
  }
};

const isKnightValidMove = () => {
  if (
    Math.abs(clickedRow - currentRow) === 2 &&
    Math.abs(clickedColumn - currentColumn) === 1
  )
    return true;

  if (
    Math.abs(clickedRow - currentRow) === 1 &&
    Math.abs(clickedColumn - currentColumn) === 2
  )
    return true;

  return false;
};

const isKingValidMove = () => {
  if (
    Math.abs(clickedRow - currentRow) <= 1 &&
    Math.abs(clickedColumn - currentColumn) <= 1
  ) {
    return true;
  }

  return false;
};

const isQueenValidMove = () => {
  if (isRookValidMove() || isBishopValidMove()) return true;

  return false;
};

const isRookValidMove = () => {
  if (clickedRow !== currentRow && clickedColumn !== currentColumn)
    return false;

  if (clickedColumn === currentColumn) {
    for (
      let i = Math.min(currentRow, clickedRow) + 1;
      i < Math.max(currentRow, clickedRow);
      i++
    ) {
      if (board[i][clickedColumn].value !== "") return false;
    }
  } else {
    if (clickedRow === currentRow) {
      for (
        let i = Math.min(currentColumn, clickedColumn) + 1;
        i < Math.max(currentColumn, clickedColumn);
        i++
      ) {
        if (board[clickedRow][i].value !== "") return false;
      }
    }
  }

  return true;
};

const isBishopValidMove = () => {
  if (
    Math.abs(clickedRow - currentRow) !==
    Math.abs(clickedColumn - currentColumn)
  )
    return false;

  let row = currentRow < clickedRow ? currentRow + 1 : currentRow - 1;
  for (
    let column =
      currentColumn < clickedColumn ? currentColumn + 1 : currentColumn - 1;
    currentColumn < clickedColumn
      ? column < clickedColumn
      : column > clickedColumn;
    currentColumn > clickedColumn ? column-- : column++
  ) {
    if (board[row][column].value !== "") return false;

    row = currentRow < clickedRow ? row + 1 : row - 1;
  }

  return true;
};

const isPawnValidMove = () => {
  if (Math.abs(clickedColumn - currentColumn) > 1) return false;

  if (board[currentRow][currentColumn].color === "white") {
    if (clickedRow - currentRow < -2) {
      return false;
    }
    if (
      clickedRow - currentRow === -2 &&
      !board[currentRow][currentColumn].isFirstMove
    ) {
      return false;
    }
    if (clickedRow - currentRow === -1) {
      if (
        currentColumn === clickedColumn &&
        board[clickedRow][clickedColumn].value === ""
      ) {
        return true;
      }
      if (
        Math.abs(clickedColumn - currentColumn) === 1 &&
        board[clickedRow][clickedColumn].value !== ""
      ) {
        return true;
      }
    }

    if (
      clickedRow - currentRow === -2 &&
      Math.abs(clickedColumn - currentColumn) === 0 &&
      board[currentRow - 1][currentColumn].value === "" &&
      board[currentRow][currentColumn].isFirstMove &&
      board[clickedRow][clickedColumn].value === ""
    ) {
      return true;
    }
  } else {
    if (clickedRow - currentRow > 2) {
      return false;
    }
    if (
      clickedRow - currentRow === 2 &&
      !board[currentRow][currentColumn].isFirstMove
    ) {
      return false;
    }
    if (clickedRow - currentRow === 1) {
      if (
        currentColumn === clickedColumn &&
        board[clickedRow][clickedColumn].value === ""
      ) {
        return true;
      }
      if (
        Math.abs(clickedColumn - currentColumn) === 1 &&
        board[clickedRow][clickedColumn].value !== ""
      ) {
        return true;
      }
    }

    if (
      clickedRow - currentRow === 2 &&
      board[currentRow + 1][currentColumn].value === "" &&
      Math.abs(clickedColumn - currentColumn) === 0 &&
      board[currentRow][currentColumn].isFirstMove &&
      board[clickedRow][clickedColumn].value === ""
    ) {
      return true;
    }
  }

  return false;
};

export default isValidMove;
