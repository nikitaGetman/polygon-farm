import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers, run } = hre;
  const { deploy } = deployments;

  const { deployer, admin } = await getNamedAccounts();

  const token1Address = (await deployments.get("Token1")).address;
  const referralManagerAddress = (await deployments.get("ReferralManager"))
    .address;

  const squadManager = await deploy("Squads", {
    from: deployer,
    args: [token1Address, referralManagerAddress],
    log: true,
    autoMine: true,
    gasPrice: ethers.BigNumber.from(10).pow(10),
  });

  const referralManager = await ethers.getContract(
    "ReferralManager",
    await ethers.getSigner(admin)
  );

  await referralManager.authorizeContract(squadManager.address);

  await run("setup-squads");
};
func.tags = ["Squads"];
func.dependencies = ["Token1", "Token2", "ReferralManager", "Staking"];
export default func;
