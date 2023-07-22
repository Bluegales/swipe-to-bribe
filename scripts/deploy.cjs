const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());

  const getGreeterSetup = await hre.ethers.getContractFactory('GreeterSetup');
  const GreeterSetup = await getGreeterSetup.deploy();

  console.log('GreeterSetup address:', GreeterSetup.address);

  const getDAO = await hre.ethers.getContractFactory('dDAO');
  const dao = await getDAO.deploy();

  const getGreeterPlugin = await hre.ethers.getContractFactory('GreeterPlugin');
  const GreeterPlugin = await getGreeterPlugin.deploy(dao);

  console.log('GreeterPlugin address:', GreeterPlugin.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });