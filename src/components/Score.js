import React from 'react';
import * as styles from './Score.module.css';

const Score = ({ score }) => {
  return (
    <div className={styles.scoreContainer}>
      <span className={styles.scoreLabel}>Score:</span>
      <span className={styles.scoreValue}>{score}</span>
    </div>
  );
};

export default Score;
