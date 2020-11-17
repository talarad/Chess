const table: {
  value: string;
  isCellMarked: boolean;
  color: string;
  isFirstMove: boolean;
}[][] = [];

for (let i = 0; i < 8; i++) {
  table.push([]);
  for (let j = 0; j < 8; j++) {
    const cell = {
      value: "",
      isCellMarked: false,
      color: "",
      isFirstMove: true,
    };
    if (i === 1 || i === 6) {
      cell.value = "pawn";
    }

    if (i <= 1) {
      cell.color = "white";
    }
    if (i >= 6) {
      cell.color = "black";
    }

    table[i].push(cell);
  }
}

table[0][7].value = "rook";
table[0][7].color = "white";

table[0][7].value = "rook";
table[0][0].value = "rook";
table[7][0].value = "rook";
table[7][7].value = "rook";

table[0][1].value = "knight";
table[0][6].value = "knight";
table[7][1].value = "knight";
table[7][6].value = "knight";

table[0][2].value = "bishop";
table[0][5].value = "bishop";
table[7][2].value = "bishop";
table[7][5].value = "bishop";

table[0][3].value = "queen";
table[0][4].value = "king";

table[7][3].value = "queen";
table[7][4].value = "king";

export default table;
