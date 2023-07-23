import SismoButt from "./Sismo.tsx"
import { MetaMaskSDK } from '@metamask/sdk'
import React, { useContext } from 'react';
import { UserContext } from './App';
import './App.css'

function RightSide () { 
  let { address, setAddress } = useContext(UserContext);
  const { setSismoResponse } = useContext(UserContext);

    async function signMeta () {
        // const ethereum = MMSDK.getProvider(); // You can also access via window.ethereum
        const MMSDK = new MetaMaskSDK();
        address = window.ethereum.request({ method: 'eth_requestAccounts', params: [] });
        setAddress(address);
        console.log(address);
    }

    return (
      <div className="rightblock">
        <div className="buttonsright">
            <SismoButt  setSismoResponse={setSismoResponse} />
            <button onClick={signMeta}>Connect Wallet</button>
        </div>
      </div>
    );
}
  
export default RightSide