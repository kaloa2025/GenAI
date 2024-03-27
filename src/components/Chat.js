import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import {IoSend} from 'react-icons/io5'
import {FaRobot} from 'react-icons/fa'
import './Chat.css'
const sendMessageAPI=async(message)=>{
    const res=await axios.post("http://localhost:9000/ask",{message});
    return res.data;
}
const Chat = () => {
  const [message,setMessage]=useState("");
  const [isTyping,setIsTyping]=useState(false);
  const [conversations,setConversations]=useState([{role:'assistant',content:'Hello! How can I assist today'},]);
  const mutataion=useMutation({
    mutationFn:sendMessageAPI,
    mutationKey:['chatbot'],
    onSuccess:(data)=>{
      setIsTyping(false);
      setConversations((prevConversations)=>[
        ...prevConversations,
        {role:"assistant",content:data.message},
      ]);
    },
  });
  
  const handleSubmitMessage=()=>{
    const currentMessage=message.trim();
    if(!currentMessage){
      alert("Please enter a message");
      return;
    }
    setConversations((prevConversations)=>[
      ...prevConversations,
      {role:"user",content:currentMessage},
    ]);

    setIsTyping(true);
    mutataion.mutate(currentMessage);
    setMessage("");
  };

  return (
    <>
    <div className='header'>
      <h1 className='title'>AI CHATBOT</h1>
      <p className='description'>
        Enter your message in the input below to chat with the AI
      </p>
      <div className='chat-container'>
        <div className='conversation'>
          {conversations.map((entry,index)=>(
            <div className={`message ${entry.role}`} key={index}>
              <strong>
                {entry.role==="user"?"You":<FaRobot/>}
              </strong>
              {entry.content}
              </div>
          ))}
          {isTyping&&(<div className='message assistant'>
            <FaRobot/>
            <strong>AI is Typing ...</strong>
          </div>)}
        </div>
        <div className='imput-area'>
          <input type='text'
          placeholder='Enter message'
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          onKeyPress={(e)=>e.key==="Enter"&& handleSubmitMessage}
          />
        </div>
        <button onClick={handleSubmitMessage}>
          {mutataion?.isPending?'Loading':<IoSend/>}
          </button>
      </div>
    </div>
    </>
  )
}

export default Chat