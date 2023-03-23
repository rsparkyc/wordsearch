import React, { createContext, useContext, useState } from 'react';

const DebugLogContext = createContext();

export const DebugLogProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const addMessage = (message) => {
    // const now = new Date();
    // const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}`;
    // const formattedMessage = `${timestamp} | ${message}`;

    console.log(message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <DebugLogContext.Provider value={{ messages, addMessage }}>
      {children}
    </DebugLogContext.Provider>
  );
};

export const useDebugLog = () => {
  const context = useContext(DebugLogContext);
  if (context === undefined) {
    throw new Error('useDebugLog must be used within a DebugLogProvider');
  }
  return context;
};

export default DebugLogContext;

