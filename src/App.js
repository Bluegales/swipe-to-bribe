import React, { useState } from 'react'
import './App.css'
import Switch from 'react-ios-switch'

import Advanced from './examples/Advanced'
import Simple from './examples/Simple'

import { MetaMaskSDK } from '@metamask/sdk'

import SismoButt from './sismo.tsx'

async function signMeta () {
  const MMSDK = new MetaMaskSDK();
  // const ethereum = MMSDK.getProvider(); // You can also access via window.ethereum
  const address = window.ethereum.request({ method: 'eth_requestAccounts', params: [] });
  console.log(address);
}

function App () {
  const [showAdvanced, setShowAdvanced] = useState(true)

  return (
    <div className='app'>
      <SismoButt />
      <button className="MetaMask" onClick={signMeta}>Connect Wallet</button>
      <h3 className="MetaMask">Wallet Address: </h3>
      {showAdvanced ? <Advanced /> : <Simple />}
      <div className='row'>
        <p style={{ color: '#fff' }}>Show advanced example</p> <Switch checked={showAdvanced} onChange={setShowAdvanced} />
      </div>
    </div>
  )
}

export default App
