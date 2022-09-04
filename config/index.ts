type Staking = {
  durationDays: number;
  rewardPercent: number;
  subscriptionCost: number;
  subscriptionDurationDays: number;
};

export const STAKINGS: Staking[] = [
  {
    durationDays: 1,
    rewardPercent: 10,
    subscriptionCost: 1000,
    subscriptionDurationDays: 365,
  },
  {
    durationDays: 10,
    rewardPercent: 50,
    subscriptionCost: 1000,
    subscriptionDurationDays: 365,
  },
  {
    durationDays: 100,
    rewardPercent: 100,
    subscriptionCost: 1000,
    subscriptionDurationDays: 365,
  },
];

export const VENDOR_SELL_SWAP_RATE = 1;
