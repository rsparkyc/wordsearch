import React from "react";
import WordSearch from "../components/WordSearch"
import DebugLog from '../components/DebugLog';
import * as styles from './Container.module.css';
import { DebugLogProvider, useDebugLog } from "../context/DebugLogContext";
import { useLocation } from '@reach/router';

const IndexPage = () => {

  const gridSize = 8;
  const location = useLocation();

  const isDebugMode = () => {
    const params = new URLSearchParams(location.search);
    return params.get('debug') === 'true';
  };

  return (
    <DebugLogProvider>
      <div className={styles.container}>
        <div>
          <WordSearch gridSize={gridSize}/>
        </div>
        {isDebugMode() && (
          <div>
            <DebugLog cellWidth={40} numberOfCells={gridSize} />
          </div>
        )}
      </div>
    </DebugLogProvider>
  )
}

export default IndexPage
