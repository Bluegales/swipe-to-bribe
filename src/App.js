import React from 'react';
import './App.css'
import Cards from './/Cards'
import LeftSide from './Left'
import RightSide from './Right'
import { useState, createContext, useContext } from "react";

const UserContext = createContext();

function App () {
  const [address, setAddress] = useState();
  const [sismoResponse, setSismoResponse] = useState(null);
  return (  
    <UserContext.Provider value={{sismoResponse, setSismoResponse, address, setAddress}}>
      <div className='row'>
        <LeftSide />
        <Cards />
        <RightSide />
      </div>
    </UserContext.Provider>
  )
}

export { UserContext }
export default App
