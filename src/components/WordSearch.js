import React, { useState, useEffect } from "react";
import { generateGrid } from "../utils/helpers";
import "../styles.css";
import seedrandom from "seedrandom";

const WordSearch = () => {
  const gridSize = 8;
  const [grid, setGrid] = useState([]);
  const [selection, setSelection] = useState({ first: null, last: null });
  const [queuedWord, setQueuedWord] = useState("");

  const handleCellClick = (i, j) => {
    if (!selection.first) {
      setSelection({ first: { i, j }, last: null });
      setQueuedWord("");
    } else if (selection.first.i === i && selection.first.j === j) {
      setSelection({ first: null, last: null });
      setQueuedWord("");
    } else if (isSelectable(i, j)) {
      setSelection({ ...selection, last: { i, j } });
      setQueuedWord(getSelectedWord(i, j));
    }
  };


  const isSelected = (i, j) => {
    const { first, last } = selection;
    if (!first || !last) {
      return false;
    }
    const dx = last.j - first.j;
    const dy = last.i - first.i;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    const stepX = dx / steps;
    const stepY = dy / steps;

    for (let step = 0; step <= steps; step++) {
      const x = first.j + step * stepX;
      const y = first.i + step * stepY;
      if (x === j && y === i) {
        return true;
      }
    }
    return false;
  };

  const isSelectable = (i, j) => {
    if (!selection.first) {
      return true;
    }

    const dx = j - selection.first.j;
    const dy = i - selection.first.i;

    // Check if the cell is in a horizontal, vertical, or diagonal direction
    return (
      dx === 0 ||
      dy === 0 ||
      Math.abs(dx) === Math.abs(dy)
    );
  };

  const getCellClass = (i, j) => {
    if (isSelected(i, j)) {
      return "selected";
    }
    if (selection.first && i === selection.first.i && j === selection.first.j) {
      return "first-selected";
    }
    if (selection.first && !isSelectable(i, j)) {
      return "unselectable";
    }
    return "";
  };  

  const getSelectedWord = (i, j) => {
    const { first } = selection;
    const dx = j - first.j;
    const dy = i - first.i;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    const stepX = dx / steps;
    const stepY = dy / steps;
  
    let word = "";
    for (let step = 0; step <= steps; step++) {
      const x = first.j + step * stepX;
      const y = first.i + step * stepY;
      word += grid[y][x];
    }
    return word;
  };
  
  useEffect(() => {
    async function generate() {
      const newGrid = await generateGrid(gridSize, seedrandom);
      setGrid(newGrid);
    }
    generate();
  }, []);

  return (
    <div>
      <div className="wordsearch">
        {grid.map((row, i) => (
          <div key={`row-${i}`} className="row">
            {row.map((cell, j) => (
              <div
                key={`cell-${i}-${j}`}
                className={`cell ${getCellClass(i, j)}`}
                onClick={() => handleCellClick(i, j)}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      {queuedWord && <div>Queued Word: {queuedWord}</div>}
    </div>
  );
};

export default WordSearch;
