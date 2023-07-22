import SismoButt from "./Sismo.tsx"
import { MetaMaskSDK } from '@metamask/sdk'
import { CONTRACT_ADDRESS } from  './constants'
import ABI from './abi.json'
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

function RightSide () { 
    const [address, setAddress] = useState()
    const sismoResponse = null;

    async function signMeta () {
        // const ethereum = MMSDK.getProvider(); // You can also access via window.ethereum
        const MMSDK = new MetaMaskSDK();
        const address = window.ethereum.request({ method: 'eth_requestAccounts', params: [] });
        setAddress(address);
        console.log(address);
    }

    async function createContract() {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, address);
        try {
            const tx = await contract.createfund(
            (document.getElementById("name") as HTMLInputElement).value,
            (document.getElementById("address") as HTMLInputElement).value,
            (document.getElementById("description") as HTMLInputElement).value,
            coverUrl
        );
        await tx.wait();
        router.reload();
        console.log("Campaign created: " + tx.hash);
      } catch (error) {
        console.log("Error while creating campaign: ", error);
      }
    }
    

    return (
      <div className="blocks rightblock">
        <SismoButt onValueChange={sismoResponse} />
        <button className="MetaMask" onClick={signMeta}>Connect Wallet</button>
        <button className="MetaMask" onClick={console.log(CONTRACT_ADDRESS)} >Contract</button>
        <Contract />
        <h3 className="MetaMask">Wallet Address: </h3>
      </div>
    );
}
  
export default RightSide