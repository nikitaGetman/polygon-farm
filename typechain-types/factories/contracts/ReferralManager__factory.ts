/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  ReferralManager,
  ReferralManagerInterface,
} from "../../contracts/ReferralManager";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "subscriptionToken_",
        type: "address",
      },
      {
        internalType: "address",
        name: "rewardToken_",
        type: "address",
      },
      {
        internalType: "address",
        name: "rewardPool_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "fullSubscriptionCost_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "levelSubscriptionCost_",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "referrer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "referral",
        type: "address",
      },
    ],
    name: "ReferralAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "subscriber",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "levels",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "Subscribed",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "LEVELS",
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
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "REFERRAL_PERCENTS",
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
    name: "SUBSCRIPTION_PERIOD_DAYS",
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
    inputs: [
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
    ],
    name: "addUserDividends",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
    ],
    name: "authorizeContract",
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
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "claimDividends",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "fullSubscriptionCost",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTimestamp",
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
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
    ],
    name: "getUser1LvlReferrals",
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
        name: "userAddress",
        type: "address",
      },
    ],
    name: "getUserInfo",
    outputs: [
      {
        internalType: "address",
        name: "referrer",
        type: "address",
      },
      {
        internalType: "uint256[10]",
        name: "activeLevels",
        type: "uint256[10]",
      },
      {
        internalType: "uint256",
        name: "totalDividends",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalClaimedDividends",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "referrals_1_lvl",
        type: "address[]",
      },
      {
        internalType: "uint256[10]",
        name: "refCount",
        type: "uint256[10]",
      },
      {
        internalType: "uint256",
        name: "totalReferrals",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActiveSubscriber",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "activationDate",
        type: "uint256",
      },
    ],
    stateMutability: "view",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
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
        name: "contractAddress",
        type: "address",
      },
    ],
    name: "isAuthorized",
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
    inputs: [],
    name: "levelSubscriptionCost",
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
    inputs: [
      {
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
    ],
    name: "removeContractAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardToken",
    outputs: [
      {
        internalType: "contract IERC20",
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
        name: "referrer",
        type: "address",
      },
    ],
    name: "setMyReferrer",
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
    inputs: [],
    name: "subscribeToAllLevels",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "level",
        type: "uint256",
      },
    ],
    name: "subscribeToLevel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "subscriptionToken",
    outputs: [
      {
        internalType: "contract ERC20Burnable",
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
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
        name: "cost",
        type: "uint256",
      },
    ],
    name: "updateFullSubscriptionCost",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "cost",
        type: "uint256",
      },
    ],
    name: "updateLevelSubscriptionCost",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "level",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "percent",
        type: "uint256",
      },
    ],
    name: "updateReferralPercent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "poolAddress",
        type: "address",
      },
    ],
    name: "updateRewardPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "updateRewardToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "durationDays",
        type: "uint256",
      },
    ],
    name: "updateSubscriptionPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "updateSubscriptionToken",
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
    ],
    name: "userHasAnySubscription",
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

