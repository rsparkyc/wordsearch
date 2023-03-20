import React, { useState, useEffect } from "react";
import { generateGrid } from "../utils/helpers";
import "../styles.css";
import seedrandom from "seedrandom";

const WordSearch = () => {
  const gridSize = 8;
  const [grid, setGrid] = useState([]);
  const [selection, setSelection] = useState({ first: null, last: null });
  const [queuedWord, setQueuedWord] = useState("");
  const [submittedWords, setSubmittedWords] = useState([]);
  const [hoveredSelection, setHoveredSelection] = useState({ first: null, last: null });

  const getCells = (first, last) => {
    const cells = [];
    if (first && last) {
      const dx = last.j - first.j;
      const dy = last.i - first.i;
      const steps = Math.max(Math.abs(dx), Math.abs(dy));
      const stepX = dx / steps;
      const stepY = dy / steps;
  
      for (let step = 0; step <= steps; step++) {
        const x = first.j + step * stepX;
        const y = first.i + step * stepY;
        cells.push({ i: y, j: x });
      }
    }
    return cells;
  };  

  const handleCellClick = (i, j) => {
    if (!selection.first) {
      setSelection({ first: { i, j }, last: null });
      setQueuedWord("");
      setHoveredSelection({ first: null, last: null });
    } else if (selection.first.i === i && selection.first.j === j) {
      setSelection({ first: null, last: null });
      setQueuedWord("");
      setHoveredSelection({ first: null, last: null });
    } else if (isSelectable(i, j)) {
      setSelection({ ...selection, last: { i, j } });
      setQueuedWord(getSelectedWord(i, j));
    }
  };

  const handleCellMouseEnter = (i, j) => {
    if (selection.first && !selection.last && isSelectable(i, j)) {
      setHoveredSelection({ first: selection.first, last: { i, j } });
    }
  };  

  const handleSubmit = () => {
    if (queuedWord) {
      const cells = getCells(selection.first, selection.last);
      setSubmittedWords([
        ...submittedWords,
        { word: queuedWord, cells: cells },
      ]);
      setQueuedWord("");
      setSelection({ first: null, last: null });
    }
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

  const checkSelection = (i, j, sel) => {
    const { first, last } = sel;
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

  const getCellClass = (i, j) => {
    if (isSubmitted(i, j)) {
      return "submitted";
    }
    if (checkSelection(i, j, hoveredSelection)) {
      return "hovered";
    }
    if (checkSelection(i, j, selection)) {
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

  const isSubmitted = (i, j) => {
    for (const submittedWord of submittedWords) {
      for (const cell of submittedWord.cells) {
        if (cell.i === i && cell.j === j) {
          return true;
        }
      }
    }
    return false;
  };
  
  
  useEffect(() => {
    async function generate() {
      const newGrid = await generateGrid(gridSize, seedrandom);
      setGrid(newGrid);
    }
    generate();
  }, []);

  return (
    <div className="wordsearch-container">
      <div className="wordsearch">
        {grid.map((row, i) => (
          <div key={`row-${i}`} className="row">
            {row.map((cell, j) => (
              <div
                key={`cell-${i}-${j}`}
                className={`cell ${getCellClass(i, j)}`}
                onClick={() => handleCellClick(i, j)}
                onMouseEnter={() => handleCellMouseEnter(i, j)}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="queued-word-container">
      {queuedWord ? (
        <>
          <span>Queued Word: {queuedWord}</span>
          <button style={{ marginLeft: "20px" }} onClick={handleSubmit}>Submit</button>
        </>
        ) : (
          <span>Select a word to queue for submission</span>
        )}
      </div>
      <div className="submitted-words-container">
        <h3>Submitted Words:</h3>
        <ul>
          {submittedWords.map((submittedWordInfo, index) => (
            <li key={`submitted-word-${index}`}>{submittedWordInfo.word}</li>
          ))}
        </ul>
     </div>

    </div>
  );
};

export default WordSearch;
