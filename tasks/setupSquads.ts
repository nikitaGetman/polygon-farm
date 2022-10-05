import { SQUADS, STAKINGS } from "config";
import { task } from "hardhat/config";
import { getStakingName } from "utils/getStakingName";

task(
  "setup-squads",
  "Setup squads plan and authorize it in referral manager"
).setAction(async (taskArgs, { ethers, getNamedAccounts }) => {
  const { admin } = await getNamedAccounts();
  const adminSigner = await ethers.getSigner(admin);

  const squadsManager = await ethers.getContract("Squads", adminSigner);
  const stakingContracts: string[] = [];

  for (let i = 0; i < SQUADS.length; i++) {
    const {
      subscriptionCost,
      reward,
      stakingThreshold,
      squadSize,
      authorizedStakingIndex,
    } = SQUADS[i];

    const staking = STAKINGS[authorizedStakingIndex];
    const stakingName = getStakingName(staking);
    const stakingContract = await ethers.getContract(stakingName, adminSigner);

    console.log("Add plan " + i);
    await squadsManager.addPlan(
      subscriptionCost,
      reward,
      stakingThreshold,
      squadSize,
      stakingContract.address
    );

    if (!stakingContracts.includes(stakingContract.address)) {
      stakingContracts.push(stakingName);
    }
  }

  for (let i = 0; i < stakingContracts.length; i++) {
    const stakingContract = await ethers.getContract(
      stakingContracts[i],
      adminSigner
    );
    await stakingContract.updateSquadsManager(squadsManager.address);
    console.log(`Squad manager added to "${stakingContracts[i]}" contract.`);
  }
});
