/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { Squads, SquadsInterface } from "../../contracts/Squads";

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
        name: "referralManager_",
        type: "address",
      },
      {
        internalType: "address",
        name: "stakingContract_",
        type: "address",
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
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "planId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "member",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "squadMembers",
        type: "uint256",
      },
    ],
    name: "MemberAdded",
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
        internalType: "uint256",
        name: "planId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
    ],
    name: "SquadActivityChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "planId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "squadCount",
        type: "uint256",
      },
    ],
    name: "SquadFilled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "planId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "subscriptionCost",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stakingThreshold",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "squadSize",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stakingPlanId",
        type: "uint256",
      },
    ],
    name: "SquadPlanCreated",
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
        indexed: true,
        internalType: "uint256",
        name: "planId",
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
        internalType: "uint256",
        name: "subscriptionCost_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "reward_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stakingThreshold_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "squadSize_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stakingPlanId_",
        type: "uint256",
      },
    ],
    name: "addPlan",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "plans",
    outputs: [
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
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "referralManager",
    outputs: [
      {
        internalType: "contract IReferralManager",
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
    name: "stakingContract",
    outputs: [
      {
        internalType: "contract IStaking",
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
        name: "stakingPlanId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "referrer",
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
        internalType: "uint256",
        name: "planId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
    ],
    name: "updatePlanActivity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "planId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
    ],
    name: "updatePlanReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "planId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
    ],
    name: "updatePlanSquadSize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "planId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stakingPlanId",
        type: "uint256",
      },
    ],
    name: "updatePlanStakingId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "planId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "threshold",
        type: "uint256",
      },
    ],
    name: "updatePlanStakingThreshold",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "planId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "subscriptionCost",
        type: "uint256",
      },
    ],
    name: "updatePlanSubscriptionCost",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "stakingContract_",
        type: "address",
      },
    ],
    name: "updateStakingContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "numDays",
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
        name: "referralManager_",
        type: "address",
      },
    ],
    name: "updateSubscriptionReferralManager",
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

