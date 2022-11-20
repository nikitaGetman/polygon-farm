import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Token1 } from "typechain-types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;

  const { deployer, vestingPool } = await getNamedAccounts();
  const token1 = await ethers.getContract<Token1>("Token1");

  const tokenVesting = await deploy("TokenVesting", {
    from: deployer,
    args: [token1.address, vestingPool],
    log: true,
    autoMine: true,
  });

  const vestingPoolSigner = await ethers.getSigner(vestingPool);

  const tx = await token1
    .connect(vestingPoolSigner)
    .approve(tokenVesting.address, ethers.constants.MaxUint256);
  await tx.wait();
};
func.tags = ["TokenVesting"];
func.dependencies = ["Token1"];
export default func;
