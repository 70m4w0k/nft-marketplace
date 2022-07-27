const hre = require("hardhat");

async function main() {
  const PlantFactory = await hre.ethers.getContractFactory("PlantFactory");
  const pf = await PlantFactory.deploy();

  await pf.deployed();

  console.log("PlantFactory deployed to:", pf.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
