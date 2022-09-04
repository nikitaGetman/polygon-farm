import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { TOKEN1_INITIAL_SUPPLY } from "config";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  if (!TOKEN1_INITIAL_SUPPLY) {
    throw new Error("ERC20BurnableMock initial supply not specified");
  }

  await deploy("ERC20BurnableMock", {
    from: deployer,
    args: ["Test USDT", "TUSDT", ethers.BigNumber.from(TOKEN1_INITIAL_SUPPLY)],
    log: true,
    autoMine: true,
  });
};
func.tags = ["ERC20BurnableMock"];
func.skip = (hre: HardhatRuntimeEnvironment) =>
  Promise.resolve(hre.network.live);
export default func;
