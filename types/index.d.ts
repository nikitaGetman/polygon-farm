export type Staking = {
  durationDays: number;
  rewardPercent: number;
  subscriptionCost: number | string; // BigNumber
  subscriptionDurationDays: number;
};

export type Squad = {
  subscriptionCost: number | string;
  reward: number | string;
  stakingThreshold: number | string;
  squadSize: number;
  authorizedStakingIndex: number;
};
