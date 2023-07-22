import SismoButt from "./Sismo.tsx"
import { MetaMaskSDK } from '@metamask/sdk'

async function signMeta () {
  const MMSDK = new MetaMaskSDK();
  // const ethereum = MMSDK.getProvider(); // You can also access via window.ethereum
  const address = window.ethereum.request({ method: 'eth_requestAccounts', params: [] });
  console.log(address);
}

function RightSide () {  
    return (
      <div className="blocks rightblock">
        <SismoButt />
        <button className="MetaMask" onClick={signMeta}>Connect Wallet</button>
        <h3 className="MetaMask">Wallet Address: </h3>
      </div>
    )
}
  
export default RightSide