import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'

// Ajuste o caminho se a sua pasta src estiver na raiz
import Login from "../front-end/src/pages/Login" 
import Home from "../front-end/src/pages/Home"
import ChatGlobal from "../front-end/src/pages/ChatGlobal"
import DadosPessoais from "../front-end/src/pages/DadosPessoais"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/Home' element={<Home/>}/>
        <Route path='/ChatGlobal' element={<ChatGlobal/>}/>
        <Route path='/DadosPessoais' element={<DadosPessoais/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
