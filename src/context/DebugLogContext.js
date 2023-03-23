import React, { createContext, useContext, useState } from 'react';

console.log("creating context");
const DebugLogContext = createContext();
console.log("is context undefined? " + DebugLogContext === undefined);

export const DebugLogProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const addMessage = (message) => {
    console.log("adding message to debug log: " + message);
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
