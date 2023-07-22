// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

// async function main() {

//   // Compile the contracts
//   await hre.run('compile');

//   // We get the contract to deploy
//   const SismoVerifier = await hre.ethers.getContractFactory("SismoVerifier");
//   const sismoVerifier = await SismoVerifier.deploy();

//   await sismoVerifier.deployed();

//   console.log("SismoVerifier deployed to:", sismoVerifier.address);
// }

async function main() {

  // Compile the contracts
  await hre.run('compile');

  // We get the contract to deploy
  const PromiseEscrow = await hre.ethers.getContractFactory("PromiseEscrow");
  const promiseEscrow = await PromiseEscrow.deploy("0x07865c6E87B9F70255377e024ace6630C1Eaa37F", "0x9923D42eF695B5dd9911D05Ac944d4cAca3c4EAB", "0x181242Cc8290CC779cd267520c27527aCc465578");

  await promiseEscrow.deployed();

  console.log("SismoVerifier deployed to:", promiseEscrow.address);
}

// async function main() {

//   // Compile the contracts
//   await hre.run('compile');

//   // We get the contract to deploy
//   const HelloWorld = await hre.ethers.getContractFactory("HelloWorld");
//   const helloWorld = await HelloWorld.deploy("hello!");

//   await helloWorld.deployed();

//   console.log("SismoVerifier deployed to:", helloWorld.address);
// }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
