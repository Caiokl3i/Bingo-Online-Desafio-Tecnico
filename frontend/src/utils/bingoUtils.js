export const checkWin = (cardMatrix, markedNumbers) => {
  if (!cardMatrix || !markedNumbers) return { win: false };
  const size = 5;

  // 1. Verificar Linhas Horizontais
  for (let row = 0; row < size; row++) {
    if (cardMatrix[row].every(num => markedNumbers.includes(num))) {
      return { win: true, type: "Linha Horizontal" };
    }
  }

  // 2. Verificar Linhas Verticais (Colunas)
  for (let col = 0; col < size; col++) {
    let colComplete = true;
    for (let row = 0; row < size; row++) {
      if (!markedNumbers.includes(cardMatrix[row][col])) {
        colComplete = false;
        break;
      }
    }
    if (colComplete) return { win: true, type: "Linha Vertical" };
  }

  // 3. Diagonal Principal (Top-Left para Bottom-Right)
  const diag1Complete = cardMatrix.every((row, i) => markedNumbers.includes(row[i]));
  if (diag1Complete) return { win: true, type: "Diagonal Principal" };

  // 4. Diagonal Secundária (Top-Right para Bottom-Left)
  const diag2Complete = cardMatrix.every((row, i) => markedNumbers.includes(row[size - 1 - i]));
  if (diag2Complete) return { win: true, type: "Diagonal Secundária" };

  return { win: false };
};