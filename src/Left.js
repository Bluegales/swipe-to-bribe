import { ethers } from 'ethers';
import ABI from './abi.json'
import { CONTRACT_ADDRESS, SISMO_CONST } from  './constants'
import React, { useContext } from 'react';
import { UserContext } from './App';

function LeftSide () {  
  const { sismoResponse } = useContext(UserContext);

  // async function createPromise({ }) {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner();
  //   const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  //   try {
  //     const tx = await contract.createPromise(
  //       (new ethers.utils.AbiCoder()).encode(["string"], ["Improving trash cans by implementing a trash monster to efficiently devour and dispose of waste, reducing environmental impact and promoting sustainable waste management practices."]),
  //       (new ethers.utils.AbiCoder()).encode(["string"], [SISMO_CONST]),
  //       sismoResponse,
  //     );
  //     await tx.wait();
  //     console.log("Campaign created: " + tx.hash);
  //   } catch (error) {
  //     console.log("Error while creating campaign: ", error);
  //   }
  // } 

  return (
    <div className="blocks leftblock">
      <div class="image"></div>
      <h1>SwipeRight</h1>
      <h1>2Bribe</h1>
      {/* <form>
        <input type="text"></input>
        <input type="submit" value="Submit" onClick={() => createPromise()}/>
      </form> */}
    </div>
  )
}
  
export default LeftSide