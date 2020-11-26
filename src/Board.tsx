import React from "react";
import "./App.css";
import firstTable from "./TableInitialization";
import PiecesMovingLogic from "./PiecesMovingLogic";

type AppProps = {
  currentTurn: string;
  updateTurn: (turn: string) => void;
};

type BoardProps = {
  value: string;
  isCellMarked: boolean;
  color: string;
  isFirstMove: boolean;
};

const initArray = () => {
  const array: boolean[][] = [];

  for (let i = 0; i < 8; i++) {
    array.push([]);
    for (let j = 0; j < 8; j++) {
      var cell = false;
      array[i].push(cell);
    }
  }

  return array;
};

export const Board: React.FC<AppProps> = (props) => {
  const [board, updateBoard] = React.useState<
    {
      value: string;
      isCellMarked: boolean;
      color: string;
      isFirstMove: boolean;
    }[][]
  >(firstTable);
  const [isCellMarked, markCell] = React.useState(false);
  const [markedCell, markCellCoords] = React.useState({
    row: -1,
    column: -1,
  });

  const [possibleMoves, updatePossibleMoves] = React.useState<Boolean[][]>(
    initArray()
  );
  const [whiteKingPosition, updateWhiteKingPosition] = React.useState<{
    row: number;
    column: number;
  }>({
    row: 7,
    column: 4,
  });
  const [blackKingPosition, updateBlackKingPosition] = React.useState<{
    row: number;
    column: number;
  }>({
    row: 0,
    column: 4,
  });

  const KingMove = (clickedRow: number, clickedColumn: number) => {
    const isValidMove = PiecesMovingLogic(
      board,
      clickedRow,
      clickedColumn,
      markedCell.row,
      markedCell.column
    );

    if (isValidMove) {
      var boardString = JSON.stringify(board);
      var dummyBoard = JSON.parse(boardString);

      var piece = mapToPiece(dummyBoard[markedCell.row][markedCell.column]);
      dummyBoard[clickedRow][clickedColumn] = piece;
      dummyBoard[markedCell.row][markedCell.column].color = "";
      dummyBoard[markedCell.row][markedCell.column].value = "";
      dummyBoard[markedCell.row][markedCell.column].isFirstMove = false;
      dummyBoard[markedCell.row][markedCell.column].isCellMarked = false;

      piece.isFirstMove = false;
      piece.isCellMarked = false;

      for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
          if (props.currentTurn === "white") {
            if (dummyBoard[row][column].color === "black") {
              const isChess = PiecesMovingLogic(
                dummyBoard,
                whiteKingPosition.row,
                whiteKingPosition.column,
                row,
                column
              );

              if (isChess) {
                console.log("CHESS!");
                return true;
              }
            }
          } else {
            if (dummyBoard[row][column].color === "white") {
              const isChess = PiecesMovingLogic(
                dummyBoard,
                blackKingPosition.row,
                blackKingPosition.column,
                row,
                column
              );

              if (isChess) {
                console.log("CHESS!");
                return true;
              }
            }
          }
        }
      }
    }

    return false;
  };

  const SameColoredCellClickedWhileAnotherIsMarked = (
    row: number,
    column: number
  ) => {
    if (props.currentTurn === board[row][column].color) {
      const newBoard: BoardProps[][] = [...board];

      newBoard[row][column].isCellMarked = !newBoard[row][column].isCellMarked;
      newBoard[markedCell.row][markedCell.column].isCellMarked = !newBoard[
        markedCell.row
      ][markedCell.column].isCellMarked;

      markCellCoords({ row, column });
      updateBoard(newBoard);
    }
  };

  const PieceMoveClicked = (row: number, column: number) => {
    const willCauseChess = KingMove(row, column);
    if (willCauseChess) return;

    const isValidMove = PiecesMovingLogic(
      board,
      row,
      column,
      markedCell.row,
      markedCell.column
    );

    if (isValidMove) {
      let newBoard: BoardProps[][] = [...board];
      newBoard[row][column].isFirstMove = false;

      finishTurn(newBoard, row, column);

      newBoard[row][column].isCellMarked = false;
      updateBoard(newBoard);
      props.updateTurn(props.currentTurn === "white" ? "black" : "white");
    }
  };

  const resetCell = (board: BoardProps[][], row: number, column: number) => {
    const piece: BoardProps = mapToPiece(
      board[markedCell.row][markedCell.column]
    );

    board[row][column] = piece;
    board[markedCell.row][markedCell.column].color = "";
    board[markedCell.row][markedCell.column].value = "";
    board[markedCell.row][markedCell.column].isFirstMove = false;
    board[markedCell.row][markedCell.column].isCellMarked = false;

    return board;
  };

  const mapToPiece = (piece: BoardProps) => {
    const newPiece = {
      color: piece.color,
      isCellMarked: piece.isCellMarked,
      isFirstMove: piece.isFirstMove,
      value: piece.value,
    };

    return newPiece;
  };

  const onHoverEvent = (row: number, column: number) => {
    const hoverBoard: Boolean[][] = initArray();

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const isValidMove = PiecesMovingLogic(board, i, j, row, column);
        if (isValidMove && board[i][j].color !== board[row][column].color) {
          hoverBoard[i][j] = true;
        }
      }
    }

    updatePossibleMoves(hoverBoard);
  };

  const OnCellClick = (row: number, column: number) => {
    if (isCellMarked) {
      if (board[row][column].color === props.currentTurn) {
        SameColoredCellClickedWhileAnotherIsMarked(row, column);
      } else {
        PieceMoveClicked(row, column);
      }

      return;
    }

    if (props.currentTurn !== board[row][column].color) return;
    if (board[row][column].value === "") return;

    const newBoard: BoardProps[][] = [...board];

    finishTurn(newBoard, row, column);
  };

  const finishTurn = (
    newBoard: BoardProps[][],
    row: number,
    column: number
  ) => {
    newBoard[row][column].isCellMarked = !newBoard[row][column].isCellMarked;

    if (isCellMarked) resetCell(newBoard, row, column);

    markCell(!isCellMarked);
    markCellCoords({ row, column });
    updateBoard(newBoard);
  };

  const renderBoard = () => {
    return board.map((row, rowIndex) => {
      return (
        <tr key={rowIndex}>
          {row.map(
            (
              cell: {
                value: string;
                isCellMarked: boolean;
                color: string;
                isFirstMove: boolean;
              },
              columnIndex
            ) => {
              const borderColor = cell.isCellMarked
                ? "yellow"
                : possibleMoves[rowIndex][columnIndex]
                ? "red"
                : "white";

              if (cell.value !== "") {
                return (
                  <td
                    key={columnIndex}
                    className="content"
                    style={{ backgroundColor: borderColor }}
                  >
                    <img
                      src={require(`./${cell.color}/${cell.value}.png`).default}
                      onClick={() => OnCellClick(rowIndex, columnIndex)}
                      onMouseEnter={() => onHoverEvent(rowIndex, columnIndex)}
                      onMouseLeave={() => updatePossibleMoves(initArray())}
                      alt="piece"
                    />
                  </td>
                );
              } else if (!possibleMoves[rowIndex][columnIndex]) {
                return (
                  <td
                    key={columnIndex}
                    className="content"
                    style={{ backgroundColor: borderColor }}
                    onClick={() => OnCellClick(rowIndex, columnIndex)}
                  ></td>
                );
              } else {
                return (
                  <td
                    key={columnIndex}
                    className="content"
                    style={{ backgroundColor: "red" }}
                    onClick={() => OnCellClick(rowIndex, columnIndex)}
                  ></td>
                );
              }
            }
          )}
        </tr>
      );
    });
  };

  return (
    <table className="border">
      <tbody>{renderBoard()}</tbody>
    </table>
  );
};