const _bytecode =
  "0x608060405261016d6001553480156200001757600080fd5b5060405162002068380380620020688339810160408190526200003a9162000184565b6001600160a01b0383166200004e57600080fd5b6001600160a01b0382166200006257600080fd5b6001600160a01b0381166200007657600080fd5b62000083600033620000c6565b600580546001600160a01b039485166001600160a01b031991821617909155600680549385169382169390931790925560078054919093169116179055620001ce565b6000828152602081815260408083206001600160a01b038516845290915290205460ff1662000163576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055620001223390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b80516001600160a01b03811681146200017f57600080fd5b919050565b6000806000606084860312156200019a57600080fd5b620001a58462000167565b9250620001b56020850162000167565b9150620001c56040850162000167565b90509250925092565b611e8a80620001de6000396000f3fe608060405234801561001057600080fd5b50600436106101fb5760003560e01c806388da0f131161011a578063b1620616116100ad578063d6672e1c1161007c578063d6672e1c14610514578063d94a862b14610527578063d966edf01461053c578063ee99205c1461054f578063fcc475121461056257600080fd5b8063b162061614610431578063ca7c101314610473578063cc5d19c114610486578063d547741f1461050157600080fd5b8063a243d5ac116100e9578063a243d5ac146103e2578063aaa138a2146103f5578063ad083928146103fe578063afea5d551461041e57600080fd5b806388da0f13146103a157806391d14854146103b4578063992dc2da146103c7578063a217fddf146103da57600080fd5b80632f2ff15d116101925780633fe90537116101615780633fe905371461033157806342ec14d7146103445780636445c67914610357578063736560b51461038e57600080fd5b80632f2ff15d146102e55780632fe00f57146102f85780633347e4d61461030b57806336568abe1461031e57600080fd5b80631c0e0612116101ce5780631c0e061214610264578063248a9ca31461027757806326cd52741461029a5780632ccd9623146102ba57600080fd5b806301ffc9a7146102005780630f574ba71461022857806316867cd81461023d578063188ec3561461025e575b600080fd5b61021361020e366004611898565b610575565b60405190151581526020015b60405180910390f35b61023b6102363660046118c2565b6105ac565b005b61025061024b3660046118c2565b610807565b60405190815260200161021f565b42610250565b61023b6102723660046118e9565b610860565b6102506102853660046118c2565b60009081526020819052604090206001015490565b6102ad6102a83660046118c2565b6108e8565b60405161021f9190611919565b6006546102cd906001600160a01b031681565b6040516001600160a01b03909116815260200161021f565b61023b6102f336600461197a565b610996565b61023b6103063660046119a6565b6109c0565b61023b6103193660046119c8565b6109f9565b61023b61032c36600461197a565b610a27565b61023b61033f3660046119a6565b610aa5565b61023b6103523660046119c8565b610ada565b6102136103653660046119e3565b60009081526003602090815260408083206001600160a01b039490941683529290522054421090565b61023b61039c3660046118c2565b610b08565b61023b6103af366004611a0d565b610b19565b6102136103c236600461197a565b610cc1565b6102136103d53660046119e3565b610cea565b610250600081565b61023b6103f03660046119c8565b610e6e565b61025060015481565b61041161040c3660046119e3565b610e9c565b60405161021f9190611a48565b61021361042c366004611a95565b610f1a565b61044461043f3660046118c2565b611296565b6040805196875260208701959095529385019290925260608401526080830152151560a082015260c00161021f565b61023b6104813660046119a6565b6112df565b6104e66104943660046119e3565b60408051808201909152600080825260208201525060008181526003602090815260408083206001600160a01b0386168452825291829020825180840190935280548352600101549082015292915050565b6040805182518152602092830151928101929092520161021f565b61023b61050f36600461197a565b611318565b6005546102cd906001600160a01b031681565b61052f61133d565b60405161021f9190611ad9565b61023b61054a3660046119a6565b6113d7565b6007546102cd906001600160a01b031681565b61023b6105703660046119a6565b611410565b60006001600160e01b03198216637965db0b60e01b14806105a657506301ffc9a760e01b6001600160e01b03198316145b92915050565b60025481106105f65760405162461bcd60e51b8152602060048201526011602482015270125b98dbdc9c9958dd081c1b185b881a59607a1b60448201526064015b60405180910390fd5b600033905060006002838154811061061057610610611b52565b60009182526020909120600690910201600581015490915060ff1661066c5760405162461bcd60e51b8152602060048201526012602482015271506c616e206973206e6f742061637469766560701b60448201526064016105ed565b600554815460405163079cc67960e41b81526001600160a01b03858116600483015260248201929092529116906379cc679090604401600060405180830381600087803b1580156106bc57600080fd5b505af11580156106d0573d6000803e3d6000fd5b50600092506106dd915050565b604051908082528060200260200182016040528015610706578160200160208202803683370190505b5060008481526004602090815260408083206001600160a01b03871684528252909120825161073b939192919091019061181e565b5060004260008581526003602090815260408083206001600160a01b03881684529091529020541061078f5760008481526003602090815260408083206001600160a01b0387168452909152902054610791565b425b9050600154620151806107a49190611b94565b6107ae9082611bb3565b60008581526003602090815260408083206001600160a01b03881680855292528083209390935591518392879290917ff94991dcbea6e8ac439cbc93bd9c62a4d39f04e0ad656df9a703f13552c2787f9190a450505050565b6000600019815b600254811015610859576002818154811061082b5761082b611b52565b9060005260206000209060060201600201548410610847578091505b8061085181611bcb565b91505061080e565b5092915050565b600061086b81611449565b816002848154811061087f5761087f611b52565b906000526020600020906006020160050160006101000a81548160ff021916908315150217905550827f6da7bc8b01ce6d2ed854278dbb7c80b2cae78c297ec593d38c15b3d4445985a8836040516108db911515815260200190565b60405180910390a2505050565b6109236040518060c0016040528060008152602001600081526020016000815260200160008152602001600081526020016000151581525090565b6002828154811061093657610936611b52565b60009182526020918290206040805160c081018252600690930290910180548352600181015493830193909352600283015490820152600382015460608201526004820154608082015260059091015460ff16151560a082015292915050565b6000828152602081905260409020600101546109b181611449565b6109bb8383611456565b505050565b60006109cb81611449565b81600284815481106109df576109df611b52565b906000526020600020906006020160010181905550505050565b6000610a0481611449565b50600780546001600160a01b0319166001600160a01b0392909216919091179055565b6001600160a01b0381163314610a975760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084016105ed565b610aa182826114da565b5050565b6000610ab081611449565b8160028481548110610ac457610ac4611b52565b6000918252602090912060069091020155505050565b6000610ae581611449565b50600680546001600160a01b0319166001600160a01b0392909216919091179055565b6000610b1381611449565b50600155565b6000610b2481611449565b6040805160c081018252878152602081018781529181018681526060820186815260808301868152600160a08501818152600280548084018255600082905287517f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace60069092029182015597517f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5acf89015594517f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ad088015592517f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ad187015590517f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ad286015590517f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ad3909401805460ff191694151594909417909355549091610c6991611be6565b604080518981526020810189905290810187905260608101869052608081018590527f3beeb65995b90bd0914666101e05dd847e837c47b2f0d4da8882c34ea27c91309060a00160405180910390a250505050505050565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b6007546002805460009283926001600160a01b03909116916314ce783d919086908110610d1957610d19611b52565b906000526020600020906006020160040154866040518363ffffffff1660e01b8152600401610d5b9291909182526001600160a01b0316602082015260400190565b600060405180830381865afa158015610d78573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610da09190810190611c57565b80519091505b8015610e63574282610db9600184611be6565b81518110610dc957610dc9611b52565b602002602001015160400151118015610e07575081610de9600183611be6565b81518110610df957610df9611b52565b602002602001015160c00151155b8015610e41575083610e3f83610e1e600185611be6565b81518110610e2e57610e2e611b52565b602002602001015160000151610807565b145b15610e51576001925050506105a6565b80610e5b81611d65565b915050610da6565b506000949350505050565b6000610e7981611449565b50600580546001600160a01b0319166001600160a01b0392909216919091179055565b60008181526004602090815260408083206001600160a01b0386168452825291829020805483518184028101840190945280845260609392830182828015610f0d57602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610eef575b5050505050905092915050565b60006001600160a01b0384161580610f3957506001600160a01b038316155b15610f465750600061128e565b6000610f5183610807565b90506000811215610f6657600091505061128e565b60008190508660028281548110610f7f57610f7f611b52565b90600052602060002090600602016004015414610fa15760009250505061128e565b6007546001600160a01b031633148015610fdc575060008181526003602090815260408083206001600160a01b038a16845290915290205442105b8015610fed5750610fed8682610cea565b80156110015750610fff86828761153f565b155b156112875760008181526004602090815260408083206001600160a01b038a811680865291845282852080546001810182558187528587200180546001600160a01b031916928c169283179055948290529354825194855292840183905291928492917f4727d8bf558b6f2fd2d2f66e2062e0c408a4b470870a0385e940358a87ad3626910160405180910390a3600282815481106110a2576110a2611b52565b906000526020600020906006020160030154811061127b5760008281526003602090815260408083206001600160a01b038b168452909152812060018082018054929391929091906110f5908490611bb3565b9091555050600081556006546040805160e081019091526001600160a01b038a81168252600280549190931692639581f52792916020830191908890811061113f5761113f611b52565b9060005260206000209060060201600101548152602001306001600160a01b03168152602001600181526020016002878154811061117f5761117f611b52565b600091825260208083206002600690930201919091015483528281018f905260409283019190915281516001600160e01b031960e086901b16815283516001600160a01b03908116600483015291840151602482015291830151166044820152606082015160648201526080820151608482015260a082015160a482015260c09091015160c482015260e401600060405180830381600087803b15801561122557600080fd5b505af1158015611239573d6000803e3d6000fd5b50505050806001015483896001600160a01b03167fc22bc73345a19ca25692353736ee8587e0e2d12c75a1ed016950ed4b20fac30160405160405180910390a4505b6001935050505061128e565b6000925050505b949350505050565b600281815481106112a657600080fd5b60009182526020909120600690910201805460018201546002830154600384015460048501546005909501549395509193909260ff1686565b60006112ea81611449565b81600284815481106112fe576112fe611b52565b906000526020600020906006020160040181905550505050565b60008281526020819052604090206001015461133381611449565b6109bb83836114da565b60606002805480602002602001604051908101604052809291908181526020016000905b828210156113ce5760008481526020908190206040805160c08101825260068602909201805483526001808201548486015260028201549284019290925260038101546060840152600481015460808401526005015460ff16151560a08301529083529092019101611361565b50505050905090565b60006113e281611449565b81600284815481106113f6576113f6611b52565b906000526020600020906006020160020181905550505050565b600061141b81611449565b816002848154811061142f5761142f611b52565b906000526020600020906006020160030181905550505050565b611453813361161e565b50565b6114608282610cc1565b610aa1576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556114963390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6114e48282610cc1565b15610aa1576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b60008281526004602090815260408083206001600160a01b03871684528252808320805482518185028101850190935280835284938301828280156115ad57602002820191906000526020600020905b81546001600160a01b0316815260019091019060200180831161158f575b5050505050905060005b815181101561161057836001600160a01b03168282815181106115dc576115dc611b52565b60200260200101516001600160a01b031614156115fe57600192505050611617565b8061160881611bcb565b9150506115b7565b5060009150505b9392505050565b6116288282610cc1565b610aa157611640816001600160a01b03166014611682565b61164b836020611682565b60405160200161165c929190611dac565b60408051601f198184030181529082905262461bcd60e51b82526105ed91600401611e21565b60606000611691836002611b94565b61169c906002611bb3565b67ffffffffffffffff8111156116b4576116b4611b68565b6040519080825280601f01601f1916602001820160405280156116de576020820181803683370190505b509050600360fc1b816000815181106116f9576116f9611b52565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061172857611728611b52565b60200101906001600160f81b031916908160001a905350600061174c846002611b94565b611757906001611bb3565b90505b60018111156117cf576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061178b5761178b611b52565b1a60f81b8282815181106117a1576117a1611b52565b60200101906001600160f81b031916908160001a90535060049490941c936117c881611d65565b905061175a565b5083156116175760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016105ed565b828054828255906000526020600020908101928215611873579160200282015b8281111561187357825182546001600160a01b0319166001600160a01b0390911617825560209092019160019091019061183e565b5061187f929150611883565b5090565b5b8082111561187f5760008155600101611884565b6000602082840312156118aa57600080fd5b81356001600160e01b03198116811461161757600080fd5b6000602082840312156118d457600080fd5b5035919050565b801515811461145357600080fd5b600080604083850312156118fc57600080fd5b82359150602083013561190e816118db565b809150509250929050565b60c081016105a68284805182526020810151602083015260408101516040830152606081015160608301526080810151608083015260a0810151151560a08301525050565b80356001600160a01b038116811461197557600080fd5b919050565b6000806040838503121561198d57600080fd5b8235915061199d6020840161195e565b90509250929050565b600080604083850312156119b957600080fd5b50508035926020909101359150565b6000602082840312156119da57600080fd5b6116178261195e565b600080604083850312156119f657600080fd5b6119ff8361195e565b946020939093013593505050565b600080600080600060a08688031215611a2557600080fd5b505083359560208501359550604085013594606081013594506080013592509050565b6020808252825182820181905260009190848201906040850190845b81811015611a895783516001600160a01b031683529284019291840191600101611a64565b50909695505050505050565b60008060008060808587031215611aab57600080fd5b84359350611abb6020860161195e565b9250611ac96040860161195e565b9396929550929360600135925050565b6020808252825182820181905260009190848201906040850190845b81811015611a8957611b3f838551805182526020810151602083015260408101516040830152606081015160608301526080810151608083015260a0810151151560a08301525050565b9284019260c09290920191600101611af5565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000816000190483118215151615611bae57611bae611b7e565b500290565b60008219821115611bc657611bc6611b7e565b500190565b6000600019821415611bdf57611bdf611b7e565b5060010190565b600082821015611bf857611bf8611b7e565b500390565b60405160e0810167ffffffffffffffff81118282101715611c2057611c20611b68565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715611c4f57611c4f611b68565b604052919050565b60006020808385031215611c6a57600080fd5b825167ffffffffffffffff80821115611c8257600080fd5b818501915085601f830112611c9657600080fd5b815181811115611ca857611ca8611b68565b611cb6848260051b01611c26565b818152848101925060e0918202840185019188831115611cd557600080fd5b938501935b82851015611d595780858a031215611cf25760008081fd5b611cfa611bfd565b85518152868601518782015260408087015190820152606080870151908201526080808701519082015260a080870151611d33816118db565b9082015260c086810151611d46816118db565b9082015284529384019392850192611cda565b50979650505050505050565b600081611d7457611d74611b7e565b506000190190565b60005b83811015611d97578181015183820152602001611d7f565b83811115611da6576000848401525b50505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351611de4816017850160208801611d7c565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351611e15816028840160208801611d7c565b01602801949350505050565b6020815260008251806020840152611e40816040850160208701611d7c565b601f01601f1916919091016040019291505056fea2646970667358221220f574f1fba48e2651a41cb04f63df314358d49fee5c49a2bae5bd4352907f40ba64736f6c634300080b0033";

type SquadsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SquadsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Squads__factory extends ContractFactory {
  constructor(...args: SquadsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    subscriptionToken_: PromiseOrValue<string>,
    referralManager_: PromiseOrValue<string>,
    stakingContract_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Squads> {
    return super.deploy(
      subscriptionToken_,
      referralManager_,
      stakingContract_,
      overrides || {}
    ) as Promise<Squads>;
  }
  override getDeployTransaction(
    subscriptionToken_: PromiseOrValue<string>,
    referralManager_: PromiseOrValue<string>,
    stakingContract_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      subscriptionToken_,
      referralManager_,
      stakingContract_,
      overrides || {}
    );
  }
  override attach(address: string): Squads {
    return super.attach(address) as Squads;
  }
  override connect(signer: Signer): Squads__factory {
    return super.connect(signer) as Squads__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SquadsInterface {
    return new utils.Interface(_abi) as SquadsInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Squads {
    return new Contract(address, _abi, signerOrProvider) as Squads;
  }
}
