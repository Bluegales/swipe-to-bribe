require("@nomiclabs/hardhat-ethers");

async function main() {
	const [deployer] = await hre.ethers.getSigners();
	const SismoVerifier = await hre.ethers.getContractFactory("SismoVerifier");
	const sismoVerifier = await SismoVerifier.deploy();
	await sismoVerifier.deployed();
  
	console.log("SismoVerifier deployed to:", sismoVerifier.address);
  }
  
  main()
	.then(() => process.exit(0))
	.catch((error) => {
	  console.error(error);
	  process.exit(1);
	});
  