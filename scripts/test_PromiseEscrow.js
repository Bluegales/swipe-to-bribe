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

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });