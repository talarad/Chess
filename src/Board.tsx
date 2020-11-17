import React from "react";
import "./App.css";
import firstTable from "./TableInitialization";
import king from "./black/king.png";

type BoardProps = {
  rows: number;
  columns: number;
};
export const Board: React.FC = (props) => {
  const [board, updateBoard] = React.useState<
    {
      value: string;
      isCellMarked: boolean;
      color: string;
      isFirstMove: boolean;
    }[][]
  >(firstTable);

  const CellClick = (row: number, column: number) => {
    const newBoard: {
      value: string;
      isCellMarked: boolean;
      color: string;
      isFirstMove: boolean;
    }[][] = [...board];
    newBoard[row][column].isCellMarked = !board[row][column].isCellMarked;

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
              const borderColor = cell.isCellMarked ? "red" : "white";
              if (cell.value !== "") {
                console.log("hi");
                return (
                  <td
                    key={columnIndex}
                    className="content"
                    style={{ backgroundColor: borderColor }}
                  >
                    <img
                      // src={require(`../public/pieces/${cell.color}/${cell.value}.png`)}
                      // src={require("C:/Users/talar/Desktop/chess/src/black/king.png")}
                      src={require("./king.png")}
                      // src={require(king)}
                      onClick={() => CellClick(rowIndex, columnIndex)}
                      alt="piece"
                    />
                  </td>
                );
              } else {
                return (
                  <td
                    key={columnIndex}
                    className="content"
                    style={{ backgroundColor: borderColor }}
                    onClick={() => CellClick(rowIndex, columnIndex)}
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
