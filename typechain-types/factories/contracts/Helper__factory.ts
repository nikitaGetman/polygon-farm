/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { Helper, HelperInterface } from "../../contracts/Helper";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_token1",
        type: "address",
      },
      {
        internalType: "address",
        name: "_token2",
        type: "address",
      },
      {
        internalType: "address",
        name: "_staking",
        type: "address",
      },
      {
        internalType: "address",
        name: "_referralManager",
        type: "address",
      },
      {
        internalType: "address",
        name: "_squads",
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
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
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
    name: "getUserReferralsFullInfoByLevel",
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
            internalType: "uint256",
            name: "token1Balance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "token2Balance",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isReferralSubscriptionActive",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isStakingSubscriptionActive",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isSquadSubscriptionActive",
            type: "bool",
          },
        ],
        internalType: "struct Helper.ReferralFullInfo[]",
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
            name: "squadStatus",
            type: "tuple",
          },
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
            name: "plan",
            type: "tuple",
          },
          {
            internalType: "address[]",
            name: "members",
            type: "address[]",
          },
          {
            internalType: "bool",
            name: "userHasSufficientStaking",
            type: "bool",
          },
        ],
        internalType: "struct Helper.UserSquadInfo",
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
    name: "getUserSquadsInfo",
    outputs: [
      {
        components: [
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
            name: "squadStatus",
            type: "tuple",
          },
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
            name: "plan",
            type: "tuple",
          },
          {
            internalType: "address[]",
            name: "members",
            type: "address[]",
          },
          {
            internalType: "bool",
            name: "userHasSufficientStaking",
            type: "bool",
          },
        ],
        internalType: "struct Helper.UserSquadInfo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "squads",
    outputs: [
      {
        internalType: "contract ISquads",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "staking",
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
    inputs: [],
    name: "token1",
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
    inputs: [],
    name: "token2",
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
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_referralManager",
        type: "address",
      },
    ],
    name: "updateReferralManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_squads",
        type: "address",
      },
    ],
    name: "updateSquads",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_staking",
        type: "address",
      },
    ],
    name: "updateStaking",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token1",
        type: "address",
      },
    ],
    name: "updateToken1",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token2",
        type: "address",
      },
    ],
    name: "updateToken2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200144e3803806200144e83398101604081905262000034916200010f565b6200003f33620000a2565b600180546001600160a01b03199081166001600160a01b039788161790915560028054821695871695909517909455600380548516938616939093179092556004805484169185169190911790556005805490921692169190911790556200017f565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80516001600160a01b03811681146200010a57600080fd5b919050565b600080600080600060a086880312156200012857600080fd5b6200013386620000f2565b94506200014360208701620000f2565b93506200015360408701620000f2565b92506200016360608701620000f2565b91506200017360808701620000f2565b90509295509295909350565b6112bf806200018f6000396000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c806378fd900011610097578063ae1fc32411610066578063ae1fc32414610219578063cefaefb61461022c578063d21220a71461024c578063f2fde38b1461025f57600080fd5b806378fd9000146101cf5780637c67b339146101e25780638da5cb5b146101f5578063a345f38d1461020657600080fd5b80632ccd9623116100d35780632ccd9623146101815780634cf088d914610194578063622f46a4146101a7578063715018a6146101c757600080fd5b8063064e6780146101055780631e6f30cb1461011a578063232b9d901461014357806325be124e14610156575b600080fd5b610118610113366004610c1d565b610272565b005b61012d610128366004610c41565b61029c565b60405161013a9190610d3b565b60405180910390f35b610118610151366004610c1d565b6104b1565b600254610169906001600160a01b031681565b6040516001600160a01b03909116815260200161013a565b600454610169906001600160a01b031681565b600354610169906001600160a01b031681565b6101ba6101b5366004610c1d565b6104db565b60405161013a9190610d4e565b610118610601565b600554610169906001600160a01b031681565b6101186101f0366004610c1d565b610615565b6000546001600160a01b0316610169565b610118610214366004610c1d565b61063f565b610118610227366004610c1d565b610669565b61023f61023a366004610db0565b610693565b60405161013a9190610ddc565b600154610169906001600160a01b031681565b61011861026d366004610c1d565b610a6e565b61027a610aec565b600180546001600160a01b0319166001600160a01b0392909216919091179055565b6102a4610b96565b60055460405163cc5d19c160e01b81526001600160a01b03848116600483015260248201869052600092169063cc5d19c1906044016040805180830381865afa1580156102f5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103199190610ee8565b6005546040516309b3549d60e21b8152600481018790529192506000916001600160a01b03909116906326cd52749060240160c060405180830381865afa158015610368573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061038c9190610fcd565b6005546040516315a1072560e31b81526001600160a01b038781166004830152602482018990529293506000929091169063ad08392890604401600060405180830381865afa1580156103e3573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261040b919081019061100d565b600554604051634c96e16d60e11b81526001600160a01b038881166004830152602482018a90529293506000929091169063992dc2da90604401602060405180830381865afa158015610462573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061048691906110ac565b6040805160808101825295865260208601949094529284019190915250151560608201529392505050565b6104b9610aec565b600580546001600160a01b0319166001600160a01b0392909216919091179055565b60606000600560009054906101000a90046001600160a01b03166001600160a01b031663d94a862b6040518163ffffffff1660e01b8152600401600060405180830381865afa158015610532573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261055a91908101906110c7565b51905060008167ffffffffffffffff81111561057857610578610e78565b6040519080825280602002602001820160405280156105b157816020015b61059e610b96565b8152602001906001900390816105965790505b50905060005b828110156105f9576105c9818661029c565b8282815181106105db576105db611161565b602002602001018190525080806105f190611177565b9150506105b7565b509392505050565b610609610aec565b6106136000610b46565b565b61061d610aec565b600480546001600160a01b0319166001600160a01b0392909216919091179055565b610647610aec565b600380546001600160a01b0319166001600160a01b0392909216919091179055565b610671610aec565b600280546001600160a01b0319166001600160a01b0392909216919091179055565b6004805460405163b09b334f60e01b81526001600160a01b038581169382019390935260248101849052606092600092169063b09b334f90604401600060405180830381865afa1580156106eb573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261071391908101906111a0565b90506000815167ffffffffffffffff81111561073157610731610e78565b6040519080825280602002602001820160405280156107a057816020015b604080516101008101825260008082526020808301829052928201819052606082018190526080820181905260a0820181905260c0820181905260e0820152825260001990920191018161074f5790505b50905060005b8251811015610a655760008382815181106107c3576107c3611161565b6020026020010151600001519050604051806101000160405280826001600160a01b031681526020018584815181106107fe576107fe611161565b602002602001015160200151815260200185848151811061082157610821611161565b602090810291909101810151604090810151835260015490516370a0823160e01b81526001600160a01b038681166004830152939092019216906370a0823190602401602060405180830381865afa158015610881573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108a59190611270565b81526002546040516370a0823160e01b81526001600160a01b038581166004830152602090930192909116906370a0823190602401602060405180830381865afa1580156108f7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061091b9190611270565b815260200185848151811061093257610932611161565b6020908102919091018101516060015115158252600354604051632b58a66f60e21b81526001600160a01b0386811660048301529390920192169063ad6299bc90602401602060405180830381865afa158015610993573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109b791906110ac565b15158152600554604051632b58a66f60e21b81526001600160a01b0385811660048301526020909301929091169063ad6299bc90602401602060405180830381865afa158015610a0b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a2f91906110ac565b1515815250838381518110610a4657610a46611161565b6020026020010181905250508080610a5d90611177565b9150506107a6565b50949350505050565b610a76610aec565b6001600160a01b038116610ae05760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084015b60405180910390fd5b610ae981610b46565b50565b6000546001600160a01b031633146106135760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610ad7565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6040805160c0810190915260006080820181815260a083019190915281908152602001610bf46040518060c0016040528060008152602001600081526020016000815260200160008152602001600081526020016000151581525090565b815260606020820152600060409091015290565b6001600160a01b0381168114610ae957600080fd5b600060208284031215610c2f57600080fd5b8135610c3a81610c08565b9392505050565b60008060408385031215610c5457600080fd5b823591506020830135610c6681610c08565b809150509250929050565b600081518084526020808501945080840160005b83811015610caa5781516001600160a01b031687529582019590820190600101610c85565b509495945050505050565b600061014082518051855260208101516020860152506020830151805160408601526020810151606086015260408101516080860152606081015160a0860152608081015160c086015260a0810151151560e086015250604083015181610100860152610d2482860182610c71565b91505060608301516105f961012086018215159052565b602081526000610c3a6020830184610cb5565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b82811015610da357603f19888603018452610d91858351610cb5565b94509285019290850190600101610d75565b5092979650505050505050565b60008060408385031215610dc357600080fd5b8235610dce81610c08565b946020939093013593505050565b602080825282518282018190526000919060409081850190868401855b82811015610e6b57815180516001600160a01b0316855286810151878601528581015186860152606080820151908601526080808201519086015260a08082015115159086015260c08082015115159086015260e0908101511515908501526101009093019290850190600101610df9565b5091979650505050505050565b634e487b7160e01b600052604160045260246000fd5b6040516080810167ffffffffffffffff81118282101715610eb157610eb1610e78565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715610ee057610ee0610e78565b604052919050565b600060408284031215610efa57600080fd5b6040516040810181811067ffffffffffffffff82111715610f1d57610f1d610e78565b604052825181526020928301519281019290925250919050565b80518015158114610f4757600080fd5b919050565b600060c08284031215610f5e57600080fd5b60405160c0810181811067ffffffffffffffff82111715610f8157610f81610e78565b80604052508091508251815260208301516020820152604083015160408201526060830151606082015260808301516080820152610fc160a08401610f37565b60a08201525092915050565b600060c08284031215610fdf57600080fd5b610c3a8383610f4c565b600067ffffffffffffffff82111561100357611003610e78565b5060051b60200190565b6000602080838503121561102057600080fd5b825167ffffffffffffffff81111561103757600080fd5b8301601f8101851361104857600080fd5b805161105b61105682610fe9565b610eb7565b81815260059190911b8201830190838101908783111561107a57600080fd5b928401925b828410156110a157835161109281610c08565b8252928401929084019061107f565b979650505050505050565b6000602082840312156110be57600080fd5b610c3a82610f37565b600060208083850312156110da57600080fd5b825167ffffffffffffffff8111156110f157600080fd5b8301601f8101851361110257600080fd5b805161111061105682610fe9565b81815260c0918202830184019184820191908884111561112f57600080fd5b938501935b83851015611155576111468986610f4c565b83529384019391850191611134565b50979650505050505050565b634e487b7160e01b600052603260045260246000fd5b600060001982141561119957634e487b7160e01b600052601160045260246000fd5b5060010190565b600060208083850312156111b357600080fd5b825167ffffffffffffffff8111156111ca57600080fd5b8301601f810185136111db57600080fd5b80516111e961105682610fe9565b81815260079190911b8201830190838101908783111561120857600080fd5b928401925b828410156110a157608084890312156112265760008081fd5b61122e610e8e565b845161123981610c08565b8152848601518682015260408086015190820152606061125a818701610f37565b908201528252608093909301929084019061120d565b60006020828403121561128257600080fd5b505191905056fea2646970667358221220f40a9c0f64ebd3862bc7b5516a848aac6de0a20baf020f06cb8ffa786accf79064736f6c634300080b0033";

type HelperConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: HelperConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Helper__factory extends ContractFactory {
  constructor(...args: HelperConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _token1: PromiseOrValue<string>,
    _token2: PromiseOrValue<string>,
    _staking: PromiseOrValue<string>,
    _referralManager: PromiseOrValue<string>,
    _squads: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Helper> {
    return super.deploy(
      _token1,
      _token2,
      _staking,
      _referralManager,
      _squads,
      overrides || {}
    ) as Promise<Helper>;
  }
  override getDeployTransaction(
    _token1: PromiseOrValue<string>,
    _token2: PromiseOrValue<string>,
    _staking: PromiseOrValue<string>,
    _referralManager: PromiseOrValue<string>,
    _squads: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _token1,
      _token2,
      _staking,
      _referralManager,
      _squads,
      overrides || {}
    );
  }
  override attach(address: string): Helper {
    return super.attach(address) as Helper;
  }
  override connect(signer: Signer): Helper__factory {
    return super.connect(signer) as Helper__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): HelperInterface {
    return new utils.Interface(_abi) as HelperInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Helper {
    return new Contract(address, _abi, signerOrProvider) as Helper;
  }
}
