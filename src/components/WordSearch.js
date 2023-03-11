import React, { useState } from 'react';
import { generateGrid } from '../utils/helpers';
import "../styles.css";


const WordSearch = () => {
  const gridSize = 6;
  const [grid, setGrid] = useState([]);

  const handleClick = () => {
    setGrid(generateGrid(gridSize));
  }

  // Call generateGrid once on mount to set the initial state
  useState(() => {
    setGrid(generateGrid(gridSize));
  }, []);

  return (
    <div>
      <button onClick={handleClick}>Generate New Grid</button>
      <div className="wordsearch">
        {grid.map((row, i) => (
          <div key={`row-${i}`} className="row">
            {row.map((cell, j) => (
              <div key={`cell-${i}-${j}`} className="cell">
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

};

export default WordSearch;

