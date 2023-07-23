import SismoButt from "./Sismo.tsx"
import { MetaMaskSDK } from '@metamask/sdk'
import { CONTRACT_ADDRESS, SISMO_CONST } from  './constants'
import ABI from './abi.json'
import React, { useState } from 'react';
import { ethers } from 'ethers';
import './App.css'

function RightSide () { 
    const [address, setAddress] = useState()
    const [sismoResponse, setSismoResponse] = useState(null);


    async function signMeta () {
        // const ethereum = MMSDK.getProvider(); // You can also access via window.ethereum
        const MMSDK = new MetaMaskSDK();
        const address = window.ethereum.request({ method: 'eth_requestAccounts', params: [] });
        setAddress(address);
        console.log(address);
    }

    async function createContract2() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        try {
          const tx = await contract.promiseArr(0);
          console.log((tx));
          const decodeString = Buffer.from(tx[2], 'hex').toString('utf8');
          console.log(decodeString);
        } catch (error) {
          console.log("Error while creating campaign: ", error);
        }
    } 

    async function createContract() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        try {
          const tx = await contract.createPromise(
            (new ethers.utils.AbiCoder()).encode(["string"], ["I promise to finish school"]),
            (new ethers.utils.AbiCoder()).encode(["string"], [SISMO_CONST]),
            sismoResponse,
          );
          await tx.wait();
          console.log("Campaign created: " + tx.hash);
        } catch (error) {
          console.log("Error while creating campaign: ", error);
        }
    } 

    return (
      <div className="rightblock">
        <div className="buttonsright">
            <SismoButt setSismoResponse={setSismoResponse} />
            <button onClick={signMeta}>Connect Wallet</button>
            <button onClick={createContract2}>Create Contract</button>
        </div>
      </div>
    );
}
  
export default RightSide