import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Ticket, Token1, Token2 } from "typechain-types";
import {
  DAYS_STREAK_FOR_TICKET,
  KEY_HASH,
  TICKET_ID,
  TOKENS_FOR_TICKET,
  VRF_COORDINATOR,
} from "config";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers, network } = hre;
  const { deploy } = deployments;

  const { deployer, admin, referralRewardPool } = await getNamedAccounts();
  const token1 = await ethers.getContract<Token1>("Token1");
  const token2 = await ethers.getContract<Token2>("Token2", referralRewardPool);

  const ticket = await deploy("Ticket", {
    from: deployer,
    log: true,
    autoMine: true,
  });
  let vrfCoordinator = VRF_COORDINATOR[network.name];
  if (!network.live && !vrfCoordinator) {
    const vrfCoordinatorMock = await deploy("VRFCoordinatorMock", {
      from: deployer,
      log: true,
      autoMine: true,
    });

    vrfCoordinator = vrfCoordinatorMock.address;
  }

  const lottery = await deploy("Lottery", {
    from: deployer,
    args: [
      TOKENS_FOR_TICKET,
      TICKET_ID,
      DAYS_STREAK_FOR_TICKET,
      ticket.address,
      token1.address,
      token2.address,
      referralRewardPool,
      vrfCoordinator,
      process.env.ORACLE_SUBSCRIPTION_ID,
      KEY_HASH[network.name] || ethers.constants.HashZero,
    ],
    log: true,
    autoMine: true,
    gasPrice: ethers.BigNumber.from(10).pow(10),
  });

  await token2.approve(lottery.address, ethers.constants.MaxUint256);

  const ticketToken = await ethers.getContract<Ticket>("Ticket", admin);
  const MinterRole = await ticketToken.MINTER_ROLE();
  await ticketToken.grantRole(MinterRole, lottery.address);

  // IMPORTANT: Manually add lottery contract to coordinator
};
func.tags = ["Lottery"];
func.dependencies = ["Token1", "Token2"];
export default func;
