import React, { createContext, useContext, useState } from 'react';

console.log("creating context");
const DebugLogContext = createContext();
console.log("is context undefined? " + DebugLogContext === undefined);

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
  console.log("using context");
  const context = useContext(DebugLogContext);
  if (context === undefined) {
    throw new Error('useDebugLog must be used within a DebugLogProvider');
  }
  console.log("returning context");
  return context;
};

export default DebugLogContext;

