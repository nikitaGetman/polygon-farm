import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;

  const { deployer, vestingPool } = await getNamedAccounts();

  const token1 = await deployments.get("Token1");
  const token1Artifact = await deployments.getArtifact("Token1");

  const tokenVesting = await deploy("TokenVesting", {
    from: deployer,
    args: [token1.address, vestingPool],
    log: true,
    autoMine: true,
  });

  const vestingPoolSigner = await ethers.getSigner(vestingPool);
  const token1Contract = await ethers.getContractAtFromArtifact(
    token1Artifact,
    token1.address
  );

  await token1Contract
    .connect(vestingPoolSigner)
    .approve(tokenVesting.address, ethers.constants.MaxUint256);
};
func.tags = ["TokenVesting"];
func.dependencies = ["Token1"];
func.runAtTheEnd = true;
export default func;
