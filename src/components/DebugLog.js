import React, { useState, useEffect, useRef } from "react";
import * as styles from './DebugLog.module.css';
import { useDebugLog } from "../context/DebugLogContext";


const DebugLog = ({ cellWidth, numberOfCells }) => {
  const { messages } = useDebugLog();
  const terminalWidth = cellWidth * numberOfCells;

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
    <div className={styles.debugLog} style={{ width: terminalWidth }}>
      {messages.map((message, index) => (
        <div key={index} className={styles.message}>
          {message}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
    </>
  );
};

export default DebugLog;
