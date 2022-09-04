import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { TOKEN2_INITIAL_SUPPLY } from "config";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;

  const { deployer, token2Holder } = await getNamedAccounts();

  await deploy("Token2", {
    from: deployer,
    args: [ethers.BigNumber.from(TOKEN2_INITIAL_SUPPLY), token2Holder],
    log: true,
    autoMine: true,
  });
};
func.tags = ["Token2"];
export default func;
