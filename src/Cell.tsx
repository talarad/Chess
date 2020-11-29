import React, { FC } from "react";
import initArray from "./InitArray";
import PiecesMovingLogic from "./PiecesMovingLogic";

type CellProps = {
  cell: {
    value: string;
    isCellMarked: boolean;
    color: string;
    isFirstMove: boolean;
  };
  currentTurn: string;
  rowIndex: number;
  columnIndex: number;
  OnCellClick(row: number, column: number): void;
  onHoverEvent(row: number, column: number): void;
  updatePossibleMoves(array: boolean[][]): void;
  possibleMoves: boolean[][];
};

export const Cell: React.FC<CellProps> = (props) => {
  const borderColor = props.cell.isCellMarked
    ? "yellow"
    : props.possibleMoves[props.rowIndex][props.columnIndex]
    ? "red"
    : "white";

  if (props.cell.value !== "") {
    return (
      <td
        key={props.columnIndex}
        className="content"
        style={{ backgroundColor: borderColor }}
      >
        <img
          src={require(`./${props.cell.color}/${props.cell.value}.png`).default}
          onClick={() => props.OnCellClick(props.rowIndex, props.columnIndex)}
          onMouseEnter={() =>
            props.onHoverEvent(props.rowIndex, props.columnIndex)
          }
          onMouseLeave={() => props.updatePossibleMoves(initArray())}
          alt="piece"
        />
      </td>
    );
  } else {
    return (
      <td
        key={props.columnIndex}
        className="content"
        style={{ backgroundColor: borderColor }}
        onClick={() => props.OnCellClick(props.rowIndex, props.columnIndex)}
      ></td>
    );
  }
};

export default Cell;
