import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;

  const { deployer, vestingPool } = await getNamedAccounts();

  const token1Address = (await deployments.get("Token1")).address;

  const tokenVesting = await deploy("TokenVesting", {
    from: deployer,
    args: [token1Address, vestingPool],
    log: true,
    autoMine: true,
  });

  const vestingPoolSigner = await ethers.getSigner(vestingPool);
  const token1 = await ethers.getContract("Token1");

  await token1
    .connect(vestingPoolSigner)
    .approve(tokenVesting.address, ethers.constants.MaxUint256);
};
func.tags = ["TokenVesting"];
func.dependencies = ["Token1"];
export default func;
