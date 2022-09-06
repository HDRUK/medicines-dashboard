import React from 'react'
import { Route, Routes } from 'react-router-dom'


import Home  from './components/Dashboard/'
import Dashboard  from './components/Dashboard/dashboard'

import './App.css'

const Main = () => (

  <>
     <Routes>
     
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='' element={<Home />} />
      
    </Routes>
   </>
)

export default Main

