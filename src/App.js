import logo from './logo.svg';
import './App.css';
import Images from './components/Images.js'
import { useState } from 'react'
import Chat from './components/Chat.js';

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
    <Chat/>
    <Images/>
    </>
  );
}

export default App;
