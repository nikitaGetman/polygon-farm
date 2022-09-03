import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;

  const { deployer, token1Holder } = await getNamedAccounts();
  const initialSupply = process.env.TOKEN1_INITIAL_SUPPLY;

  if (!initialSupply) {
    throw new Error("Token1 initial supply not specified");
  }

  await deploy("Token1", {
    from: deployer,
    args: [ethers.BigNumber.from(initialSupply), token1Holder],
    log: true,
    autoMine: true,
  });
};
export default func;
func.tags = ["Token1"];
