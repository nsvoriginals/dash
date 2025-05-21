import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from './Landingpage'
import Dashboard from './Dashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './components/AuthComponents/Signup'
import SignIn from './components/AuthComponents/Signin'

function App() {
  return (
    <BrowserRouter>
      <div className='m-0 p-0 w-screen min-h-screen font-Tensor bg-[#1A1A1A]'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />

          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
