import {
  lotteryABI,
  referralManagerABI,
  savABI,
  savrABI,
  squadsABI,
  stakingABI,
  ticketABI,
  vendorSellABI,
  vestingABI,
} from './abi';

export const TOKEN_SAV = 'Token1';
export const TOKEN_SAVR = 'Token2';
export const TOKEN_TICKET = 'Ticket';
export const VESTING = 'TokenVesting';
export const VENDOR_SELL = 'VendorSell';
export const STAKING = 'Staking';
export const REFERRAL_MANAGER = 'ReferralManager';
export const SQUADS = 'Squads';
export const LOTTERY = 'Lottery';

export const CONTRACTS = {
  [TOKEN_SAV]: {
    address: '0xb971Bbda8043267e8047372A29A5bfA8B78A2D04',
    abi: savABI,
  },
  [TOKEN_SAVR]: {
    address: '0xbaD18847048E47f58f90B049A3C2b5A308Fb0E66',
    abi: savrABI,
  },
  [TOKEN_TICKET]: {
    address: '0x6C9390091A92e09e08F612aEcF4E2BA697D69CEF',
    abi: ticketABI,
  },
  [VESTING]: {
    address: '0x73507bc6c981F12cfE9d41ea4d583e05EeCe8312',
    abi: vestingABI,
  },
  [VENDOR_SELL]: {
    address: '0x341821c9023a565e67832Acb0a0512008F61C143',
    abi: vendorSellABI,
  },
  [STAKING]: {
    address: '0x2DF5295327e84D3e19Ba23cfAbf9F8bcD2E0f1Cc',
    abi: stakingABI,
  },
  [REFERRAL_MANAGER]: {
    address: '0xea1A47a80382Be3D830a605e9F3Ab5c11FbdE91a',
    abi: referralManagerABI,
  },
  [SQUADS]: {
    address: '0x3BFbac48959adee4DC4EEC61867A06188128595D',
    abi: squadsABI,
  },
  [LOTTERY]: {
    address: '0xcBd1422EF22E69709D1161f37Efd92d541bBF564',
    abi: lotteryABI,
  },
};
