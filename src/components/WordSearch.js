import React, { useState, useEffect } from "react";
import { generateGrid, initialize, validateWord } from "../utils/helpers";
import QueuedWord from './QueuedWord';
import "../styles.css";
import seedrandom from "seedrandom";
import { useDebugLog } from '../context/DebugLogContext';
import Score from './Score';
import SubmittedWords from './SubmittedWords';


const WordSearch = ({gridSize}) => {
  const [grid, setGrid] = useState([]);
  const [selection, setSelection] = useState({ first: null, last: null });
  const [queuedWord, setQueuedWord] = useState("");
  const [submittedWords, setSubmittedWords] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const { addMessage } = useDebugLog();
  const [isInvalidWord, setIsInvalidWord] = useState(false);
  const [score, setScore] = useState(0);

  const maxWords = 5;
  const [finalScore, setFinalScore] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');



  const handleInvalidWord = () => {
    addMessage("setting word as invalid")
    setIsInvalidWord(true);
  
    setTimeout(() => {
      handleClear();
      setIsInvalidWord(false);
    }, 2000);
  };
  
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
 
  const handleSubmit = async () => {
    if (submittedWords.length < maxWords && queuedWord) {
      const isValid = await validateWord(queuedWord, submittedWords);
      if (isValid) {
      const cells = getCells(selection.first, selection.last);
        setSubmittedWords([
          ...submittedWords,
          { word: queuedWord, cells: cells },
        ]);
        setQueuedWord("");
        setSelection({ first: null, last: null });
        const wordScore = calculateWordScore(queuedWord);
        setScore(score + wordScore);
      } else {
        handleInvalidWord();
      }
    }
  };

  useEffect(() => {
    if (submittedWords.length === maxWords) {
      const totalScore = submittedWords.reduce((acc, cur) => {
        return acc + calculateWordScore(cur.word);
      }, 0);
      setFinalScore(totalScore);
    }
  }, [submittedWords, calculateWordScore]);
  
  function calculateWordScore(word) {
    let wordScore = 0;
    for (let i = 1; i <= word.length; i++) {
      wordScore += i;
    }
    return wordScore;
  }
  
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
      const newGrid = await generateGrid(gridSize);
      setGrid(newGrid);
    }
    generate();
  }, []);

  const handleCopy = async () => {
    try {
      const message = `I scored ${submittedWords
        .map((word) => `+${calculateWordScore(word.word)}`)
        .join(' ')} points in the Word Search game! Can you beat my score? Try it out and see how well you do! https://word.ryancaskey.com`;
      await navigator.clipboard.writeText(message);
      setCopyStatus('Score Copied!');
    } catch (err) {
      setCopyStatus('Failed to copy');
    }
  };
  
  
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
        isInvalidWord={isInvalidWord}
      />

      <SubmittedWords
        submittedWords={submittedWords}
        calculateWordScore={calculateWordScore}
      />

      <Score score={score} />

      {finalScore !== null && (
        <div className="final-score">
          {!copyStatus && <button onClick={handleCopy}>Share Your Score</button>}
          {copyStatus && <span>{copyStatus}</span>}
        </div>
      )}

    </div>
  );
};

export default WordSearch;