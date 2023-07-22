// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

  // Compile the contracts
  await hre.run('compile');

  // We get the contract to deploy
  const SismoVerifier = await hre.ethers.getContractFactory("SismoVerifier");
  const sismoVerifier = await SismoVerifier.deploy();

  await sismoVerifier.deployed();

  console.log("SismoVerifier deployed to:", sismoVerifier.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
