import React, { useState, useEffect, useRef } from "react";
import WordSearch from "../components/WordSearch"
import DebugLog from '../components/DebugLog';

const IndexPage = () => {
  const [messages, setMessages] = useState(["hello"]);

  return (
    <>
      <div>
        <WordSearch />
      </div><div>
        <DebugLog messages={messages} />
      </div>
    </>
  )
}

export default IndexPage

