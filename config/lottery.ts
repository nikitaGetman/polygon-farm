import { BigNumber } from "ethers";

// @see: https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/#configurations
export const VRF_COORDINATOR: Record<string, string> = {
  mumbai: "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
  mainnet: "0xAE975071Be8F8eE67addBC1A82488F1C24858067",
};

export const KEY_HASH: Record<string, string> = {
  mumbai: "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f", // 500 gwei
  mainnet: "0xcc294a196eeeb44da2888d17c0625cc88d70d9760a69d58d853ba6581a9ab0cd", // 500 gwei
};

export const TOKENS_FOR_TICKET = BigNumber.from(10).pow(19);
export const TICKET_ID = 0;
export const DAYS_STREAK_FOR_TICKET = 5;
