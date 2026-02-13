const GRID_SIZE = 9;
const BOX_SIZE = 3;

function createEmptyGrid() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

function isSafe(grid, row, col, num) {
  // Check row and column
  for (let i = 0; i < GRID_SIZE; i++) {
    if (grid[row][i] === num || grid[i][col] === num) {
      return false;
    }
  }

  // Check 3x3 box
  const startRow = row - (row % BOX_SIZE);
  const startCol = col - (col % BOX_SIZE);
  for (let r = 0; r < BOX_SIZE; r++) {
    for (let c = 0; c < BOX_SIZE; c++) {
      if (grid[startRow + r][startCol + c] === num) {
        return false;
      }
    }
  }

  return true;
}

function findEmpty(grid) {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) {
        return [r, c];
      }
    }
  }
  return null;
}

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function solveSudoku(grid) {
  const emptyPos = findEmpty(grid);
  if (!emptyPos) {
    return true; // solved
  }

  const [row, col] = emptyPos;
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (const num of nums) {
    if (isSafe(grid, row, col, num)) {
      grid[row][col] = num;

      if (solveSudoku(grid)) {
        return true;
      }

      grid[row][col] = 0;
    }
  }

  return false;
}

function generateFullBoard() {
  const grid = createEmptyGrid();
  solveSudoku(grid);
  return grid;
}

function cloneGrid(grid) {
  return grid.map(row => row.slice());
}

function removeCells(grid, difficulty = 'medium') {
  const puzzle = cloneGrid(grid);

  let cellsToRemove;
  switch (difficulty) {
    case 'easy':
      cellsToRemove = 40;
      break;
    case 'hard':
      cellsToRemove = 60;
      break;
    case 'medium':
    default:
      cellsToRemove = 50;
  }

  let attempts = cellsToRemove;

  while (attempts > 0) {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);

    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      attempts--;
    }
  }

  return puzzle;
}

function generateSudoku(difficulty = 'medium') {
  const solution = generateFullBoard();
  const puzzle = removeCells(solution, difficulty);
  return { puzzle, solution };
}

module.exports = {
  generateSudoku,
};

