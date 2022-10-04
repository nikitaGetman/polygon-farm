import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { SQUADS } from "config";
import { Squads, Token1 } from "typechain-types";

type SubscribeParams = {
  token: Token1;
  tokenHolder: SignerWithAddress;
  account: SignerWithAddress;
  squadsManager: Squads;
  planId: number;
};
export async function autoSubscribeToSquad({
  token,
  tokenHolder,
  account,
  squadsManager,
  planId,
}: SubscribeParams) {
  const { subscriptionCost } = SQUADS[planId];

  await token.connect(tokenHolder).transfer(account.address, subscriptionCost);
  await token.connect(account).approve(squadsManager.address, subscriptionCost);

  await squadsManager.connect(account).subscribe(planId);
}
