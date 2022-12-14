import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { VENDOR_SELL_SWAP_RATE } from "../config";
import { ERC20, Token1, VendorSell } from "typechain-types";
import USDT_ABI from "../config/abi/usdtABI.json";

const POLYGON_USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers, network } = hre;
  const { deploy } = deployments;

  const { deployer, vendorPool, vendorChangePool } = await getNamedAccounts();

  const token1Address = (await deployments.get("Token1")).address;

  const changeTokenContract = network.live
    ? await ethers.getContractAt(USDT_ABI, POLYGON_USDT_ADDRESS)
    : await deployments.get("ERC20BurnableMock");

  const swapRate = VENDOR_SELL_SWAP_RATE;

  const token1 = await ethers.getContract<Token1>("Token1");

  if (!changeTokenContract) {
    throw new Error("VendorSell incorrect config for change token");
  }

  const changeToken = await ethers.getContractAt<ERC20>(
    network.live ? USDT_ABI : changeTokenContract.abi,
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

  if (vendorSell.newlyDeployed) {
    const vendorPoolSigner = await ethers.getSigner(vendorPool);
    const vendorChangePoolSigner = await ethers.getSigner(vendorChangePool);

    console.log("Approve Token1 VendorPool");
    let tx = await token1
      .connect(vendorPoolSigner)
      .approve(vendorSell.address, ethers.constants.MaxUint256);
    await tx.wait();

    console.log("Approve USDT VendorChangePool");
    tx = await changeToken
      .connect(vendorChangePoolSigner)
      .approve(vendorSell.address, ethers.constants.MaxUint256);
    await tx.wait();

    if (!network.live) {
      const vendorSellContract = await ethers.getContract<VendorSell>(
        "VendorSell",
        deployer
      );
      tx = await vendorSellContract.enableSell();
      await tx.wait();

      console.log("VendorSell: Token sell enabled");
    } else {
      console.log("VendorSell: Token sell disabled");
    }
  }
};
func.tags = ["VendorSell"];
func.dependencies = ["Token1"];
export default func;
