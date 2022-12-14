/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ISquads,
  ISquadsInterface,
} from "../../../contracts/interfaces/ISquads";

const _abi = [
  {
    inputs: [],
    name: "getActivePlans",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "squadPlanId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "subscriptionCost",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reward",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stakingThreshold",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "squadSize",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stakingPlanId",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
        ],
        internalType: "struct ISquads.SquadPlan[]",
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
        internalType: "uint256",
        name: "planId",
        type: "uint256",
      },
    ],
    name: "getPlan",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "squadPlanId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "subscriptionCost",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reward",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stakingThreshold",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "squadSize",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stakingPlanId",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
        ],
        internalType: "struct ISquads.SquadPlan",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPlans",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "squadPlanId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "subscriptionCost",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "reward",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stakingThreshold",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "squadSize",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stakingPlanId",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
        ],
        internalType: "struct ISquads.SquadPlan[]",
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
        internalType: "uint256",
        name: "stakingPlanId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "getSufficientPlanIdByStakingAmount",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
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
        internalType: "uint256",
        name: "planId",
        type: "uint256",
      },
    ],
    name: "getUserSquadMembers",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
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
        internalType: "uint256",
        name: "planId",
        type: "uint256",
      },
    ],
    name: "getUserSubscription",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "subscription",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "squadsFilled",
            type: "uint256",
          },
        ],
        internalType: "struct ISquads.Squad",
        name: "",
        type: "tuple",
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
    name: "hasAnySubscription",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "planId",
        type: "uint256",
      },
    ],
    name: "subscribe",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "stakingPlanId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "address",
        name: "member",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "tryToAddMember",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
        name: "planId",
        type: "uint256",
      },
    ],
    name: "userHasPlanSubscription",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "planId",
        type: "uint256",
      },
    ],
    name: "userHasSufficientStaking",
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

export class ISquads__factory {
  static readonly abi = _abi;
  static createInterface(): ISquadsInterface {
    return new utils.Interface(_abi) as ISquadsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ISquads {
    return new Contract(address, _abi, signerOrProvider) as ISquads;
  }
}
