import React from 'react';
import * as styles from './SubmittedWords.module.css';

const SubmittedWords = ({ submittedWords, calculateWordScore }) => {
  return (
    <div className={styles.submittedWordsContainer}>
      <h3>Submitted Words:</h3>
      {submittedWords.map((submittedWordInfo, index) => (
        <div key={`submitted-word-${index}`} className={styles.submittedWordWrapper}>
          {submittedWordInfo.word.split('').map((letter, index) => (
            <span key={`submitted-word-${index}-${letter}`} className={styles.queueBox}>
              {letter}
            </span>
          ))}
          <span className={styles.pointsText}>+{calculateWordScore(submittedWordInfo.word)}</span>
        </div>
      ))}
    </div>
  );
};

export default SubmittedWords;
