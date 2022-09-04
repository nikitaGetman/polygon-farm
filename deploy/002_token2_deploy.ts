import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;

  const { deployer, token2Holder } = await getNamedAccounts();
  const initialSupply = process.env.TOKEN2_INITIAL_SUPPLY || 0;

  await deploy("Token2", {
    from: deployer,
    args: [ethers.BigNumber.from(initialSupply), token2Holder],
    log: true,
    autoMine: true,
  });
};
func.tags = ["Token2"];
export default func;
