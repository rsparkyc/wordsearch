import React, { useState, useEffect } from "react";
import "../styles.css";

const WordSearch = () => {
  const [grid, setGrid] = useState([]);

  useEffect(() => {
    // Generate grid code
    const newGrid = [];
    for (let i = 0; i < 8; i++) {
      const row = [];
      for (let j = 0; j < 8; j++) {
        row.push(String.fromCharCode(Math.floor(Math.random() * 26) + 65));
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
  }, []);

  return (
    <div className="wordsearch">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((letter, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className="cell">
              {letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WordSearch;

