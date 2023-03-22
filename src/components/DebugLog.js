import React, { useState, useEffect, useRef } from "react";
import styles from './DebugLog.module.css';

const DebugLog = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
    <h2>Debug</h2>
    <div className={styles?.debugLog}>
      {messages.map((message, index) => (
        <div key={index} className={styles?.message}>
          {message}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
    </>
  );
};

export default DebugLog;
