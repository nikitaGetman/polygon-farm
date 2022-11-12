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
        internalType: "uint256",
        name: "referrals_1_lvl",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalReferrals",
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
    name: "getUserLvlReferralsCount",
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
      {
        internalType: "uint256",
        name: "currentLevel",
        type: "uint256",
      },
    ],
    name: "getUserReferrals",
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
        ],
        internalType: "struct ReferralManager.Referral[]",
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
  "0x61016d6001556101c060405260646080908152605a60a052605060c052604660e052603c61010052603261012052602861014052601e61016052601461018052600a6101a08190526200005591600291620001d9565b503480156200006357600080fd5b5060405162001dc138038062001dc1833981016040819052620000869162000262565b6001600160a01b0385166200009a57600080fd5b6001600160a01b038416620000ae57600080fd5b6001600160a01b038316620000c257600080fd5b60008211620000d057600080fd5b60008111620000de57600080fd5b620000eb60003362000138565b600780546001600160a01b03199081166001600160a01b039788161790915560088054821695871695909517909455600980549094169290941691909117909155600455600355620002bf565b6000828152602081815260408083206001600160a01b038516845290915290205460ff16620001d5576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055620001943390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b8280548282559060005260206000209081019282156200021c579160200282015b828111156200021c578251829060ff16905591602001919060010190620001fa565b506200022a9291506200022e565b5090565b5b808211156200022a57600081556001016200022f565b80516001600160a01b03811681146200025d57600080fd5b919050565b600080600080600060a086880312156200027b57600080fd5b620002868662000245565b9450620002966020870162000245565b9350620002a66040870162000245565b6060870151608090970151959894975095949392505050565b611af280620002cf6000396000f3fe608060405234801561001057600080fd5b50600436106102325760003560e01c806391a9e4a211610130578063d547741f116100b8578063f7c618c11161007c578063f7c618c11461050d578063f7d93c0d14610520578063f8cf31cb14610533578063f8d0e6ec14610546578063fe9fbb801461055957600080fd5b8063d547741f146104b9578063d5fbac3a146104cc578063d6672e1c146104df578063dc6492a5146104f2578063e2adba8c1461050557600080fd5b8063a243d5ac116100ff578063a243d5ac1461046e578063aaa138a214610481578063acb101631461048a578063b32cf5cf1461049d578063bd7047c4146104a657600080fd5b806391a9e4a21461043857806391d14854146104405780639d7594a714610453578063a217fddf1461046657600080fd5b80633fb55c61116101be578063736560b511610182578063736560b5146103d65780637f24f0f2146103e957806384197dbb146103fc57806389b684f51461040f5780638ebb3c811461041857600080fd5b80633fb55c61146103455780635919adac14610358578063600d20ce1461036b5780636386c1c71461037e57806367561d93146103c357600080fd5b80630dcb3c8a116102055780630dcb3c8a146102a3578063248a9ca3146102b85780632f2ff15d146102db57806336144c9a146102ee57806336568abe1461033257600080fd5b806301ffc9a71461023757806304b107a21461025f578063070d451f1461027f57806307fd4d9614610290575b600080fd5b61024a610245366004611729565b610585565b60405190151581526020015b60405180910390f35b61027261026d36600461176f565b6105bc565b6040516102569190611799565b600a5b604051908152602001610256565b61024a61029e36600461176f565b61077e565b6102b66102b13660046117f1565b6107c2565b005b6102826102c63660046117f1565b60009081526020819052604090206001015490565b6102b66102e936600461180a565b6107d3565b61031a6102fc366004611836565b6001600160a01b039081166000908152600560205260409020541690565b6040516001600160a01b039091168152602001610256565b6102b661034036600461180a565b6107fd565b6102b661035336600461176f565b610880565b6102b6610366366004611836565b610902565b6102826103793660046117f1565b61090f565b61039161038c366004611836565b610930565b604080516001600160a01b0390961686526020860194909452928401919091526060830152608082015260a001610256565b6102b66103d1366004611836565b610979565b6102b66103e43660046117f1565b6109a9565b6102b66103f7366004611836565b6109ba565b61028261040a366004611851565b6109e7565b61028260035481565b61042b610426366004611836565b610a49565b6040516102569190611873565b6102b6610ac2565b61024a61044e36600461180a565b610bfe565b6102b66104613660046117f1565b610c27565b610282600081565b6102b661047c366004611836565b610db3565b61028260015481565b6102b66104983660046117f1565b610de1565b61028260045481565b6102b66104b43660046117f1565b610df2565b6102b66104c736600461180a565b610f05565b6102b66104da366004611836565b610f2a565b60075461031a906001600160a01b031681565b6102b6610500366004611851565b610f58565b610282600a81565b60085461031a906001600160a01b031681565b61028261052e36600461176f565b610fad565b6102b6610541366004611836565b610fec565b6102b66105543660046118b4565b61101a565b61024a610567366004611836565b6001600160a01b031660009081526006602052604090205460ff1690565b60006001600160e01b03198216637965db0b60e01b14806105b657506301ffc9a760e01b6001600160e01b03198316145b92915050565b606060006105ca8484611072565b90506000808267ffffffffffffffff8111156105e8576105e86118de565b60405190808252806020026020018201604052801561062d57816020015b60408051808201909152600080825260208201528152602001906001900390816106065790505b509050600061063b87610a49565b905060005b8151811015610772576040518060400160405280838381518110610666576106666118f4565b60200260200101516001600160a01b031681526020018860016106899190611920565b81525083858151811061069e5761069e6118f4565b602002602001018190525083806106b490611938565b9450600a90506106c5886001611920565b10156107605760006106f78383815181106106e2576106e26118f4565b602002602001015189600161026d9190611920565b905060005b815181101561075d57818181518110610717576107176118f4565b6020026020010151858781518110610731576107316118f4565b6020026020010181905250858061074790611938565b965050808061075590611938565b9150506106fc565b50505b8061076a81611938565b915050610640565b50909695505050505050565b6001600160a01b038216600090815260056020526040812042906001908101906107a89085611953565b600a81106107b8576107b86118f4565b0154119392505050565b60006107cd816110dd565b50600355565b6000828152602081905260409020600101546107ee816110dd565b6107f883836110e7565b505050565b6001600160a01b03811633146108725760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b61087c828261116b565b5050565b61088933610567565b6108ce5760405162461bcd60e51b81526020600482015260166024820152751059191c995cdcc81b9bdd08185d5d1a1bdc9a5e995960521b6044820152606401610869565b6001600160a01b0382166000908152600560205260408120600b0180548392906108f9908490611920565b90915550505050565b61090c33826111d0565b50565b6002818154811061091f57600080fd5b600091825260209091200154905081565b6001600160a01b0380821660009081526005602052604081208054600b820154600c830154600d84015492909516949093909261096d8783611072565b91505091939590929450565b6000610984816110dd565b506001600160a01b03166000908152600660205260409020805460ff19166001179055565b60006109b4816110dd565b50600155565b60006109c5816110dd565b506001600160a01b03166000908152600660205260409020805460ff19169055565b60008082116109f557600080fd5b600a821115610a0357600080fd5b60646002610a12600185611953565b81548110610a2257610a226118f4565b906000526020600020015484610a38919061196a565b610a429190611989565b9392505050565b6001600160a01b038116600090815260056020908152604091829020600d01805483518184028101840190945280845260609392830182828015610ab657602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610a98575b50505050509050919050565b6000336007546004805460405163079cc67960e41b81526001600160a01b0380861693820193909352602481019190915292935016906379cc679090604401600060405180830381600087803b158015610b1b57600080fd5b505af1158015610b2f573d6000803e3d6000fd5b505050506000610b3d611507565b905060005b600a811015610b8d576001600160a01b0383166000908152600560205260409020829060010182600a8110610b7957610b796118f4565b015580610b8581611938565b915050610b42565b506001600160a01b0382166000818152600560205260409020601801805460ff191660019081179091554291907ff94991dcbea6e8ac439cbc93bd9c62a4d39f04e0ad656df9a703f13552c2787f90610be890600a90611920565b6040519081526020015b60405180910390a35050565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b60008111610c675760405162461bcd60e51b815260206004820152600d60248201526c151bdbc81b1bddc81b195d995b609a1b6044820152606401610869565b600a811115610ca85760405162461bcd60e51b815260206004820152600d60248201526c151bdbc8189a59c81b195d995b609a1b6044820152606401610869565b60003360075460035460405163079cc67960e41b81526001600160a01b038085166004830152602482019290925292935016906379cc679090604401600060405180830381600087803b158015610cfe57600080fd5b505af1158015610d12573d6000803e3d6000fd5b50505050610d1e611507565b6001600160a01b0382166000908152600560205260409020600190810190610d469085611953565b600a8110610d5657610d566118f4565b01556001600160a01b03811660008181526005602052604090819020601801805460ff19166001179055514291907ff94991dcbea6e8ac439cbc93bd9c62a4d39f04e0ad656df9a703f13552c2787f90610bf29086815260200190565b6000610dbe816110dd565b50600780546001600160a01b0319166001600160a01b0392909216919091179055565b6000610dec816110dd565b50600455565b336000908152600560205260409020600c810154600b8201548391610e1691611953565b1015610e5a5760405162461bcd60e51b8152602060048201526013602482015272125b9cdd59999a58da595b9d08185b5bdd5b9d606a1b6044820152606401610869565b8181600c016000828254610e6e9190611920565b90915550506008546009546001600160a01b03918216916323b872dd9116336040516001600160e01b031960e085901b1681526001600160a01b03928316600482015291166024820152604481018590526064016020604051808303816000875af1158015610ee1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107f891906119ab565b600082815260208190526040902060010154610f20816110dd565b6107f8838361116b565b6000610f35816110dd565b50600980546001600160a01b0319166001600160a01b0392909216919091179055565b6000610f63816110dd565b60008311610f7057600080fd5b600a831115610f7e57600080fd5b816002610f8c600186611953565b81548110610f9c57610f9c6118f4565b600091825260209091200155505050565b6001600160a01b0382166000908152600560205260408120600e01610fd3600184611953565b600a8110610fe357610fe36118f4565b01549392505050565b6000610ff7816110dd565b50600880546001600160a01b0319166001600160a01b0392909216919091179055565b61102333610567565b6110685760405162461bcd60e51b81526020600482015260166024820152751059191c995cdcc81b9bdd08185d5d1a1bdc9a5e995960521b6044820152606401610869565b61087c82826111d0565b6001600160a01b038216600090815260056020526040812081805b61109885600a611953565b8110156110d45782600e0181600a81106110b4576110b46118f4565b01546110c09083611920565b9150806110cc81611938565b91505061108d565b50949350505050565b61090c8133611529565b6110f18282610bfe565b61087c576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556111273390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6111758282610bfe565b1561087c576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6001600160a01b03821661121d5760405162461bcd60e51b815260206004820152601460248201527355736572206973207a65726f206164647265737360601b6044820152606401610869565b6001600160a01b0381166112735760405162461bcd60e51b815260206004820152601860248201527f5265666572726572206973207a65726f206164647265737300000000000000006044820152606401610869565b816001600160a01b0316816001600160a01b031614156112d55760405162461bcd60e51b815260206004820152601860248201527f52656665727265722063616e206e6f74206265207573657200000000000000006044820152606401610869565b6001600160a01b03828116600090815260056020526040902054161561133d5760405162461bcd60e51b815260206004820152601d60248201527f526566657272657220697320616c7265616479207370656369666965640000006044820152606401610869565b61134881600161077e565b6113945760405162461bcd60e51b815260206004820152601c60248201527f526566657272657220686173206e6f20737562736372697074696f6e000000006044820152606401610869565b6001600160a01b03808316600081815260056020908152604080832080549587166001600160a01b0319968716811790915583528220600d01805460018101825590835290822001805490931690911790915581905b600a8110156114c157836001600160a01b0316826001600160a01b031614156114455760405162461bcd60e51b815260206004820152600d60248201526c4379636c696320636861696e2160981b6044820152606401610869565b6001600160a01b0382166000908152600560205260409020601881015460ff16156114a857600181600e0183600a8110611481576114816118f4565b0160008282546114919190611920565b909155505080546001600160a01b031692506114ae565b506114c1565b50806114b981611938565b9150506113ea565b50826001600160a01b0316826001600160a01b03167f3f6a300e641007b6c88b17485d36e2d83c20409a1c5e79bfa1f4eb69ea09469560405160405180910390a3505050565b60006001546201518061151a919061196a565b6115249042611920565b905090565b6115338282610bfe565b61087c5761154b816001600160a01b0316601461158d565b61155683602061158d565b6040516020016115679291906119fd565b60408051601f198184030181529082905262461bcd60e51b825261086991600401611a72565b6060600061159c83600261196a565b6115a7906002611920565b67ffffffffffffffff8111156115bf576115bf6118de565b6040519080825280601f01601f1916602001820160405280156115e9576020820181803683370190505b509050600360fc1b81600081518110611604576116046118f4565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110611633576116336118f4565b60200101906001600160f81b031916908160001a905350600061165784600261196a565b611662906001611920565b90505b60018111156116da576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110611696576116966118f4565b1a60f81b8282815181106116ac576116ac6118f4565b60200101906001600160f81b031916908160001a90535060049490941c936116d381611aa5565b9050611665565b508315610a425760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610869565b60006020828403121561173b57600080fd5b81356001600160e01b031981168114610a4257600080fd5b80356001600160a01b038116811461176a57600080fd5b919050565b6000806040838503121561178257600080fd5b61178b83611753565b946020939093013593505050565b602080825282518282018190526000919060409081850190868401855b828110156117e457815180516001600160a01b031685528601518685015292840192908501906001016117b6565b5091979650505050505050565b60006020828403121561180357600080fd5b5035919050565b6000806040838503121561181d57600080fd5b8235915061182d60208401611753565b90509250929050565b60006020828403121561184857600080fd5b610a4282611753565b6000806040838503121561186457600080fd5b50508035926020909101359150565b6020808252825182820181905260009190848201906040850190845b818110156107725783516001600160a01b03168352928401929184019160010161188f565b600080604083850312156118c757600080fd5b6118d083611753565b915061182d60208401611753565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600082198211156119335761193361190a565b500190565b600060001982141561194c5761194c61190a565b5060010190565b6000828210156119655761196561190a565b500390565b60008160001904831182151516156119845761198461190a565b500290565b6000826119a657634e487b7160e01b600052601260045260246000fd5b500490565b6000602082840312156119bd57600080fd5b81518015158114610a4257600080fd5b60005b838110156119e85781810151838201526020016119d0565b838111156119f7576000848401525b50505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351611a358160178501602088016119cd565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351611a668160288401602088016119cd565b01602801949350505050565b6020815260008251806020840152611a918160408501602087016119cd565b601f01601f19169190910160400192915050565b600081611ab457611ab461190a565b50600019019056fea2646970667358221220b6ace666bde6f7056cc362fa15a1f62ab2a5ac8c4f6f2f6a28adad0ac537a65e64736f6c634300080b0033";

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