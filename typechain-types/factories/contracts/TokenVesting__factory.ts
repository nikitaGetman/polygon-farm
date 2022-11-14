/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  TokenVesting,
  TokenVestingInterface,
} from "../../contracts/TokenVesting";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "token_",
        type: "address",
      },
      {
        internalType: "address",
        name: "pool_",
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
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Released",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "vestingScheduleId",
        type: "bytes32",
      },
    ],
    name: "Revoked",
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
    inputs: [
      {
        internalType: "address",
        name: "holder",
        type: "address",
      },
    ],
    name: "computeNextVestingScheduleIdForHolder",
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
        internalType: "bytes32",
        name: "vestingScheduleId",
        type: "bytes32",
      },
    ],
    name: "computeReleasableAmount",
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
        name: "holder",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "computeVestingScheduleIdForAddressAndIndex",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_beneficiary",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_start",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_cliff",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_duration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_slicePeriodSeconds",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_revocable",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "createVestingSchedule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "holder",
        type: "address",
      },
    ],
    name: "getLastVestingScheduleForHolder",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "initialized",
            type: "bool",
          },
          {
            internalType: "address",
            name: "beneficiary",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "cliff",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "start",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "duration",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "slicePeriodSeconds",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "revocable",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "amountTotal",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "released",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "revoked",
            type: "bool",
          },
        ],
        internalType: "struct TokenVesting.VestingSchedule",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getReservesBalance",
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
    name: "getToken",
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
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getVestingIdAtIndex",
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
        internalType: "bytes32",
        name: "vestingScheduleId",
        type: "bytes32",
      },
    ],
    name: "getVestingSchedule",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "initialized",
            type: "bool",
          },
          {
            internalType: "address",
            name: "beneficiary",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "cliff",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "start",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "duration",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "slicePeriodSeconds",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "revocable",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "amountTotal",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "released",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "revoked",
            type: "bool",
          },
        ],
        internalType: "struct TokenVesting.VestingSchedule",
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
        name: "holder",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getVestingScheduleByAddressAndIndex",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "initialized",
            type: "bool",
          },
          {
            internalType: "address",
            name: "beneficiary",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "cliff",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "start",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "duration",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "slicePeriodSeconds",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "revocable",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "amountTotal",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "released",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "revoked",
            type: "bool",
          },
        ],
        internalType: "struct TokenVesting.VestingSchedule",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVestingSchedulesCount",
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
        name: "_beneficiary",
        type: "address",
      },
    ],
    name: "getVestingSchedulesCountByBeneficiary",
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
    name: "getVestingSchedulesTotalAmount",
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
        internalType: "bytes32",
        name: "vestingScheduleId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "release",
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
        name: "vestingScheduleId",
        type: "bytes32",
      },
    ],
    name: "revoke",
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
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "updateVestingPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60a06040523480156200001157600080fd5b50604051620020033803806200200383398101604081905262000034916200015f565b600180556001600160a01b0382166200004c57600080fd5b6001600160a01b0381166200006057600080fd5b6001600160a01b03828116608052600280546001600160a01b031916918316919091179055620000996000620000933390565b620000a1565b505062000197565b6000828152602081815260408083206001600160a01b038516845290915290205460ff166200013e576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055620000fd3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b80516001600160a01b03811681146200015a57600080fd5b919050565b600080604083850312156200017357600080fd5b6200017e8362000142565b91506200018e6020840162000142565b90509250929050565b608051611e2d620001d6600039600081816101ae01528181610767015281816108de01528181610c8201528181610d1e01526110d30152611e2d6000f3fe608060405234801561001057600080fd5b506004361061014d5760003560e01c80636e19b805116100c3578063b75c7dc61161007c578063b75c7dc6146102e1578063d547741f146102f4578063ea1bb3d514610307578063f51321d71461031a578063f7c469f01461032d578063f9079b371461034057600080fd5b80636e19b805146102785780637e913dc6146102805780638af104da146102a057806391d14854146102b35780639ef346b4146102c6578063a217fddf146102d957600080fd5b80632f2ff15d116101155780632f2ff15d146101fb57806336568abe1461020e57806348deb4711461022157806351d02645146102295780635a7bb69a1461023c57806366afd8ef1461026557600080fd5b806301ffc9a714610152578063130836171461017a57806317e289e91461018c57806321df0da7146101a1578063248a9ca3146101d8575b600080fd5b610165610160366004611a16565b610353565b60405190151581526020015b60405180910390f35b6003545b604051908152602001610171565b61019f61019a366004611a6a565b61038a565b005b6040516001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168152602001610171565b61017e6101e6366004611ad1565b60009081526020819052604090206001015490565b61019f610209366004611aea565b61081e565b61019f61021c366004611aea565b610848565b61017e6108c6565b61019f610237366004611b16565b610957565b61017e61024a366004611b16565b6001600160a01b031660009081526005602052604090205490565b61019f610273366004611b31565b6109ee565b61017e610cf9565b61029361028e366004611b16565b610d4d565b6040516101719190611b53565b61017e6102ae366004611bde565b610e25565b6101656102c1366004611aea565b610e6c565b6102936102d4366004611ad1565b610e95565b61017e600081565b61019f6102ef366004611ad1565b610f3c565b61019f610302366004611aea565b61114d565b61017e610315366004611ad1565b611172565b610293610328366004611bde565b61125c565b61017e61033b366004611b16565b611278565b61017e61034e366004611ad1565b61129c565b60006001600160e01b03198216637965db0b60e01b148061038457506301ffc9a760e01b6001600160e01b03198316145b92915050565b600061039581611324565b81306001600160a01b0316636e19b8056040518163ffffffff1660e01b8152600401602060405180830381865afa1580156103d4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103f89190611c08565b10156104845760405162461bcd60e51b815260206004820152604a60248201527f546f6b656e56657374696e673a2063616e6e6f7420637265617465207665737460448201527f696e67207363686564756c652062656361757365206e6f742073756666696369606482015269656e7420746f6b656e7360b01b608482015260a4015b60405180910390fd5b600085116104df5760405162461bcd60e51b815260206004820152602260248201527f546f6b656e56657374696e673a206475726174696f6e206d757374206265203e604482015261020360f41b606482015260840161047b565b6000821161052f5760405162461bcd60e51b815260206004820181905260248201527f546f6b656e56657374696e673a20616d6f756e74206d757374206265203e2030604482015260640161047b565b60018410156105965760405162461bcd60e51b815260206004820152602d60248201527f546f6b656e56657374696e673a20736c696365506572696f645365636f6e647360448201526c206d757374206265203e3d203160981b606482015260840161047b565b604051630f7c469f60e41b81526001600160a01b0389166004820152600090309063f7c469f090602401602060405180830381865afa1580156105dd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106019190611c08565b9050600061060f8989611331565b90506040518061014001604052806001151581526020018b6001600160a01b031681526020018281526020018a8152602001888152602001878152602001861515815260200185815260200160008152602001600015158152506004600084815260200190815260200160002060008201518160000160006101000a81548160ff02191690831515021790555060208201518160000160016101000a8154816001600160a01b0302191690836001600160a01b0316021790555060408201518160010155606082015181600201556080820151816003015560a0820151816004015560c08201518160050160006101000a81548160ff02191690831515021790555060e0820151816006015561010082015181600701556101208201518160080160006101000a81548160ff02191690831515021790555090505061079f600260009054906101000a90046001600160a01b031630867f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661133d909392919063ffffffff16565b6003805460018181019092557fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b018390556001600160a01b038b16600090815260056020526040902054906107f5908290611331565b6001600160a01b03909b1660009081526005602052604090209a909a5550505050505050505050565b60008281526020819052604090206001015461083981611324565b61084383836113ae565b505050565b6001600160a01b03811633146108b85760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b606482015260840161047b565b6108c28282611432565b5050565b6040516370a0823160e01b81523060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a08231906024015b602060405180830381865afa15801561092e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109529190611c08565b905090565b600061096281611324565b6001600160a01b0382166109cb5760405162461bcd60e51b815260206004820152602a60248201527f546f6b656e56657374696e673a20706f6f6c2063616e206e6f74206265207a65604482015269726f206164647265737360b01b606482015260840161047b565b50600280546001600160a01b0319166001600160a01b0392909216919091179055565b60026001541415610a415760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604482015260640161047b565b60026001908155600083815260046020526040902054839160ff909116151514610a6a57600080fd5b60008181526004602052604090206008015460ff1615610a8957600080fd5b6000838152600460205260408120805490919061010090046001600160a01b0316336001600160a01b03161490506000610ac38133610e6c565b90508180610ace5750805b610b4b5760405162461bcd60e51b815260206004820152604260248201527f546f6b656e56657374696e673a206f6e6c792062656e6566696369617279206160448201527f6e642061646d696e2063616e2072656c656173652076657374656420746f6b656064820152616e7360f01b608482015260a40161047b565b6040805161014081018252845460ff808216151583526001600160a01b03610100928390041660208401526001870154938301939093526002860154606083015260038601546080830152600486015460a083015260058601548316151560c0830152600686015460e083015260078601549082015260088501549091161515610120820152600090610bdd90611497565b905085811015610c555760405162461bcd60e51b815260206004820152603d60248201527f546f6b656e56657374696e673a2063616e6e6f742072656c6561736520746f6b60448201527f656e732c206e6f7420656e6f7567682076657374656420746f6b656e73000000606482015260840161047b565b6007840154610c649087611331565b600785015583546001600160a01b03610100909104811690610ca9907f000000000000000000000000000000000000000000000000000000000000000016828961157a565b604080516001600160a01b0383168152602081018990527fb21fb52d5749b80f3182f8c6992236b5e5576681880914484d7f4c9b062e619e910160405180910390a1505060018055505050505050565b6002546040516370a0823160e01b81526001600160a01b0391821660048201526000917f000000000000000000000000000000000000000000000000000000000000000016906370a0823190602401610911565b610d556119b4565b6001600160a01b03821660009081526005602052604081205460049190610d849085906102ae90600190611c37565b81526020808201929092526040908101600020815161014081018352815460ff808216151583526001600160a01b036101009283900416958301959095526001830154938201939093526002820154606082015260038201546080820152600482015460a082015260058201548416151560c0820152600682015460e082015260078201549281019290925260080154909116151561012082015292915050565b6040516bffffffffffffffffffffffff19606084901b1660208201526034810182905260009060540160405160208183030381529060405280519060200120905092915050565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b610e9d6119b4565b50600090815260046020818152604092839020835161014081018552815460ff808216151583526001600160a01b0361010092839004169483019490945260018301549582019590955260028201546060820152600382015460808201529281015460a084015260058101548216151560c0840152600681015460e0840152600781015493830193909352600890920154909116151561012082015290565b6000610f4781611324565b600082815260046020526040902054829060ff161515600114610f6957600080fd5b60008181526004602052604090206008015460ff1615610f8857600080fd5b6000838152600460205260409020600581015460ff161515600114610ffe5760405162461bcd60e51b815260206004820152602660248201527f546f6b656e56657374696e673a2076657374696e67206973206e6f74207265766044820152656f6361626c6560d01b606482015260840161047b565b6040805161014081018252825460ff808216151583526001600160a01b03610100928390041660208401526001850154938301939093526002840154606083015260038401546080830152600484015460a083015260058401548316151560c0830152600684015460e08301526007840154908201526008830154909116151561012082015260009061109090611497565b905080156110a2576110a285826109ee565b60006110bf836007015484600601546115aa90919063ffffffff16565b6002549091506110fc906001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000811691168361157a565b60088301805460ff191660011790556040517fe5af7daed5ab2a2dc5f98d53619f05089c0c14d11a6621f6b906a2366c9a7ab39061113d9088815260200190565b60405180910390a1505050505050565b60008281526020819052604090206001015461116881611324565b6108438383611432565b600081815260046020526040812054829060ff16151560011461119457600080fd5b60008181526004602052604090206008015460ff16156111b357600080fd5b600083815260046020818152604092839020835161014081018552815460ff808216151583526001600160a01b0361010092839004169483019490945260018301549582019590955260028201546060820152600382015460808201529281015460a084015260058101548216151560c0840152600681015460e0840152600781015493830193909352600883015416151561012082015261125490611497565b949350505050565b6112646119b4565b6112716102d48484610e25565b9392505050565b6001600160a01b038116600090815260056020526040812054610384908390610e25565b60006112a760035490565b82106112ff5760405162461bcd60e51b815260206004820152602160248201527f546f6b656e56657374696e673a20696e646578206f7574206f6620626f756e646044820152607360f81b606482015260840161047b565b6003828154811061131257611312611c4e565b90600052602060002001549050919050565b61132e81336115b6565b50565b60006112718284611c64565b6040516001600160a01b03808516602483015283166044820152606481018290526113a89085906323b872dd60e01b906084015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b03199093169290921790915261161a565b50505050565b6113b88282610e6c565b6108c2576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556113ee3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b61143c8282610e6c565b156108c2576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b604081015160009042908110806114b5575061012083015115156001145b156114c35750600092915050565b608083015160408401516114d691611331565b81106114f05761010083015160e0840151611271916115aa565b60006115098460400151836115aa90919063ffffffff16565b60a0850151909150600061151d83836116ec565b9050600061152b82846116f8565b90506000611554886080015161154e848b60e001516116f890919063ffffffff16565b906116ec565b905061156e886101000151826115aa90919063ffffffff16565b98975050505050505050565b6040516001600160a01b03831660248201526044810182905261084390849063a9059cbb60e01b90606401611371565b60006112718284611c37565b6115c08282610e6c565b6108c2576115d8816001600160a01b03166014611704565b6115e3836020611704565b6040516020016115f4929190611ca8565b60408051601f198184030181529082905262461bcd60e51b825261047b91600401611d1d565b600061166f826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166118a09092919063ffffffff16565b805190915015610843578080602001905181019061168d9190611d50565b6108435760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b606482015260840161047b565b60006112718284611d6d565b60006112718284611d8f565b60606000611713836002611d8f565b61171e906002611c64565b67ffffffffffffffff81111561173657611736611dae565b6040519080825280601f01601f191660200182016040528015611760576020820181803683370190505b509050600360fc1b8160008151811061177b5761177b611c4e565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106117aa576117aa611c4e565b60200101906001600160f81b031916908160001a90535060006117ce846002611d8f565b6117d9906001611c64565b90505b6001811115611851576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061180d5761180d611c4e565b1a60f81b82828151811061182357611823611c4e565b60200101906001600160f81b031916908160001a90535060049490941c9361184a81611dc4565b90506117dc565b5083156112715760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161047b565b60606112548484600085856001600160a01b0385163b6119025760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161047b565b600080866001600160a01b0316858760405161191e9190611ddb565b60006040518083038185875af1925050503d806000811461195b576040519150601f19603f3d011682016040523d82523d6000602084013e611960565b606091505b509150915061197082828661197b565b979650505050505050565b6060831561198a575081611271565b82511561199a5782518084602001fd5b8160405162461bcd60e51b815260040161047b9190611d1d565b60405180610140016040528060001515815260200160006001600160a01b031681526020016000815260200160008152602001600081526020016000815260200160001515815260200160008152602001600081526020016000151581525090565b600060208284031215611a2857600080fd5b81356001600160e01b03198116811461127157600080fd5b80356001600160a01b0381168114611a5757600080fd5b919050565b801515811461132e57600080fd5b600080600080600080600060e0888a031215611a8557600080fd5b611a8e88611a40565b96506020880135955060408801359450606088013593506080880135925060a0880135611aba81611a5c565b8092505060c0880135905092959891949750929550565b600060208284031215611ae357600080fd5b5035919050565b60008060408385031215611afd57600080fd5b82359150611b0d60208401611a40565b90509250929050565b600060208284031215611b2857600080fd5b61127182611a40565b60008060408385031215611b4457600080fd5b50508035926020909101359150565b81511515815261014081016020830151611b7860208401826001600160a01b03169052565b5060408301516040830152606083015160608301526080830151608083015260a083015160a083015260c0830151611bb460c084018215159052565b5060e083810151908301526101008084015190830152610120928301511515929091019190915290565b60008060408385031215611bf157600080fd5b611bfa83611a40565b946020939093013593505050565b600060208284031215611c1a57600080fd5b5051919050565b634e487b7160e01b600052601160045260246000fd5b600082821015611c4957611c49611c21565b500390565b634e487b7160e01b600052603260045260246000fd5b60008219821115611c7757611c77611c21565b500190565b60005b83811015611c97578181015183820152602001611c7f565b838111156113a85750506000910152565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351611ce0816017850160208801611c7c565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351611d11816028840160208801611c7c565b01602801949350505050565b6020815260008251806020840152611d3c816040850160208701611c7c565b601f01601f19169190910160400192915050565b600060208284031215611d6257600080fd5b815161127181611a5c565b600082611d8a57634e487b7160e01b600052601260045260246000fd5b500490565b6000816000190483118215151615611da957611da9611c21565b500290565b634e487b7160e01b600052604160045260246000fd5b600081611dd357611dd3611c21565b506000190190565b60008251611ded818460208701611c7c565b919091019291505056fea2646970667358221220890d5e1553502b5bf63d2a0df71a14f9bb3e76e3df3d0e8588793b0c61e0f3c064736f6c634300080b0033";

type TokenVestingConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TokenVestingConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TokenVesting__factory extends ContractFactory {
  constructor(...args: TokenVestingConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    token_: PromiseOrValue<string>,
    pool_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TokenVesting> {
    return super.deploy(
      token_,
      pool_,
      overrides || {}
    ) as Promise<TokenVesting>;
  }
  override getDeployTransaction(
    token_: PromiseOrValue<string>,
    pool_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(token_, pool_, overrides || {});
  }
  override attach(address: string): TokenVesting {
    return super.attach(address) as TokenVesting;
  }
  override connect(signer: Signer): TokenVesting__factory {
    return super.connect(signer) as TokenVesting__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TokenVestingInterface {
    return new utils.Interface(_abi) as TokenVestingInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TokenVesting {
    return new Contract(address, _abi, signerOrProvider) as TokenVesting;
  }
}
