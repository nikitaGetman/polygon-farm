import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Token1, ReferralManager } from "typechain-types";
import { autoStakeToken, StakeTokenParams } from "./staking";

type SubscribeParams = {
  token: Token1;
  tokenHolder: SignerWithAddress;
  account: SignerWithAddress;
  referralManager: ReferralManager;
};
export async function autoSubscribeToReferral({
  token,
  tokenHolder,
  account,
  referralManager,
  levels,
}: SubscribeParams & { levels?: number }) {
  const levelsToSubscribe = levels || 1;
  const levelSubscriptionCost = await referralManager.levelSubscriptionCost();
  const subscriptionCost = levelSubscriptionCost.mul(levelsToSubscribe);

  await token.connect(tokenHolder).transfer(account.address, subscriptionCost);
  await token
    .connect(account)
    .approve(referralManager.address, subscriptionCost);

  await referralManager.connect(account).subscribeToLevels(levelsToSubscribe);
}

type ReferralChainParams = Omit<SubscribeParams, "account"> & {
  levels?: number;
  signers: SignerWithAddress[];
  adminAccount: SignerWithAddress;
  getStakeParams?: (
    level: number,
    defaultParams?: StakeTokenParams
  ) => StakeTokenParams & { repeat?: boolean };
} & Pick<StakeTokenParams, "stakingContract">;
export async function createReferralChain({
  token,
  tokenHolder,
  referralManager,
  stakingContract,
  levels,
  signers,
  adminAccount,
  getStakeParams,
}: ReferralChainParams) {
  const levelsToSubscribe =
    levels || (await referralManager.getReferralLevels());

  await referralManager
    .connect(adminAccount)
    .authorizeContract(stakingContract.address);

  const chainAccounts = [];

  let [referrer, ...restSigners] = signers;
  chainAccounts.push({ ...referrer, level: 0 });
  let i = 1;
  while (i <= levelsToSubscribe && restSigners.length > 0) {
    let acc: SignerWithAddress;
    [acc, ...restSigners] = restSigners;
    await autoSubscribeToReferral({
      token,
      tokenHolder,
      account: referrer,
      referralManager,
    });

    const defaultParams = {
      acc,
      adminAccount,
      token1: token,
      token1Holder: tokenHolder,
      stakingContract,
      referrer,
    };
    const { repeat, ...stakeParams } = getStakeParams
      ? getStakeParams(i, defaultParams)
      : {
          ...defaultParams,
          repeat: false,
        };

    await autoStakeToken(stakeParams);

    chainAccounts.push({ ...acc, level: i });
    if (!repeat) {
      i++;
      referrer = acc;
    }
  }
  return chainAccounts;
}
