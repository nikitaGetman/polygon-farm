import { Staking } from "types/index";

export function getStakingName(staking: Pick<Staking, "durationDays">) {
  return `Staking-d-${staking.durationDays}`;
}
