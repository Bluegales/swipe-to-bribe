const { expect } = require("chai");

describe("GreeterPlugin", function () {
  it("Should return the new greeting once it's changed", async function () {
    const [deployer] = await ethers.getSigners();

    // deploy DAO contract
    const DAO = await ethers.getContractFactory("dDAO");
    const dao = await DAO.deploy();
    await dao.deployed();

    // deploy GreeterSetup contract
    const GreeterSetup = await ethers.getContractFactory("GreeterSetup");
    const greeterSetup = await GreeterSetup.deploy();
    await greeterSetup.deployed();

    // use GreeterSetup to deploy a GreeterPlugin instance
    await greeterSetup.prepareInstallation(dao.address, ethers.utils.formatBytes32String(""));
    const greeterAddress = await greeterSetup.plugin();
    
    // get GreeterPlugin instance
    const GreeterPlugin = await ethers.getContractAt("GreeterPlugin", greeterAddress);

    expect(await GreeterPlugin.greet()).to.equal("Hello world!");
  });
});
