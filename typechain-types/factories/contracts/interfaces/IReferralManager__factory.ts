/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IReferralManager,
  IReferralManagerInterface,
} from "../../../contracts/interfaces/IReferralManager";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "reward",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "referral",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "level",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "depositAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stakingPlanId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reason",
            type: "uint256",
          },
        ],
        internalType: "struct IReferralManager.AddDividendsParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "addUserDividends",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "level",
        type: "uint256",
      },
    ],
    name: "calculateRefReward",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getReferralLevels",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "level",
        type: "uint256",
      },
    ],
    name: "getUserReferralsByLevel",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "referralAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "level",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "activationDate",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isReferralSubscriptionActive",
            type: "bool",
          },
        ],
        internalType: "struct IReferralManager.Referral[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserReferrer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "address",
        name: "referrer",
        type: "address",
      },
    ],
    name: "setUserReferrer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "level",
        type: "uint256",
      },
    ],
    name: "userHasSubscription",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IReferralManager__factory {
  static readonly abi = _abi;
  static createInterface(): IReferralManagerInterface {
    return new utils.Interface(_abi) as IReferralManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IReferralManager {
    return new Contract(address, _abi, signerOrProvider) as IReferralManager;
  }
}
