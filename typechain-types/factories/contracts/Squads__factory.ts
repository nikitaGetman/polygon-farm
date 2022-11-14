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
        internalType: "struct Squads.SquadPlan[]",
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
    inputs: [
      {
        internalType: "uint256",
        name: "planId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserSquadInfo",
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
        internalType: "struct Squads.Squad",
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
    ],
    name: "getUserSquadsInfo",
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
        internalType: "struct Squads.Squad[]",
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
  "0x608060405261016d6001553480156200001757600080fd5b5060405162002013380380620020138339810160408190526200003a9162000184565b6001600160a01b0383166200004e57600080fd5b6001600160a01b0382166200006257600080fd5b6001600160a01b0381166200007657600080fd5b62000083600033620000c6565b600580546001600160a01b039485166001600160a01b031991821617909155600680549385169382169390931790925560078054919093169116179055620001ce565b6000828152602081815260408083206001600160a01b038516845290915290205460ff1662000163576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055620001223390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b80516001600160a01b03811681146200017f57600080fd5b919050565b6000806000606084860312156200019a57600080fd5b620001a58462000167565b9250620001b56020850162000167565b9150620001c56040850162000167565b90509250925092565b611e3580620001de6000396000f3fe608060405234801561001057600080fd5b50600436106101f05760003560e01c806388da0f131161010f578063b1620616116100a2578063d94a862b11610071578063d94a862b146104bb578063d966edf0146104d0578063ee99205c146104e3578063fcc47512146104f657600080fd5b8063b162061614610440578063ca7c101314610482578063d547741f14610495578063d6672e1c146104a857600080fd5b8063a243d5ac116100de578063a243d5ac146103f1578063aaa138a214610404578063ad0839281461040d578063afea5d551461042d57600080fd5b806388da0f13146103b057806391d14854146103c3578063992dc2da146103d6578063a217fddf146103e957600080fd5b80632fe00f571161018757806342ec14d71161015657806342ec14d714610333578063622f46a4146103465780636445c67914610366578063736560b51461039d57600080fd5b80632fe00f57146102e75780633347e4d6146102fa57806336568abe1461030d5780633fe905371461032057600080fd5b80631e6f30cb116101c35780631e6f30cb14610266578063248a9ca3146102865780632ccd9623146102a95780632f2ff15d146102d457600080fd5b806301ffc9a7146101f55780630f574ba71461021d57806316867cd8146102325780631c0e061214610253575b600080fd5b610208610203366004611826565b610509565b60405190151581526020015b60405180910390f35b61023061022b366004611850565b610540565b005b610245610240366004611850565b610730565b604051908152602001610214565b610230610261366004611877565b610789565b6102796102743660046118c3565b610811565b60405161021491906118ef565b610245610294366004611850565b60009081526020819052604090206001015490565b6006546102bc906001600160a01b031681565b6040516001600160a01b039091168152602001610214565b6102306102e23660046118c3565b61085d565b6102306102f5366004611906565b610887565b610230610308366004611928565b6108c0565b61023061031b3660046118c3565b6108ee565b61023061032e366004611906565b61096c565b610230610341366004611928565b6109a1565b610359610354366004611928565b6109cf565b6040516102149190611943565b61020861037436600461199a565b60009081526003602090815260408083206001600160a01b039490941683529290522054421090565b6102306103ab366004611850565b610a7f565b6102306103be3660046119c4565b610a90565b6102086103d13660046118c3565b610c38565b6102086103e436600461199a565b610c61565b610245600081565b6102306103ff366004611928565b610dc9565b61024560015481565b61042061041b36600461199a565b610df7565b60405161021491906119ff565b61020861043b366004611a4c565b610e75565b61045361044e366004611850565b611202565b6040805196875260208701959095529385019290925260608401526080830152151560a082015260c001610214565b610230610490366004611906565b61124b565b6102306104a33660046118c3565b611284565b6005546102bc906001600160a01b031681565b6104c36112a9565b6040516102149190611a90565b6102306104de366004611906565b611343565b6007546102bc906001600160a01b031681565b610230610504366004611906565b61137c565b60006001600160e01b03198216637965db0b60e01b148061053a57506301ffc9a760e01b6001600160e01b03198316145b92915050565b600254811061058a5760405162461bcd60e51b8152602060048201526011602482015270125b98dbdc9c9958dd081c1b185b881a59607a1b60448201526064015b60405180910390fd5b60003390506000600283815481106105a4576105a4611afd565b60009182526020909120600690910201600581015490915060ff166106005760405162461bcd60e51b8152602060048201526012602482015271506c616e206973206e6f742061637469766560701b6044820152606401610581565b600554815460405163079cc67960e41b81526001600160a01b03858116600483015260248201929092529116906379cc679090604401600060405180830381600087803b15801561065057600080fd5b505af1158015610664573d6000803e3d6000fd5b5060009250610671915050565b60405190808252806020026020018201604052801561069a578160200160208202803683370190505b5060008481526004602090815260408083206001600160a01b0387168452825290912082516106cf93919291909101906117ac565b506106d86113b5565b60008481526003602090815260408083206001600160a01b03871680855292528083209390935591514292869290917ff94991dcbea6e8ac439cbc93bd9c62a4d39f04e0ad656df9a703f13552c2787f9190a4505050565b6000600019815b600254811015610782576002818154811061075457610754611afd565b9060005260206000209060060201600201548410610770578091505b8061077a81611b3f565b915050610737565b5092915050565b6000610794816113d7565b81600284815481106107a8576107a8611afd565b906000526020600020906006020160050160006101000a81548160ff021916908315150217905550827f6da7bc8b01ce6d2ed854278dbb7c80b2cae78c297ec593d38c15b3d4445985a883604051610804911515815260200190565b60405180910390a2505050565b60408051808201825260008082526020918201819052938452600381528184206001600160a01b0393909316845291825291829020825180840190935280548352600101549082015290565b600082815260208190526040902060010154610878816113d7565b61088283836113e4565b505050565b6000610892816113d7565b81600284815481106108a6576108a6611afd565b906000526020600020906006020160010181905550505050565b60006108cb816113d7565b50600780546001600160a01b0319166001600160a01b0392909216919091179055565b6001600160a01b038116331461095e5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610581565b6109688282611468565b5050565b6000610977816113d7565b816002848154811061098b5761098b611afd565b6000918252602090912060069091020155505050565b60006109ac816113d7565b50600680546001600160a01b0319166001600160a01b0392909216919091179055565b60025460609060009067ffffffffffffffff8111156109f0576109f0611b13565b604051908082528060200260200182016040528015610a3557816020015b6040805180820190915260008082526020820152815260200190600190039081610a0e5790505b50905060005b60025481101561078257610a4f8185610811565b828281518110610a6157610a61611afd565b60200260200101819052508080610a7790611b3f565b915050610a3b565b6000610a8a816113d7565b50600155565b6000610a9b816113d7565b6040805160c081018252878152602081018781529181018681526060820186815260808301868152600160a08501818152600280548084018255600082905287517f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace60069092029182015597517f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5acf89015594517f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ad088015592517f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ad187015590517f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ad286015590517f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ad3909401805460ff191694151594909417909355549091610be091611b5a565b604080518981526020810189905290810187905260608101869052608081018590527f3beeb65995b90bd0914666101e05dd847e837c47b2f0d4da8882c34ea27c91309060a00160405180910390a250505050505050565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b6007546002805460009283926001600160a01b03909116916314ce783d919086908110610c9057610c90611afd565b906000526020600020906006020160040154866040518363ffffffff1660e01b8152600401610cd29291909182526001600160a01b0316602082015260400190565b600060405180830381865afa158015610cef573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610d179190810190611bcb565b905060005b8151811015610dbe5742828281518110610d3857610d38611afd565b602002602001015160400151118015610d6c5750818181518110610d5e57610d5e611afd565b602002602001015160c00151155b8015610d9c575083610d9a838381518110610d8957610d89611afd565b602002602001015160000151610730565b145b15610dac5760019250505061053a565b80610db681611b3f565b915050610d1c565b506000949350505050565b6000610dd4816113d7565b50600580546001600160a01b0319166001600160a01b0392909216919091179055565b60008181526004602090815260408083206001600160a01b0386168452825291829020805483518184028101840190945280845260609392830182828015610e6857602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610e4a575b5050505050905092915050565b60006001600160a01b038416610ecd5760405162461bcd60e51b815260206004820152601860248201527f5265666572726572206973207a65726f206164647265737300000000000000006044820152606401610581565b6001600160a01b038316610f1c5760405162461bcd60e51b81526020600482015260166024820152754d656d626572206973207a65726f206164647265737360501b6044820152606401610581565b6000610f2783610730565b90506000811215610f3757600080fd5b60008190508660028281548110610f5057610f50611afd565b90600052602060002090600602016004015414610faf5760405162461bcd60e51b815260206004820152601960248201527f5374616b696e6720706c616e20646f206e6f74206d61746368000000000000006044820152606401610581565b6007546001600160a01b031633148015610fea575060008181526003602090815260408083206001600160a01b038a16845290915290205442105b8015610ffb5750610ffb8682610c61565b801561100f575061100d8682876114cd565b155b156111f35760008181526004602090815260408083206001600160a01b038a811680865291845282852080546001810182558187528587200180546001600160a01b031916928c169283179055948290529354825194855292840183905291928492917f4727d8bf558b6f2fd2d2f66e2062e0c408a4b470870a0385e940358a87ad3626910160405180910390a3600282815481106110b0576110b0611afd565b90600052602060002090600602016003015481106111e75760008281526003602090815260408083206001600160a01b038b16845290915281206001808201805492939192909190611103908490611cd9565b909155505060008155600654600280546001600160a01b0390921691633fb55c61918b918790811061113757611137611afd565b60009182526020909120600160069092020101546040516001600160e01b031960e085901b1681526001600160a01b0390921660048301526024820152604401600060405180830381600087803b15801561119157600080fd5b505af11580156111a5573d6000803e3d6000fd5b50505050806001015483896001600160a01b03167fc22bc73345a19ca25692353736ee8587e0e2d12c75a1ed016950ed4b20fac30160405160405180910390a4505b600193505050506111fa565b6000925050505b949350505050565b6002818154811061121257600080fd5b60009182526020909120600690910201805460018201546002830154600384015460048501546005909501549395509193909260ff1686565b6000611256816113d7565b816002848154811061126a5761126a611afd565b906000526020600020906006020160040181905550505050565b60008281526020819052604090206001015461129f816113d7565b6108828383611468565b60606002805480602002602001604051908101604052809291908181526020016000905b8282101561133a5760008481526020908190206040805160c08101825260068602909201805483526001808201548486015260028201549284019290925260038101546060840152600481015460808401526005015460ff16151560a083015290835290920191016112cd565b50505050905090565b600061134e816113d7565b816002848154811061136257611362611afd565b906000526020600020906006020160020181905550505050565b6000611387816113d7565b816002848154811061139b5761139b611afd565b906000526020600020906006020160030181905550505050565b6000600154620151806113c89190611cf1565b6113d29042611cd9565b905090565b6113e181336115ac565b50565b6113ee8282610c38565b610968576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556114243390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6114728282610c38565b15610968576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b60008281526004602090815260408083206001600160a01b038716845282528083208054825181850281018501909352808352849383018282801561153b57602002820191906000526020600020905b81546001600160a01b0316815260019091019060200180831161151d575b5050505050905060005b815181101561159e57836001600160a01b031682828151811061156a5761156a611afd565b60200260200101516001600160a01b0316141561158c576001925050506115a5565b8061159681611b3f565b915050611545565b5060009150505b9392505050565b6115b68282610c38565b610968576115ce816001600160a01b03166014611610565b6115d9836020611610565b6040516020016115ea929190611d40565b60408051601f198184030181529082905262461bcd60e51b825261058191600401611db5565b6060600061161f836002611cf1565b61162a906002611cd9565b67ffffffffffffffff81111561164257611642611b13565b6040519080825280601f01601f19166020018201604052801561166c576020820181803683370190505b509050600360fc1b8160008151811061168757611687611afd565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106116b6576116b6611afd565b60200101906001600160f81b031916908160001a90535060006116da846002611cf1565b6116e5906001611cd9565b90505b600181111561175d576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061171957611719611afd565b1a60f81b82828151811061172f5761172f611afd565b60200101906001600160f81b031916908160001a90535060049490941c9361175681611de8565b90506116e8565b5083156115a55760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610581565b828054828255906000526020600020908101928215611801579160200282015b8281111561180157825182546001600160a01b0319166001600160a01b039091161782556020909201916001909101906117cc565b5061180d929150611811565b5090565b5b8082111561180d5760008155600101611812565b60006020828403121561183857600080fd5b81356001600160e01b0319811681146115a557600080fd5b60006020828403121561186257600080fd5b5035919050565b80151581146113e157600080fd5b6000806040838503121561188a57600080fd5b82359150602083013561189c81611869565b809150509250929050565b80356001600160a01b03811681146118be57600080fd5b919050565b600080604083850312156118d657600080fd5b823591506118e6602084016118a7565b90509250929050565b81518152602080830151908201526040810161053a565b6000806040838503121561191957600080fd5b50508035926020909101359150565b60006020828403121561193a57600080fd5b6115a5826118a7565b602080825282518282018190526000919060409081850190868401855b8281101561198d5761197d84835180518252602090810151910152565b9284019290850190600101611960565b5091979650505050505050565b600080604083850312156119ad57600080fd5b6119b6836118a7565b946020939093013593505050565b600080600080600060a086880312156119dc57600080fd5b505083359560208501359550604085013594606081013594506080013592509050565b6020808252825182820181905260009190848201906040850190845b81811015611a405783516001600160a01b031683529284019291840191600101611a1b565b50909695505050505050565b60008060008060808587031215611a6257600080fd5b84359350611a72602086016118a7565b9250611a80604086016118a7565b9396929550929360600135925050565b602080825282518282018190526000919060409081850190868401855b8281101561198d5781518051855286810151878601528581015186860152606080820151908601526080808201519086015260a09081015115159085015260c09093019290850190600101611aad565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000600019821415611b5357611b53611b29565b5060010190565b600082821015611b6c57611b6c611b29565b500390565b60405160e0810167ffffffffffffffff81118282101715611b9457611b94611b13565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715611bc357611bc3611b13565b604052919050565b60006020808385031215611bde57600080fd5b825167ffffffffffffffff80821115611bf657600080fd5b818501915085601f830112611c0a57600080fd5b815181811115611c1c57611c1c611b13565b611c2a848260051b01611b9a565b818152848101925060e0918202840185019188831115611c4957600080fd5b938501935b82851015611ccd5780858a031215611c665760008081fd5b611c6e611b71565b85518152868601518782015260408087015190820152606080870151908201526080808701519082015260a080870151611ca781611869565b9082015260c086810151611cba81611869565b9082015284529384019392850192611c4e565b50979650505050505050565b60008219821115611cec57611cec611b29565b500190565b6000816000190483118215151615611d0b57611d0b611b29565b500290565b60005b83811015611d2b578181015183820152602001611d13565b83811115611d3a576000848401525b50505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351611d78816017850160208801611d10565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351611da9816028840160208801611d10565b01602801949350505050565b6020815260008251806020840152611dd4816040850160208701611d10565b601f01601f19169190910160400192915050565b600081611df757611df7611b29565b50600019019056fea2646970667358221220048bf8c3cefbc97259206d9fe904c9a1f80be4e1fc6aaa0cef4dc2847c2fe43864736f6c634300080b0033";

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
