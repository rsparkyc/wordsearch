import React, { useState, useEffect } from "react";
import { generateGrid, initialize, validateWord } from "../utils/helpers";
import QueuedWord from './QueuedWord';
import "../styles.css";
import seedrandom from "seedrandom";
import { useDebugLog } from '../context/DebugLogContext';


const WordSearch = ({gridSize}) => {
  const [grid, setGrid] = useState([]);
  const [selection, setSelection] = useState({ first: null, last: null });
  const [queuedWord, setQueuedWord] = useState("");
  const [submittedWords, setSubmittedWords] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const { addMessage } = useDebugLog();

  initialize(seedrandom, addMessage);

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

  const handleClear = () => {
    setSelection({ first: null, last: null });
    setQueuedWord("");
    setSelectionMode(false);
  }

  const handleCellClick = (i, j) => {
    if (!selection.first) {
      setSelection({ first: { i, j }, last: null });
      setQueuedWord("");
      setSelectionMode(true);
    } else if (selection.first.i === i && selection.first.j === j) {
      setSelection({ first: null, last: null });
      setQueuedWord("");
      setSelectionMode(false);
    } else if (isSelectable(i, j)) {
      setSelection({ ...selection, last: { i, j } });
      setQueuedWord(getSelectedWord(i, j));
      setSelectionMode(false);
    }
  };

  const handleCellMouseEnter = (i, j) => {
    if (selectionMode && isSelectable(i, j)) {
      setSelection({ first: selection.first, last: { i, j } });
    }
  };

  const handleSubmit = () => {
    if (queuedWord) {
      if (validateWord(queuedWord)) {
        const cells = getCells(selection.first, selection.last);
        setSubmittedWords([
          ...submittedWords,
          { word: queuedWord, cells: cells },
        ]);
        setQueuedWord("");
        setSelection({ first: null, last: null });
      }
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
    let cellClass = "cell";
    if (selection.first && i === selection.first.i && j === selection.first.j) {
      cellClass += " first-selected";
      return cellClass;
    }
    if (checkSelection(i, j, selection)) {
      cellClass += " selected";
      return cellClass;
    }
    if (isSubmitted(i, j)) {
      cellClass += " submitted";
    }
    if (selection.first && !isSelectable(i, j)) {
      cellClass += " unselectable";
    }
    return cellClass;
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
      addMessage("generating grid");
      const newGrid = await generateGrid(gridSize);
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
                className={`${getCellClass(i, j)}`}
                onClick={() => handleCellClick(i, j)}
                onMouseEnter={() => handleCellMouseEnter(i, j)}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>

      <QueuedWord
        gridSize={gridSize}
        selectedWord={queuedWord}
        clearWord={handleClear}
        submitWord={handleSubmit}
      />


      <div className="submitted-words-container">
        <h3>Submitted Words:</h3>
        {submittedWords.map((submittedWordInfo, index) => (
          <div key={`submitted-word-${index}`}>
            {submittedWordInfo.word.split('').map((letter, index) => (
              <span key={`submitted-word-${index}-${letter}`}>{letter}</span>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
};

export default WordSearch;