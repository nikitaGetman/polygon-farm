import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { VENDOR_SELL_SWAP_RATE } from "../config";
import { ERC20, Token1 } from "typechain-types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers, network } = hre;
  const { deploy } = deployments;

  const { deployer, vendorPool, vendorChangePool } = await getNamedAccounts();

  const token1Address = (await deployments.get("Token1")).address;

  const changeTokenContract =
    network.name === "mainnet"
      ? null
      : await deployments.get("ERC20BurnableMock");
  const swapRate = VENDOR_SELL_SWAP_RATE;

  const token1 = await ethers.getContract<Token1>("Token1");

  if (!changeTokenContract) {
    throw new Error("VendorSell incorrect config for change token");
  }

  const changeToken = await ethers.getContractAt<ERC20>(
    changeTokenContract.abi,
    changeTokenContract.address
  );

  const vendorSell = await deploy("VendorSell", {
    from: deployer,
    args: [
      token1Address,
      vendorPool,
      changeTokenContract.address,
      vendorChangePool,
      swapRate,
    ],
    log: true,
    autoMine: true,
  });

  const vendorPoolSigner = await ethers.getSigner(vendorPool);
  const vendorChangePoolSigner = await ethers.getSigner(vendorChangePool);

  let tx = await token1
    .connect(vendorPoolSigner)
    .approve(vendorSell.address, ethers.constants.MaxUint256);
  await tx.wait();

  tx = await changeToken
    .connect(vendorChangePoolSigner)
    .approve(vendorSell.address, ethers.constants.MaxUint256);
  await tx.wait();
};
func.tags = ["VendorSell"];
func.dependencies = ["Token1"];
export default func;
