import { task } from "hardhat/config";
import { VRFCoordinatorMock } from "typechain-types";

task("fullfil-lottery", "Fullfil lottery round").setAction(
  async (taskArgs, { ethers, getNamedAccounts }) => {
    const { admin } = await getNamedAccounts();
    const adminSigner = await ethers.getSigner(admin);
    const vrfCoordinator = await ethers.getContract<VRFCoordinatorMock>(
      "VRFCoordinatorMock",
      adminSigner
    );

    const setRandomTx = await vrfCoordinator.setRandomWords([1]);
    await setRandomTx.wait();
    const requestsLength = (
      await vrfCoordinator.getRequestsLength()
    ).toNumber();
    console.log(requestsLength);
    const fulfillTx = await vrfCoordinator.fulfillRequest(requestsLength - 1);
    await fulfillTx.wait();
  }
);
