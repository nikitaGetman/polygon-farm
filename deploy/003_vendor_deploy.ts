import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { VENDOR_SELL_SWAP_RATE } from "../config";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers, network } = hre;
  const { deploy } = deployments;

  const { deployer, vendorPool, vendorChangePool } = await getNamedAccounts();

  const token1Address = (await deployments.get("Token1")).address;
  const token1Artifact = await deployments.getArtifact("Token1");
  const changeTokenAddress =
    network.name === "mainnet"
      ? null
      : (await deployments.get("ERC20BurnableMock")).address;
  const changeTokenArtifact =
    network.name === "mainnet"
      ? null
      : await deployments.getArtifact("ERC20BurnableMock");
  const swapRate = VENDOR_SELL_SWAP_RATE;

  if (!changeTokenArtifact || !changeTokenAddress) {
    throw new Error("VendorSell incorrect config for change token");
  }

  const vendorSell = await deploy("VendorSell", {
    from: deployer,
    args: [
      token1Address,
      vendorPool,
      changeTokenAddress,
      vendorChangePool,
      swapRate,
    ],
    log: true,
    autoMine: true,
  });

  const vendorPoolSigner = await ethers.getSigner(vendorPool);
  const vendorChangePoolSigner = await ethers.getSigner(vendorChangePool);

  const token1 = await ethers.getContractAtFromArtifact(
    token1Artifact,
    token1Address
  );
  const changeToken = await ethers.getContractAtFromArtifact(
    changeTokenArtifact,
    changeTokenAddress
  );

  await token1
    .connect(vendorPoolSigner)
    .approve(vendorSell.address, ethers.constants.MaxUint256);

  await changeToken
    .connect(vendorChangePoolSigner)
    .approve(vendorSell.address, ethers.constants.MaxUint256);
};
func.tags = ["VendorSell"];
func.dependencies = ["Token1"];
export default func;