const _bytecode =
  "0x61016d6001556101c060405260646080908152605a60a052605060c052604660e052603c61010052603261012052602861014052601e61016052601461018052600a6101a08190526200005591600291620001d9565b503480156200006357600080fd5b506040516200224138038062002241833981016040819052620000869162000262565b6001600160a01b0385166200009a57600080fd5b6001600160a01b038416620000ae57600080fd5b6001600160a01b038316620000c257600080fd5b60008211620000d057600080fd5b60008111620000de57600080fd5b620000eb60003362000138565b600780546001600160a01b03199081166001600160a01b039788161790915560088054821695871695909517909455600980549094169290941691909117909155600455600355620002bf565b6000828152602081815260408083206001600160a01b038516845290915290205460ff16620001d5576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055620001943390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b8280548282559060005260206000209081019282156200021c579160200282015b828111156200021c578251829060ff16905591602001919060010190620001fa565b506200022a9291506200022e565b5090565b5b808211156200022a57600081556001016200022f565b80516001600160a01b03811681146200025d57600080fd5b919050565b600080600080600060a086880312156200027b57600080fd5b620002868662000245565b9450620002966020870162000245565b9350620002a66040870162000245565b6060870151608090970151959894975095949392505050565b611f7280620002cf6000396000f3fe608060405234801561001057600080fd5b506004361061023d5760003560e01c806391a9e4a21161013b578063d547741f116100b8578063e39092ba1161007c578063e39092ba14610501578063f7c618c114610514578063f8cf31cb14610527578063f8d0e6ec1461053a578063fe9fbb801461054d57600080fd5b8063d547741f146104ad578063d5fbac3a146104c0578063d6672e1c146104d3578063dc6492a5146104e6578063e2adba8c146104f957600080fd5b8063aaa138a2116100ff578063aaa138a214610455578063acb101631461045e578063b09b334f14610471578063b32cf5cf14610491578063bd7047c41461049a57600080fd5b806391a9e4a21461040c57806391d14854146104145780639d7594a714610427578063a217fddf1461043a578063a243d5ac1461044257600080fd5b80633fb55c61116101c9578063736560b51161018d578063736560b5146103aa5780637f24f0f2146103bd57806384197dbb146103d057806389b684f5146103e35780638ebb3c81146103ec57600080fd5b80633fb55c61146103365780635919adac14610349578063600d20ce1461035c5780636386c1c71461036f57806367561d931461039757600080fd5b8063188ec35611610210578063188ec356146102a3578063248a9ca3146102a95780632f2ff15d146102cc57806336144c9a146102df57806336568abe1461032357600080fd5b806301ffc9a714610242578063070d451f1461026a57806307fd4d961461027b5780630dcb3c8a1461028e575b600080fd5b610255610250366004611aa5565b610579565b60405190151581526020015b60405180910390f35b600a5b604051908152602001610261565b610255610289366004611aeb565b6105b0565b6102a161029c366004611b15565b6105f5565b005b4261026d565b61026d6102b7366004611b15565b60009081526020819052604090206001015490565b6102a16102da366004611b2e565b610606565b61030b6102ed366004611b5a565b6001600160a01b039081166000908152600560205260409020541690565b6040516001600160a01b039091168152602001610261565b6102a1610331366004611b2e565b610630565b6102a1610344366004611aeb565b6106b3565b6102a1610357366004611b5a565b610735565b61026d61036a366004611b15565b610742565b61038261037d366004611b5a565b610763565b60405161026199989796959493929190611be2565b6102a16103a5366004611b5a565b6108a6565b6102a16103b8366004611b15565b6108d6565b6102a16103cb366004611b5a565b6108e7565b61026d6103de366004611c55565b610914565b61026d60035481565b6103ff6103fa366004611b5a565b610976565b6040516102619190611c77565b6102a16109ef565b610255610422366004611b2e565b610b3d565b6102a1610435366004611b15565b610b66565b61026d600081565b6102a1610450366004611b5a565b610d9d565b61026d60015481565b6102a161046c366004611b15565b610dcb565b61048461047f366004611aeb565b610ddc565b6040516102619190611c8a565b61026d60045481565b6102a16104a8366004611b15565b610dea565b6102a16104bb366004611b2e565b610efd565b6102a16104ce366004611b5a565b610f22565b60075461030b906001600160a01b031681565b6102a16104f4366004611c55565b610f50565b61026d600a81565b61025561050f366004611b5a565b610fa5565b60085461030b906001600160a01b031681565b6102a1610535366004611b5a565b610fe5565b6102a1610548366004611cf9565b611013565b61025561055b366004611b5a565b6001600160a01b031660009081526006602052604090205460ff1690565b60006001600160e01b03198216637965db0b60e01b14806105aa57506301ffc9a760e01b6001600160e01b03198316145b92915050565b6000426001600160a01b03841660009081526005602052604090206001908101906105db9085611d39565b600a81106105eb576105eb611d50565b0154119392505050565b60006106008161106b565b50600355565b6000828152602081905260409020600101546106218161106b565b61062b8383611075565b505050565b6001600160a01b03811633146106a55760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6106af82826110f9565b5050565b6106bc3361055b565b6107015760405162461bcd60e51b81526020600482015260166024820152751059191c995cdcc81b9bdd08185d5d1a1bdc9a5e995960521b604482015260640161069c565b6001600160a01b0382166000908152600560205260408120600b01805483929061072c908490611d66565b90915550505050565b61073f338261115e565b50565b6002818154811061075257600080fd5b600091825260209091200154905081565b600061076d611a86565b600080606061077a611a86565b6001600160a01b0387811660009081526005602052604080822080548251610140810193849052941699509192839283929091906001830190600a9082845b8154815260200190600101908083116107b9575050505050985080600b0154975080600c0154965080600d0180548060200260200160405190810160405280929190818152602001828054801561083957602002820191906000526020600020905b81546001600160a01b0316815260019091019060200180831161081b575b505060408051610140810191829052949a50600e86019350600a9250905082845b81548152602001906001019080831161085a575050505050945061087f8b6000611531565b60188201546019909201549a9c999b509799969895979496949560ff909116949350915050565b60006108b18161106b565b506001600160a01b03166000908152600660205260409020805460ff19166001179055565b60006108e18161106b565b50600155565b60006108f28161106b565b506001600160a01b03166000908152600660205260409020805460ff19169055565b600080821161092257600080fd5b600a82111561093057600080fd5b6064600261093f600185611d39565b8154811061094f5761094f611d50565b9060005260206000200154846109659190611d7e565b61096f9190611d9d565b9392505050565b6001600160a01b038116600090815260056020908152604091829020600d018054835181840281018401909452808452606093928301828280156109e357602002820191906000526020600020905b81546001600160a01b031681526001909101906020018083116109c5575b50505050509050919050565b6000336007546004805460405163079cc67960e41b81526001600160a01b0380861693820193909352602481019190915292935016906379cc679090604401600060405180830381600087803b158015610a4857600080fd5b505af1158015610a5c573d6000803e3d6000fd5b50505050600060015462015180610a739190611d7e565b610a7d9042611d66565b905060005b600a811015610acd576001600160a01b0383166000908152600560205260409020829060010182600a8110610ab957610ab9611d50565b015580610ac581611dbf565b915050610a82565b506001600160a01b0382166000818152600560205260409020601801805460ff191660019081179091554291907ff94991dcbea6e8ac439cbc93bd9c62a4d39f04e0ad656df9a703f13552c2787f90610b2890600a90611d66565b60405190815260200160405180910390a35050565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b60008111610ba65760405162461bcd60e51b815260206004820152600d60248201526c151bdbc81b1bddc81b195d995b609a1b604482015260640161069c565b600a811115610be75760405162461bcd60e51b815260206004820152600d60248201526c151bdbc8189a59c81b195d995b609a1b604482015260640161069c565b60003360075460035460405163079cc67960e41b81526001600160a01b038085166004830152602482019290925292935016906379cc679090604401600060405180830381600087803b158015610c3d57600080fd5b505af1158015610c51573d6000803e3d6000fd5b505050506000610c5e4290565b6001600160a01b0383166000908152600560205260409020600190810190610c869086611d39565b600a8110610c9657610c96611d50565b015410610cdc576001600160a01b0382166000908152600560205260409020600190810190610cc59085611d39565b600a8110610cd557610cd5611d50565b0154610cde565b425b905060015462015180610cf19190611d7e565b610cfb9082611d66565b6001600160a01b0383166000908152600560205260409020600190810190610d239086611d39565b600a8110610d3357610d33611d50565b01556001600160a01b03821660008181526005602052604090819020601801805460ff19166001179055518291907ff94991dcbea6e8ac439cbc93bd9c62a4d39f04e0ad656df9a703f13552c2787f90610d909087815260200190565b60405180910390a3505050565b6000610da88161106b565b50600780546001600160a01b0319166001600160a01b0392909216919091179055565b6000610dd68161106b565b50600455565b606061096f8383600161159c565b336000908152600560205260409020600c810154600b8201548391610e0e91611d39565b1015610e525760405162461bcd60e51b8152602060048201526013602482015272125b9cdd59999a58da595b9d08185b5bdd5b9d606a1b604482015260640161069c565b8181600c016000828254610e669190611d66565b90915550506008546009546001600160a01b03918216916323b872dd9116336040516001600160e01b031960e085901b1681526001600160a01b03928316600482015291166024820152604481018590526064016020604051808303816000875af1158015610ed9573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061062b9190611dda565b600082815260208190526040902060010154610f188161106b565b61062b83836110f9565b6000610f2d8161106b565b50600980546001600160a01b0319166001600160a01b0392909216919091179055565b6000610f5b8161106b565b60008311610f6857600080fd5b600a831115610f7657600080fd5b816002610f84600186611d39565b81548110610f9457610f94611d50565b600091825260209091200155505050565b600060015b600a8111610fdc57610fbc83826105b0565b15610fca5750600192915050565b80610fd481611dbf565b915050610faa565b50600092915050565b6000610ff08161106b565b50600880546001600160a01b0319166001600160a01b0392909216919091179055565b61101c3361055b565b6110615760405162461bcd60e51b81526020600482015260166024820152751059191c995cdcc81b9bdd08185d5d1a1bdc9a5e995960521b604482015260640161069c565b6106af828261115e565b61073f81336117db565b61107f8282610b3d565b6106af576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556110b53390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6111038282610b3d565b156106af576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6111916040518060400160405280601081526020016f2fb9b2ba2ab9b2b92932b332b93932b960811b815250838361183f565b6001600160a01b0382166111de5760405162461bcd60e51b815260206004820152601460248201527355736572206973207a65726f206164647265737360601b604482015260640161069c565b6001600160a01b0381166112345760405162461bcd60e51b815260206004820152601860248201527f5265666572726572206973207a65726f20616464726573730000000000000000604482015260640161069c565b816001600160a01b0316816001600160a01b031614156112965760405162461bcd60e51b815260206004820152601860248201527f52656665727265722063616e206e6f7420626520757365720000000000000000604482015260640161069c565b6001600160a01b0382811660009081526005602052604090205416156112fe5760405162461bcd60e51b815260206004820152601d60248201527f526566657272657220697320616c726561647920737065636966696564000000604482015260640161069c565b6113098160016105b0565b6113555760405162461bcd60e51b815260206004820152601c60248201527f526566657272657220686173206e6f20737562736372697074696f6e00000000604482015260640161069c565b6001600160a01b03828116600081815260056020908152604080832080549587166001600160a01b031996871681178255426019909201919091558352808320600d0180546001810182559084529282902090920180549094169092179092558151808301909252600c82526b1c9959995c9c995c881cd95d60a21b908201526113de90611886565b8060005b600a8110156114b957836001600160a01b0316826001600160a01b0316141561143d5760405162461bcd60e51b815260206004820152600d60248201526c4379636c696320636861696e2160981b604482015260640161069c565b6001600160a01b0382166000908152600560205260409020601881015460ff16156114a057600181600e0183600a811061147957611479611d50565b0160008282546114899190611d66565b909155505080546001600160a01b031692506114a6565b506114b9565b50806114b181611dbf565b9150506113e2565b506114ec60405180604001604052806011815260200170185b1b081c9959995c9c995c9cc81cd95d607a1b815250611886565b826001600160a01b0316826001600160a01b03167f3f6a300e641007b6c88b17485d36e2d83c20409a1c5e79bfa1f4eb69ea09469560405160405180910390a3505050565b6001600160a01b038216600090815260056020526040812081805b61155785600a611d39565b8110156115935782600e0181600a811061157357611573611d50565b015461157f9083611d66565b91508061158b81611dbf565b91505061154c565b50949350505050565b6060828211156115e65760405162461bcd60e51b815260206004820152601560248201527410dd5c9c995b9d081b195d995b080f881b195d995b605a1b604482015260640161069c565b60006115f185610976565b6001600160a01b038616600090815260056020526040812091925090600e0161161a8587611d39565b600a811061162a5761162a611d50565b0154905060008167ffffffffffffffff81111561164957611649611dfc565b60405190808252806020026020018201604052801561169b57816020015b6040805160808101825260008082526020808301829052928201819052606082015282526000199092019101816116675790505b5090506000805b84518110156117ce5760008582815181106116bf576116bf611d50565b602002602001015190508888141561173b57604080516080810182526001600160a01b03831680825260208083018c905260009182526005905282902060190154918101919091526060810161171483610fa5565b151581525084838151811061172b5761172b611d50565b60200260200101819052506117bb565b6000611752828b61174d8c6001611d66565b61159c565b905060005b81518110156117b85781818151811061177257611772611d50565b602002602001015186868151811061178c5761178c611d50565b602002602001018190525084806117a290611dbf565b95505080806117b090611dbf565b915050611757565b50505b50806117c681611dbf565b9150506116a2565b5090979650505050505050565b6117e58282610b3d565b6106af576117fd816001600160a01b031660146118c9565b6118088360206118c9565b604051602001611819929190611e3e565b60408051601f198184030181529082905262461bcd60e51b825261069c91600401611edf565b61062b83838360405160240161185793929190611ef2565b60408051601f198184030181529190526020810180516001600160e01b03166307e763af60e51b179052611a65565b61073f8160405160240161189a9190611edf565b60408051601f198184030181529190526020810180516001600160e01b031663104c13eb60e21b179052611a65565b606060006118d8836002611d7e565b6118e3906002611d66565b67ffffffffffffffff8111156118fb576118fb611dfc565b6040519080825280601f01601f191660200182016040528015611925576020820181803683370190505b509050600360fc1b8160008151811061194057611940611d50565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061196f5761196f611d50565b60200101906001600160f81b031916908160001a9053506000611993846002611d7e565b61199e906001611d66565b90505b6001811115611a16576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106119d2576119d2611d50565b1a60f81b8282815181106119e8576119e8611d50565b60200101906001600160f81b031916908160001a90535060049490941c93611a0f81611f25565b90506119a1565b50831561096f5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161069c565b80516a636f6e736f6c652e6c6f67602083016000808483855afa5050505050565b604051806101400160405280600a906020820280368337509192915050565b600060208284031215611ab757600080fd5b81356001600160e01b03198116811461096f57600080fd5b80356001600160a01b0381168114611ae657600080fd5b919050565b60008060408385031215611afe57600080fd5b611b0783611acf565b946020939093013593505050565b600060208284031215611b2757600080fd5b5035919050565b60008060408385031215611b4157600080fd5b82359150611b5160208401611acf565b90509250929050565b600060208284031215611b6c57600080fd5b61096f82611acf565b8060005b600a811015611b98578151845260209384019390910190600101611b79565b50505050565b600081518084526020808501945080840160005b83811015611bd75781516001600160a01b031687529582019590820190600101611bb2565b509495945050505050565b6001600160a01b038a1681526000610360611c00602084018c611b75565b8961016084015288610180840152806101a0840152611c2181840189611b9e565b915050611c326101c0830187611b75565b610300820194909452911515610320830152610340909101529695505050505050565b60008060408385031215611c6857600080fd5b50508035926020909101359150565b60208152600061096f6020830184611b9e565b602080825282518282018190526000919060409081850190868401855b82811015611cec57815180516001600160a01b031685528681015187860152858101518686015260609081015115159085015260809093019290850190600101611ca7565b5091979650505050505050565b60008060408385031215611d0c57600080fd5b611d1583611acf565b9150611b5160208401611acf565b634e487b7160e01b600052601160045260246000fd5b600082821015611d4b57611d4b611d23565b500390565b634e487b7160e01b600052603260045260246000fd5b60008219821115611d7957611d79611d23565b500190565b6000816000190483118215151615611d9857611d98611d23565b500290565b600082611dba57634e487b7160e01b600052601260045260246000fd5b500490565b6000600019821415611dd357611dd3611d23565b5060010190565b600060208284031215611dec57600080fd5b8151801515811461096f57600080fd5b634e487b7160e01b600052604160045260246000fd5b60005b83811015611e2d578181015183820152602001611e15565b83811115611b985750506000910152565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351611e76816017850160208801611e12565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351611ea7816028840160208801611e12565b01602801949350505050565b60008151808452611ecb816020860160208601611e12565b601f01601f19169290920160200192915050565b60208152600061096f6020830184611eb3565b606081526000611f056060830186611eb3565b6001600160a01b0394851660208401529290931660409091015292915050565b600081611f3457611f34611d23565b50600019019056fea2646970667358221220cc92af0441d9e257d1dd9aa8bbfe0e1237cb0cf6b483d617f2ec1c67dea37cc164736f6c634300080b0033";

type ReferralManagerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ReferralManagerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ReferralManager__factory extends ContractFactory {
  constructor(...args: ReferralManagerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    subscriptionToken_: PromiseOrValue<string>,
    rewardToken_: PromiseOrValue<string>,
    rewardPool_: PromiseOrValue<string>,
    fullSubscriptionCost_: PromiseOrValue<BigNumberish>,
    levelSubscriptionCost_: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ReferralManager> {
    return super.deploy(
      subscriptionToken_,
      rewardToken_,
      rewardPool_,
      fullSubscriptionCost_,
      levelSubscriptionCost_,
      overrides || {}
    ) as Promise<ReferralManager>;
  }
  override getDeployTransaction(
    subscriptionToken_: PromiseOrValue<string>,
    rewardToken_: PromiseOrValue<string>,
    rewardPool_: PromiseOrValue<string>,
    fullSubscriptionCost_: PromiseOrValue<BigNumberish>,
    levelSubscriptionCost_: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      subscriptionToken_,
      rewardToken_,
      rewardPool_,
      fullSubscriptionCost_,
      levelSubscriptionCost_,
      overrides || {}
    );
  }
  override attach(address: string): ReferralManager {
    return super.attach(address) as ReferralManager;
  }
  override connect(signer: Signer): ReferralManager__factory {
    return super.connect(signer) as ReferralManager__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ReferralManagerInterface {
    return new utils.Interface(_abi) as ReferralManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ReferralManager {
    return new Contract(address, _abi, signerOrProvider) as ReferralManager;
  }
}
