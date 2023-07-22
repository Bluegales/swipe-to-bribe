import React, { useState } from 'react'
import './App.css'
import Switch from 'react-ios-switch'

import Advanced from './examples/Advanced'
import Simple from './examples/Simple'

import { MetaMaskSDK } from '@metamask/sdk';

function signMeta () {
  const options = {
    injectProvider: true,
  };
  if (window.ethereum) {
    const MMSDK = new MetaMaskSDK(options);
    const ethereum = MMSDK.getProvider(); // You can also access via window.ethereum
    window.ethereum.request({ method: 'eth_requestAccounts', params: [] });
    
  } else {
    console.log("Error: trying to connect");
  }
}

function App () {
  const [showAdvanced, setShowAdvanced] = useState(true)

  return (
    <div className='app'>
      <button className="MetaMask" onClick={signMeta}
      >Connect Wallet</button>
      <h3 className="MetaMask">Wallet Address: </h3>
      {showAdvanced ? <Advanced /> : <Simple />}
      <div className='row'>
        <p style={{ color: '#fff' }}>Show advanced example</p> <Switch checked={showAdvanced} onChange={setShowAdvanced} />
      </div>
    </div>
  )
}

export default App
