import React, { useEffect } from "react";
import "./App.css";
import firstTable from "./TableInitialization";
import PiecesMovingLogic from "./PiecesMovingLogic";
import Cell from "./Cell";
import initArray from "./InitArray";

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

  const [possibleMoves, updatePossibleMoves] = React.useState<boolean[][]>(
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
  const [check, updateIsChecked] = React.useState({
    isChecked: false,
    color: "",
  });

  const willMoveCauseSelfCheck = (
    clickedRow: number,
    clickedColumn: number,
    currentRowLoc: number = markedCell.row,
    currentColumnLoc: number = markedCell.column
  ) => {
    const isValidMove = PiecesMovingLogic(
      board,
      clickedRow,
      clickedColumn,
      currentRowLoc,
      currentColumnLoc
    );

    if (isValidMove) {
      var boardString = JSON.stringify(board);
      var dummyBoard = JSON.parse(boardString);

      var piece = mapToPiece(dummyBoard[currentRowLoc][currentColumnLoc]);
      dummyBoard[clickedRow][clickedColumn] = piece;
      dummyBoard[currentRowLoc][currentColumnLoc].color = "";
      dummyBoard[currentRowLoc][currentColumnLoc].value = "";
      dummyBoard[currentRowLoc][currentColumnLoc].isFirstMove = false;
      dummyBoard[currentRowLoc][currentColumnLoc].isCellMarked = false;

      piece.isFirstMove = false;
      piece.isCellMarked = false;

      for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
          if (piece.color === "white") {
            if (dummyBoard[row][column].color === "black") {
              console.log(piece);
              const isChess = PiecesMovingLogic(
                dummyBoard,
                piece.value === "king" ? clickedRow : whiteKingPosition.row,
                piece.value === "king"
                  ? clickedColumn
                  : whiteKingPosition.column,
                row,
                column
              );

              if (isChess) {
                updateIsChecked({ isChecked: true, color: "white" });
                console.log("white CHECK!");
                return true;
              }
            }
          } else {
            if (dummyBoard[row][column].color === "white") {
              const isChess = PiecesMovingLogic(
                dummyBoard,
                piece.value === "king" ? clickedRow : blackKingPosition.row,
                piece.value === "king"
                  ? clickedColumn
                  : blackKingPosition.column,
                row,
                column
              );

              if (isChess) {
                updateIsChecked({ isChecked: true, color: "black" });
                console.log("black CHECK!");
                return true;
              }
            }
          }
        }
      }
    }

    updateIsChecked({ isChecked: false, color: "" });
    return false;
  };

  const isKingMovePossible = () => {
    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 8; column++) {
        if (board[row][column].color === "black") {
          const isChess = PiecesMovingLogic(
            board,
            whiteKingPosition.row,
            whiteKingPosition.column,
            row,
            column
          );

          if (isChess) {
            console.log("white CHECK!");
            return false;
          }
        }
      }
    }
    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 8; column++) {
        if (board[row][column].color === "white") {
          const isChess = PiecesMovingLogic(
            board,
            blackKingPosition.row,
            blackKingPosition.column,
            row,
            column
          );

          if (isChess) {
            console.log("black CHECK!");
            return false;
          }
        }
      }
    }

    return true;
  };

  const isCheckToNextTurn = () => {
    if (props.currentTurn === "black") {
      for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
          if (board[row][column].color === "black") {
            const isChess = PiecesMovingLogic(
              board,
              whiteKingPosition.row,
              whiteKingPosition.column,
              row,
              column
            );

            if (isChess) {
              updateIsChecked({ isChecked: true, color: "white" });
              console.log("white CHECK!");
              return true;
            }
          }
        }
      }
    } else {
      for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
          if (board[row][column].color === "white") {
            const isChess = PiecesMovingLogic(
              board,
              blackKingPosition.row,
              blackKingPosition.column,
              row,
              column
            );

            if (isChess) {
              updateIsChecked({ isChecked: true, color: "black" });
              console.log("black CHECK!");
              return true;
            }
          }
        }
      }
    }

    return false;
  };

  const isCheckMate = () => {
    console.log(
      "did enter that checkmate:  " + check.color === "black",
      props.currentTurn === "black"
    );

    if (check.isChecked) {
      if (check.color === "black" && props.currentTurn === "black") {
        for (let row = 0; row < 8; row++) {
          for (let column = 0; column < 8; column++) {
            if (board[row][column].color === "white") {
              const isKingHasMoves = canKingMove(
                blackKingPosition.row,
                blackKingPosition.column
              );
              console.log("can he move:" + isKingHasMoves);
              return isKingHasMoves;
            }
          }
        }
      } else {
        for (let row = 0; row < 8; row++) {
          for (let column = 0; column < 8; column++) {
            if (board[row][column].color === "black") {
              const isKingHasMoves = canKingMove(
                whiteKingPosition.row,
                whiteKingPosition.column
              );
              console.log("can he move:" + isKingHasMoves);
              return isKingHasMoves;
            }
          }
        }
      }
    }
  };

  const canKingMove = (kingRow: number, kingColumn: number) => {
    for (let row = -1; row < 2; row++) {
      for (let column = -1; column < 2; column++) {
        if (row === 0 && column === 0) continue;

        console.log(kingRow + row, kingColumn + column);
        if (board[kingRow + row] && board[kingRow + row][kingColumn + column]) {
          if (row === 1 && column === -1) {
            console.log("/");
          }
          const isValidMove = isKingMovePossible();

          console.log("???  " + isValidMove);
          if (isValidMove) {
            console.log(row, column);
            return true;
          }
        }
      }
    }

    return false;
  };

  const PieceMoveClicked = (row: number, column: number) => {
    const willCauseChess = willMoveCauseSelfCheck(row, column);
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
      isCheckToNextTurn();
      props.updateTurn(props.currentTurn === "white" ? "black" : "white");
    }
  };

  const resetCell = (board: BoardProps[][], row: number, column: number) => {
    const piece: BoardProps = mapToPiece(
      board[markedCell.row][markedCell.column]
    );

    if (piece.value === "king") {
      if (piece.color === "white") {
        updateWhiteKingPosition({ row: row, column: column });
      } else {
        updateBlackKingPosition({ row: row, column: column });
      }
    }

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

  React.useEffect(() => {
    const isFinished: boolean | undefined = isCheckMate();

    if (isFinished) alert("VICTORY");
  }, [check.isChecked]);

  const onHoverEvent = (row: number, column: number) => {
    const hoverBoard: boolean[][] = initArray();

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
              return (
                <Cell
                  cell={cell}
                  key={columnIndex}
                  currentTurn={props.currentTurn}
                  rowIndex={rowIndex}
                  columnIndex={columnIndex}
                  OnCellClick={(row: number, column: number) =>
                    OnCellClick(row, column)
                  }
                  onHoverEvent={(row: number, column: number) =>
                    onHoverEvent(row, column)
                  }
                  updatePossibleMoves={(array: boolean[][]) =>
                    updatePossibleMoves(array)
                  }
                  possibleMoves={possibleMoves}
                />
              );
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
