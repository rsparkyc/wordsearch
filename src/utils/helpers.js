  const badWordsUrl = "https://raw.githubusercontent.com/jamesfdickinson/badwords/master/lib/lang.json";

  let wordCache = null;

  async function getBadWords() {
    if (wordCache) {
      return wordCache;
    } else {
      const response = await fetch(badWordsUrl);
      const json = await response.json();
      const words = json.words;
      wordCache = words;
      return words;
    }
  };

async function generateGrid(gridSize) {

  console.log("generating grid");
  const grid = [];
  for (let i = 0; i < gridSize; i++) {
    grid.push([]);
    for (let j = 0; j < gridSize; j++) {
      grid[i].push("");
    }
  }

  for (var i = 0; i < 5; i++) {
    const word = getWordsForGame().validWords[i];
    tryToInsertWord(grid, word);
  } 
  fillGridWithRandomLetters(grid);

  if (await containsBadWord(grid)) {
    return generateGrid(gridSize);
  }

  return grid;
}

async function containsBadWord(grid) {
  const allStrings = generateAllStrings(grid);
  const badWords = await getBadWords();
  
  for (const string of allStrings) {
    const lowerString = string.toLowerCase();
    for (const badWord of badWords) {
      const lowerBadWord = badWord.toLowerCase();
      if (lowerString.includes(lowerBadWord)) {
        console.log(`Bad word "${badWord}" found in string "${string}"`);
        return true;
      }
    }
  }
  
  return false;
}


function fillGridWithRandomLetters(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = randomLetter(); 
      }
    }
  }
}

function generateInsertionPoints(grid, word, direction) {
  const [dx, dy] = direction;
  const insertionPoints = [];

  // Find the minimum and maximum x and y values where we can insert the word
  let minX = dx > 0 ? 0 : Math.abs(dx) * (word.length - 1);
  let maxX = dx < 0 ? grid.length - 1 : grid.length - 1 - Math.abs(dx) * (word.length - 1);
  let minY = dy > 0 ? 0 : Math.abs(dy) * (word.length - 1);
  let maxY = dy < 0 ? grid[0].length - 1 : grid[0].length - 1 - Math.abs(dy) * (word.length - 1);

  // Generate an array of possible insertion points in random order
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      insertionPoints.push([x, y]);
    }
  }
  return shuffleArray(insertionPoints);
}

// Function to shuffle an array in place
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function tryToInsertWord(grid, word) {
  const randomDirections = getRandomDirections();
  
  for (const direction of randomDirections) {
    const insertionPoints = generateInsertionPoints(grid, word, direction);
    for (let i = 0; i < insertionPoints.length; i++) {
      const [x, y] = insertionPoints[i];

      if (canInsertWord(grid, word, x, y, direction)) {
        insertWord(grid, word, x, y, direction);
        return true;
      }
    }
  }

  return false;
}

function canInsertWord(grid, word, x, y, direction) {
  const [dx, dy] = direction;
  for (let i = 0; i < word.length; i++) {
    const row = x + i * dx;
    const col = y + i * dy;
    if (grid[row][col] !== '' && grid[row][col] !== word[i]) {
      return false;
    }
  }
  return true;
}

function insertWord(grid, word, x, y, direction) {
  const [dx, dy] = direction;
  for (let i = 0; i < word.length; i++) {
    const row = x + i * dx;
    const col = y + i * dy;
    grid[row][col] = word[i];
  }
}

function getWordsForGame() {
  const validWords = ["these", "are", "the", "awesome", "words"];
  const blockedWords = ["ANGULAR", "VUE", "TYPESCRIPT", "REDUX", "MOBX"];
  return { validWords, blockedWords };
}

function getRandomDirections() {
  const directions = [  
    [-1, -1], [-1, 0], [-1, 1],
    [0,  -1],          [0,  1],
    [1,  -1], [1,  0], [1,  1]
  ];

  return shuffleArray(directions);
}

function randomLetter() {
  const letterFrequencies = [
    { letter: 'e', frequency: 12.02 },
    { letter: 't', frequency: 9.10 },
    { letter: 'a', frequency: 8.12 },
    { letter: 'o', frequency: 7.68 },
    { letter: 'i', frequency: 7.31 },
    { letter: 'n', frequency: 6.95 },
    { letter: 's', frequency: 6.28 },
    { letter: 'r', frequency: 6.02 },
    { letter: 'h', frequency: 5.92 },
    { letter: 'd', frequency: 4.32 },
    { letter: 'l', frequency: 3.98 },
    { letter: 'u', frequency: 2.88 },
    { letter: 'c', frequency: 2.71 },
    { letter: 'm', frequency: 2.61 },
    { letter: 'f', frequency: 2.30 },
    { letter: 'y', frequency: 2.11 },
    { letter: 'w', frequency: 2.09 },
    { letter: 'g', frequency: 2.03 },
    { letter: 'p', frequency: 1.82 },
    { letter: 'b', frequency: 1.49 },
    { letter: 'v', frequency: 1.11 },
    { letter: 'k', frequency: 0.69 },
    { letter: 'x', frequency: 0.17 },
    { letter: 'q', frequency: 0.11 },
    { letter: 'j', frequency: 0.10 },
    { letter: 'z', frequency: 0.07 }
  ];

  // Get a random number between 0 and 1
  const randomNumber = Math.random();

  // Iterate through the letter frequencies and find the letter that corresponds to the random number
  let cumulativeFrequency = 0;
  for (let i = 0; i < letterFrequencies.length; i++) {
    cumulativeFrequency += letterFrequencies[i].frequency / 100;
    if (randomNumber <= cumulativeFrequency) {
      return letterFrequencies[i].letter;
    }
  }
}

function generateAllStrings(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const allStrings = [];

  // Add rows to allStrings
  for (let i = 0; i < rows; i++) {
    const rowString = grid[i].join('');
    allStrings.push(rowString);
  }

  // Add columns to allStrings
  for (let i = 0; i < cols; i++) {
    let columnString = '';
    for (let j = 0; j < rows; j++) {
      columnString += grid[j][i];
    }
    allStrings.push(columnString);
  }

  // Add diagonals to allStrings
  let merged = allStrings.concat(diagonals(grid));
  return merged;
}

// This function takes in a square grid represented as a 2D array and returns an array
// of all the diagonal strings in the grid (both top-left to bottom-right and bottom-left
// to top-right diagonals).
function diagonals(grid) {
  const diagonals = []; // Initialize an empty array to store the diagonal strings.
  const size = grid.length; // Get the size of the grid.
  // Loop through each diagonal in the grid.
  // There are (size * 2) - 1 diagonals in total.
  for (let i = 0; i < size * 2 - 1; i++) {
    let diagonal_tl_br = ""; // Initialize an empty string for the top-left to bottom-right diagonal.
    let diagonal_bl_tr = ""; // Initialize an empty string for the bottom-left to top-right diagonal.
    // Loop through each cell in the current diagonal.
    for (let j = 0; j <= i; j++) {
      const r = j; // Calculate the row index of the current cell.
      const c = i - j; // Calculate the column index of the current cell.
      // If the current cell is within the grid, add its value to both diagonal strings.
      if (r < size && c < size) {
        diagonal_tl_br += grid[r][c];
        diagonal_bl_tr += grid[size - r - 1][c];
      }
    }
    // Add the two diagonal strings to the diagonals array.
    diagonals.push(diagonal_tl_br);
    diagonals.push(diagonal_bl_tr);
  }
  return diagonals; // Return the array of diagonal strings.
}

module.exports = {
  generateGrid,
  getWordsForGame,
};
