import React, { useState, useEffect, useRef } from "react";
import WordSearch from "../components/WordSearch"
import DebugLog from '../components/DebugLog';
import * as styles from './Container.module.css';


const IndexPage = () => {
  const [messages, setMessages] = useState(["hello"]);
  const gridSize = 8;

  return (
    <div className={styles.container}>
      <div>
        <WordSearch gridSize={gridSize}/>
      </div><div>
        <DebugLog messages={messages} cellWidth={40} numberOfCells={gridSize} />
      </div>
    </div>
  )
}

export default IndexPage

