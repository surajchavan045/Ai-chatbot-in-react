import React, { useEffect, useRef, useState } from 'react'
import ChatbotIcon from './components/ChatbotIcon'
import ChatForm from './components/ChatForm'
import ChatMessage from './components/ChatMessage';

const App = () => {

 const [chatHistory, setChatHistory] = useState([]);
 const chatBodyRef = useRef();

 const generateBotResponse = async (history) => {
  // helper function to update chat history
   const updateHistory = (text) => {
    setChatHistory((prev) => [...prev.filter((msg) => msg.text !== "Thinking..."), {role: "model", text}]);
   }

  // format chat history for API request
  history = history.map(({role,text}) => ({role,parts: [{text}]}));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({contents: history })
    }

    try {
      // make the API call to get the bot's response
      const response = await fetch(import.meta.env.VITE_API_URL,requestOptions);
      const data = await response.json();
      if(!response.ok) throw new Error(data.error.message || "Something went wrong");

      // Clean and update chat history with bot's response
      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(apiResponseText);
    } catch (error) {
      console.log(error);
    }
 };

 useEffect(() => {
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
 },[chatHistory]);

  return (
    <div className='container'>
      <div className="chatbot-popup">
        {/* chatbot header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-texxt">Chatbot</h2>
          </div>
          <button className="material-symbols-rounded">keyboard_arrow_down</button>
        </div>
           
           {/* chatbot body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey there <br /> How can I help you today?
            </p>
          </div>

           {/* Render the chat history dynamically  */}
           {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
           ))}

           
        </div>
            
            {/* chat footer */}
        <div className="chat-footer">
           <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  )
}

export default App
