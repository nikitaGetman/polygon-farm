import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const token1Address = (await deployments.get("Token1")).address;
  const token2Address = (await deployments.get("Token2")).address;
  const stakingAddress = (await deployments.get("Staking")).address;
  const referralManagerAddress = (await deployments.get("ReferralManager"))
    .address;
  const squadsAddress = (await deployments.get("Squads")).address;
  const lotteryAddress = (await deployments.get("Lottery")).address;

  await deploy("Helper", {
    from: deployer,
    args: [
      token1Address,
      token2Address,
      stakingAddress,
      referralManagerAddress,
      squadsAddress,
      lotteryAddress,
    ],
    log: true,
    autoMine: true,
  });
};
func.tags = ["Helper"];
func.dependencies = [
  "Token1",
  "Token2",
  "Staking",
  "ReferralManager",
  "Squads",
];
export default func;
