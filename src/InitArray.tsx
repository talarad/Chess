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

export default initArray;
