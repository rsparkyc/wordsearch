import React, { useEffect, useState } from 'react';

const QueuedWord = ({ gridSize, selectedWord, clearWord, submitWord, isInvalidWord }) => {
  const wordCells = Array(gridSize).fill(null);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (isInvalidWord) {
      setInvalid(true);
      setTimeout(() => {
        clearWord();
        setInvalid(false);
      }, 2000);
    }
  }, [isInvalidWord, clearWord]);

  return (
    <div className="queued-word">
      <button className="clear-selection" onClick={clearWord}></button>

      <div className="current-queued-word">
        {wordCells.map((_, index) => (
          <div
            key={index}
            className={`queue-box${invalid ? ' invalid-word' : ''}`}
          >
            {selectedWord[index] || ''}
          </div>
        ))}
      </div>
      <button className="submit-selection" onClick={submitWord}></button>
    </div>
  );
};

export default QueuedWord;
