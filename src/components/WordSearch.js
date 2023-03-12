import React, { useState, useEffect } from 'react';
import { generateGrid } from '../utils/helpers';
import "../styles.css";
import seedrandom from 'seedrandom';

const WordSearch = () => {

  const gridSize = 8;
  const [grid, setGrid] = useState([]);

  const handleClick = async () => {
    const newGrid = await generateGrid(gridSize, seedrandom);
    setGrid(newGrid);
  }

  // Call generateGrid once on mount to set the initial state
  useEffect(() => {
    async function generate() {
      const newGrid = await generateGrid(gridSize, seedrandom);
      setGrid(newGrid);
    }
    generate();
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