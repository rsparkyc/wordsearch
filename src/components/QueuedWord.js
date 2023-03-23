import React from 'react';

const QueuedWord = ({ gridSize, selectedWord, clearWord, submitWord }) => {
  const wordCells = Array(gridSize).fill(null);

  return (
    <div className="queued-word">
      <button className="clear-selection" onClick={clearWord}></button>

      <div className="current-queued-word">
        {wordCells.map((_, index) => (
          <div key={index} className="queue-box">
            {selectedWord[index] || ''}
          </div>
        ))}
      </div>
      <button className="submit-selection" onClick={submitWord}></button>
    </div>
  );
};

export default QueuedWord;
