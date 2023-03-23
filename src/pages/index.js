import React, { useState, useEffect, useRef } from "react";
import WordSearch from "../components/WordSearch"
import DebugLog from '../components/DebugLog';
import * as styles from './Container.module.css';
import { DebugLogProvider, useDebugLog } from "../context/DebugLogContext";

const IndexPage = () => {

  const gridSize = 8;

  return (
    <DebugLogProvider>
      <div className={styles.container}>
        <div>
          <WordSearch gridSize={gridSize}/>
        </div><div>
          <DebugLog cellWidth={40} numberOfCells={gridSize} />
        </div>
      </div>
    </DebugLogProvider>
  )
}

export default IndexPage
