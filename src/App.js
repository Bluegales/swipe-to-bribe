import React from 'react';
import './App.css'
import Cards from './/Cards'
import LeftSide from './Left'
import RightSide from './Right'


function App () {
  return (
    <div className='row'>
      <LeftSide />
      <Cards />
      <RightSide />
    </div>
  )
}

export default App
