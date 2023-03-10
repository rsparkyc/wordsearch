import React, { useState } from 'react';
import { generateGrid } from '../utils/helpers';
import "../styles.css";


const WordSearch = () => {
  const gridSize = 12;
  const [grid, setGrid] = useState(generateGrid(12));

  const handleClick = () => {
    setGrid(generateGrid(12));
  }

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

