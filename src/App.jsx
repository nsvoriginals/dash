import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Landing from './components/Home/Landing'
import Dashboard from './Dashboard'
import { BrowserRouter,Router,Route } from 'react-router-dom'
function App() {
 
  return (
    <div className='m-0 p-0 w-screen h-screen font-Tensor bg-white overflow-auto'>
<Dashboard></Dashboard>
    </div>
  )
}

export default App
