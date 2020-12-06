import React, { useEffect } from "react";
import "./App.css";
import firstTable from "./TableInitialization";
import PiecesMovingLogic from "./PiecesMovingLogic";
import Cell from "./Cell";
import initArray from "./InitArray";
import isValidMove from "./PiecesMovingLogic";
import { createModuleResolutionCache } from "typescript";

type CellProps = {
  value: string;
  isCellMarked: boolean;
  color: string;
  isFirstMove: boolean;
};

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

  // React.useEffect(() => {
  //   isCheckOnWhite();
  //   isCheckOnBlack();
  //   var isFinished: boolean | undefined;
  //   if (check.isChecked) {
  //     isFinished = isCheckMate();
  //     if (isFinished) console.log("VICTORY");
  //   }
  // });

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

      const isCheck =
        board[currentRowLoc][currentColumnLoc].color === "white"
          ? isCheckOnWhite(dummyBoard, clickedRow, clickedColumn)
          : isCheckOnBlack(dummyBoard, clickedRow, clickedColumn);

      if (!isCheck) {
        updateIsChecked({ isChecked: false, color: "" });
      }

      return isCheck;
    }

    return true;
  };

  const isCheckOnWhite = (
    dummyBoard: BoardProps[][] = board,
    clickedRow: number | undefined = undefined,
    clickedColumn: number | undefined = undefined
  ) => {
    var isKingMove = false;
    if (clickedColumn !== undefined && clickedRow !== undefined) {
      isKingMove =
        dummyBoard[clickedRow][clickedColumn].value === "king" &&
        dummyBoard[clickedRow][clickedColumn].color === "white";
    }

    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 8; column++) {
        if (dummyBoard[row][column].color === "black") {
          const isChess = PiecesMovingLogic(
            dummyBoard,
            isKingMove && clickedRow ? clickedRow : whiteKingPosition.row,
            isKingMove && clickedColumn
              ? clickedColumn
              : whiteKingPosition.column,
            row,
            column
          );

          if (isChess) {
            if (check.isChecked !== true)
              updateIsChecked({ isChecked: true, color: "white" });
            console.log("white CHECK!");
            return true;
          }
        }
      }
    }

    return false;
  };

  const isCheckOnBlack = (
    dummyBoard: BoardProps[][] = board,
    clickedRow: number | undefined = undefined,
    clickedColumn: number | undefined = undefined
  ) => {
    var isKingMove = false;
    if (clickedColumn !== undefined && clickedRow !== undefined) {
      isKingMove =
        dummyBoard[clickedRow][clickedColumn].value === "king" &&
        dummyBoard[clickedRow][clickedColumn].color === "black";
    }

    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 8; column++) {
        if (dummyBoard[row][column].color === "white") {
          const isChess = PiecesMovingLogic(
            dummyBoard,
            isKingMove && clickedRow ? clickedRow : blackKingPosition.row,
            isKingMove && clickedColumn
              ? clickedColumn
              : blackKingPosition.column,
            row,
            column
          );

          if (isChess) {
            if (check.isChecked !== true)
              updateIsChecked({ isChecked: true, color: "black" });
            console.log("black CHECK!");
            return true;
          }
        }
      }
    }

    return false;
  };

  const isCheckMate = () => {
    console.log("did enter that checkmate:  ", props.currentTurn === "black");

    const isCheckOnWhiteKing = isCheckOnWhite();
    const isCheckOnBlackKing = isCheckOnBlack();

    if (isCheckOnBlackKing) {
      const isKingHasMoves = canKingMove(
        blackKingPosition.row,
        blackKingPosition.column
      );
      console.log("can he move:" + isKingHasMoves);
      if (isKingHasMoves) return false;

      const canCaptureThreat = canCapturePieceThatThreatsKing(
        blackKingPosition.row,
        blackKingPosition.column
      );
      console.log("can capture:" + canCaptureThreat);

      if (canCaptureThreat) return false;

      const isPossibleBlock = isAnyPieceCanBlock(
        blackKingPosition.row,
        blackKingPosition.column
      );
      console.log("can block:" + isPossibleBlock);

      if (isPossibleBlock) return false;

      return true;
    } else if (isCheckOnWhiteKing) {
      const isKingHasMoves = canKingMove(
        whiteKingPosition.row,
        whiteKingPosition.column
      );
      console.log("can he move:" + isKingHasMoves);
      if (isKingHasMoves) return false;

      const canCaptureThreat = canCapturePieceThatThreatsKing(
        whiteKingPosition.row,
        whiteKingPosition.column
      );
      console.log("can capture:" + canCaptureThreat);

      if (canCaptureThreat) return false;

      const isPossibleBlock = isAnyPieceCanBlock(
        whiteKingPosition.row,
        whiteKingPosition.column
      );
      console.log("can block:" + isPossibleBlock);

      if (isPossibleBlock) return false;

      return true;
    }

    return false;
  };

  const isAnyPieceCanBlock = (kingRow: number, kingColumn: number) => {
    var threatCoords: { row: number; column: number } = findThreat(
      kingRow,
      kingColumn
    );
    if (board[threatCoords.row][threatCoords.column].value === "knight")
      return false;

    if (
      Math.abs(threatCoords.row - kingRow) <= 1 &&
      Math.abs(threatCoords.column - kingColumn) <= 1
    )
      return false;

    if (threatCoords.row === kingRow) {
      for (var row = 0; row < 8; row++) {
        for (var column = 0; column < 8; column++) {
          if (board[row][column].color !== board[kingRow][kingColumn].color) {
            for (
              var columnBetween = Math.max(threatCoords.column, column) - 1;
              columnBetween > Math.min(threatCoords.column, column);
              columnBetween--
            ) {
              const isBlockPossible = !willMoveCauseSelfCheck(
                kingRow,
                columnBetween,
                row,
                column
              );

              if (isBlockPossible) return true;
            }
          }
        }
      }
    }

    if (threatCoords.column === kingColumn) {
      for (var row = 0; row < 8; row++) {
        for (var column = 0; column < 8; column++) {
          if (board[row][column].color !== board[kingRow][kingColumn].color) {
            for (
              var rowBetween = Math.max(threatCoords.row, row) - 1;
              rowBetween > Math.min(threatCoords.row, row);
              rowBetween--
            ) {
              const isBlockPossible = !willMoveCauseSelfCheck(
                rowBetween,
                kingColumn,
                row,
                column
              );

              console.log("is block possible   ", isBlockPossible);

              if (isBlockPossible) return true;
            }
          }
        }
      }
    }

    return false;
  };

  const canCapturePieceThatThreatsKing = (
    kingRow: number,
    kingColumn: number
  ) => {
    var threatCoords: { row: number; column: number } = findThreat(
      kingRow,
      kingColumn
    );
    const color = board[kingRow][kingColumn].color;

    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 8; column++) {
        var willCauseSelfCheck = true;
        if (board[row][column].color === color) {
          willCauseSelfCheck = willMoveCauseSelfCheck(
            threatCoords.row,
            threatCoords.column,
            row,
            column
          );
        }

        if (!willCauseSelfCheck) {
          return true;
        }
      }
    }

    return false;
  };

  const findThreat = (kingRow: number, kingColumn: number) => {
    const color =
      board[kingRow][kingColumn].color === "white" ? "black" : "white";

    type kingCoords = {
      row: number;
      column: number;
    };

    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 8; column++) {
        if (board[row][column].color === color) {
          const isValidMove = PiecesMovingLogic(
            board,
            kingRow,
            kingColumn,
            row,
            column
          );
          if (isValidMove) return { row, column };
        }
      }
    }

    return (undefined as any) as kingCoords;
  };

  const canKingMove = (kingRow: number, kingColumn: number) => {
    const color = board[kingRow][kingColumn].color;
    var currentRow, currentColumn;

    if (color === "white") {
      currentRow = whiteKingPosition.row;
      currentColumn = whiteKingPosition.column;
    } else {
      currentRow = blackKingPosition.row;
      currentColumn = blackKingPosition.column;
    }

    for (let row = -1; row <= 1; row++) {
      for (let column = -1; column <= 1; column++) {
        if (row === 0 && column === 0) continue;

        if (board[kingRow + row] && board[kingRow + row][kingColumn + column]) {
          const isPath =
            board[kingRow + row][kingColumn + column].color !== color;
          const isValidMove = !willMoveCauseSelfCheck(
            kingRow + row,
            kingColumn + column,
            currentRow,
            currentColumn
          );

          if (isPath && isValidMove) {
            console.log(board);
            console.log(kingRow + row, kingColumn + column);
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

      console.log("turn: ", props.currentTurn);
      var isMate = isCheckMate();
      console.log("is check mate:  ", isMate);
      if (isMate) alert("VICTORY");
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

    if (isCellMarked) {
      resetCell(newBoard, row, column);
    }

    markCell(!isCellMarked);
    markCellCoords({ row, column });
    updateBoard(newBoard);
  };

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
