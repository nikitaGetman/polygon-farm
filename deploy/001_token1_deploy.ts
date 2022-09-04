import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { TOKEN1_INITIAL_SUPPLY } from "config";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;

  const { deployer, token1Holder } = await getNamedAccounts();

  if (!TOKEN1_INITIAL_SUPPLY) {
    throw new Error("Token1 initial supply not specified");
  }

  await deploy("Token1", {
    from: deployer,
    args: [ethers.BigNumber.from(TOKEN1_INITIAL_SUPPLY), token1Holder],
    log: true,
    autoMine: true,
  });
};
func.tags = ["Token1"];
export default func;
