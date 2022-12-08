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
import type { PromiseOrValue } from "../../../common";
import type { Token2, Token2Interface } from "../../../contracts/tokens/Token2";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "initialSupply_",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "holderAddress_",
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
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "_addresses",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "BlacklistAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "_addresses",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "BlacklistRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
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
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "_addresses",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "WhitelistAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "WhitelistDisabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "WhitelistEnabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "_addresses",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "WhitelistRemoved",
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
    name: "MINTER_ROLE",
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
    name: "PAUSER_ROLE",
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
        internalType: "address[]",
        name: "_addresses",
        type: "address[]",
      },
    ],
    name: "addToBlacklist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_addresses",
        type: "address[]",
      },
    ],
    name: "addToWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
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
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
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
        name: "_address",
        type: "address",
      },
    ],
    name: "isAddressInBlacklist",
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
        name: "_address",
        type: "address",
      },
    ],
    name: "isAddressInWhiteList",
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
    name: "isWhitelistRestrictionMode",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "offWhitelistMode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "onWhitelistMode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
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
        internalType: "address[]",
        name: "_addresses",
        type: "address[]",
      },
    ],
    name: "removeFromBlacklist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_addresses",
        type: "address[]",
      },
    ],
    name: "removeFromWhitelist",
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
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalBurn",
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
    name: "totalMinted",
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
    name: "totalSupply",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
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
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620027bc380380620027bc8339810160408190526200003491620007eb565b81816040518060400160405280600d81526020016c1a54d85d995c8814995dd85c99609a1b8152506040518060400160405280600481526020016329a0ab2960e11b815250818181600390805190602001906200009392919062000745565b508051620000a990600490602084019062000745565b50506009805460ff1916905550620000c960003362000220565b62000220565b620000f57f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a3362000220565b620001018385620002c5565b505050506200013a7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6620000c36200021c60201b60201c565b6007805460ff19166001179055604080516003808252608082019092526000916020820160608036833701905050905033816000815181106200018157620001816200082a565b60200260200101906001600160a01b031690816001600160a01b0316815250508181600181518110620001b857620001b86200082a565b60200260200101906001600160a01b031690816001600160a01b031681525050600081600281518110620001f057620001f06200082a565b6001600160a01b03909216602092830291909101909101526200021381620002f9565b5050506200092b565b3390565b60008281526008602090815260408083206001600160a01b038516845290915290205460ff16620002c15760008281526008602090815260408083206001600160a01b03851684529091529020805460ff19166001179055620002803390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b620002dc8282620003a760201b62000ae11760201c565b80600a6000828254620002f0919062000856565b90915550505050565b60005b815181101562000368576001600660008484815181106200032157620003216200082a565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff1916911515919091179055806200035f8162000871565b915050620002fc565b507f8ec05053eabbe22d02c22d6f38264dc48844a9124d46444242ae2f4a1060648a81336040516200039c9291906200088f565b60405180910390a150565b6001600160a01b038216620004035760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064015b60405180910390fd5b62000411600083836200049e565b806002600082825462000425919062000856565b90915550506001600160a01b038216600090815260208190526040812080548392906200045490849062000856565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b620004a8620004c5565b620004c08383836200050f60201b62000bcc1760201c565b505050565b60095460ff16156200050d5760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b6044820152606401620003fa565b565b60075460ff1615620005c3576001600160a01b03831660009081526006602052604090205460ff16806200055b57506001600160a01b03821660009081526006602052604090205460ff165b620005c35760405162461bcd60e51b815260206004820152603160248201527f57686974656c6973743a2073656e646572206f72207265636569766572206973604482015270081b9bdd081a5b881dda1a5d195b1a5cdd607a1b6064820152608401620003fa565b6001600160a01b03831660009081526005602052604090205460ff1615620006385760405162461bcd60e51b815260206004820152602160248201527f426c61636b6c6973743a2073656e64657220697320696e20626c61636b6c69736044820152601d60fa1b6064820152608401620003fa565b6001600160a01b03821660009081526005602052604090205460ff1615620006af5760405162461bcd60e51b815260206004820152602360248201527f426c61636b6c6973743a20726563656976657220697320696e20626c61636b6c6044820152621a5cdd60ea1b6064820152608401620003fa565b6001600160a01b03831633146200072d573360009081526005602052604090205460ff16156200072d5760405162461bcd60e51b815260206004820152602260248201527f426c61636b6c6973743a207370656e64657220697320696e20626c61636b6c696044820152611cdd60f21b6064820152608401620003fa565b620004c0838383620004c060201b620006a81760201c565b8280546200075390620008ee565b90600052602060002090601f016020900481019282620007775760008555620007c2565b82601f106200079257805160ff1916838001178555620007c2565b82800160010185558215620007c2579182015b82811115620007c2578251825591602001919060010190620007a5565b50620007d0929150620007d4565b5090565b5b80821115620007d05760008155600101620007d5565b60008060408385031215620007ff57600080fd5b825160208401519092506001600160a01b03811681146200081f57600080fd5b809150509250929050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600082198211156200086c576200086c62000840565b500190565b600060001982141562000888576200088862000840565b5060010190565b604080825283519082018190526000906020906060840190828701845b82811015620008d35781516001600160a01b031684529284019290840190600101620008ac565b5050506001600160a01b039490941692019190915250919050565b600181811c908216806200090357607f821691505b602082108114156200092557634e487b7160e01b600052602260045260246000fd5b50919050565b611e81806200093b6000396000f3fe608060405234801561001057600080fd5b50600436106102275760003560e01c80637882298a11610130578063a2309ff8116100b8578063d53913931161007c578063d539139314610479578063d547741f1461048e578063dd62ed3e146104a1578063e4aa2533146104b4578063e63ab1e9146104e057600080fd5b8063a2309ff814610436578063a3fd3a7a1461043e578063a457c2d714610446578063a6a9e6c614610459578063a9059cbb1461046657600080fd5b806389daf799116100ff57806389daf799146103ed57806391d1485414610400578063935eb35f1461041357806395d89b4114610426578063a217fddf1461042e57600080fd5b80637882298a146103b757806379cc6790146103bf5780637f649783146103d25780638456cb59146103e557600080fd5b806339509351116101b357806342966c681161018257806342966c6814610331578063548db174146103445780635c975abb146103575780635e359de01461036257806370a082311461038e57600080fd5b806339509351146102fb5780633c9f861d1461030e5780633f4ba83a1461031657806340c10f191461031e57600080fd5b806323b872dd116101fa57806323b872dd1461028e578063248a9ca3146102a15780632f2ff15d146102c4578063313ce567146102d957806336568abe146102e857600080fd5b806301ffc9a71461022c57806306fdde0314610254578063095ea7b31461026957806318160ddd1461027c575b600080fd5b61023f61023a366004611a2c565b610507565b60405190151581526020015b60405180910390f35b61025c61053e565b60405161024b9190611a82565b61023f610277366004611ad1565b6105d0565b6002545b60405190815260200161024b565b61023f61029c366004611afb565b6105e8565b6102806102af366004611b37565b60009081526008602052604090206001015490565b6102d76102d2366004611b50565b61060c565b005b6040516012815260200161024b565b6102d76102f6366004611b50565b6106ad565b61023f610309366004611ad1565b610730565b610280610752565b6102d761076f565b6102d761032c366004611ad1565b6107a4565b6102d761033f366004611b37565b6107c6565b6102d7610352366004611b7c565b6107d0565b60095460ff1661023f565b61023f610370366004611bf1565b6001600160a01b031660009081526006602052604090205460ff1690565b61028061039c366004611bf1565b6001600160a01b031660009081526020819052604090205490565b6102d7610817565b6102d76103cd366004611ad1565b61082a565b6102d76103e0366004611b7c565b61083f565b6102d7610886565b6102d76103fb366004611b7c565b6108b8565b61023f61040e366004611b50565b6108ff565b6102d7610421366004611b7c565b61092a565b61025c610971565b610280600081565b600a54610280565b6102d7610980565b61023f610454366004611ad1565b610993565b60075461023f9060ff1681565b61023f610474366004611ad1565b610a0e565b610280600080516020611e2c83398151915281565b6102d761049c366004611b50565b610a1c565b6102806104af366004611c0c565b610ab6565b61023f6104c2366004611bf1565b6001600160a01b031660009081526005602052604090205460ff1690565b6102807f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b60006001600160e01b03198216637965db0b60e01b148061053857506301ffc9a760e01b6001600160e01b03198316145b92915050565b60606003805461054d90611c36565b80601f016020809104026020016040519081016040528092919081815260200182805461057990611c36565b80156105c65780601f1061059b576101008083540402835291602001916105c6565b820191906000526020600020905b8154815290600101906020018083116105a957829003601f168201915b5050505050905090565b6000336105de818585610ddf565b5060019392505050565b6000336105f6858285610f03565b610601858585610f77565b506001949350505050565b60008281526008602052604090206001015461062781611150565b610631838361115a565b600080516020611e2c8339815191528314156106a85760408051600180825281830190925260009160208083019080368337019050509050828160008151811061067d5761067d611c87565b60200260200101906001600160a01b031690816001600160a01b0316815250506106a68161117f565b505b505050565b6001600160a01b03811633146107225760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b61072c8282611225565b5050565b6000336105de8185856107438383610ab6565b61074d9190611cb3565b610ddf565b600061075d60025490565b600a5461076a9190611ccb565b905090565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a61079981611150565b6107a161128c565b50565b600080516020611e2c8339815191526107bc81611150565b6106a883836112de565b6107a13382611303565b60006107db81611150565b6106a883838080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525061145d92505050565b600061082281611150565b6107a16114ee565b610835823383610f03565b61072c8282611303565b600061084a81611150565b6106a883838080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525061117f92505050565b7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a6108b081611150565b6107a1611523565b60006108c381611150565b6106a883838080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525061156092505050565b60009182526008602090815260408084206001600160a01b0393909316845291905290205460ff1690565b600061093581611150565b6106a88383808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152506115f192505050565b60606004805461054d90611c36565b600061098b81611150565b6107a1611682565b600033816109a18286610ab6565b905083811015610a015760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152608401610719565b6106018286868403610ddf565b6000336105de818585610f77565b600082815260086020526040902060010154610a3781611150565b610a4183836116b3565b600080516020611e2c8339815191528314156106a857604080516001808252818301909252600091602080830190803683370190505090508281600081518110610a8d57610a8d611c87565b60200260200101906001600160a01b031690816001600160a01b0316815250506106a68161145d565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6001600160a01b038216610b375760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610719565b610b43600083836116d8565b8060026000828254610b559190611cb3565b90915550506001600160a01b03821660009081526020819052604081208054839290610b82908490611cb3565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b60075460ff1615610c7c576001600160a01b03831660009081526006602052604090205460ff1680610c1657506001600160a01b03821660009081526006602052604090205460ff165b610c7c5760405162461bcd60e51b815260206004820152603160248201527f57686974656c6973743a2073656e646572206f72207265636569766572206973604482015270081b9bdd081a5b881dda1a5d195b1a5cdd607a1b6064820152608401610719565b6001600160a01b03831660009081526005602052604090205460ff1615610cef5760405162461bcd60e51b815260206004820152602160248201527f426c61636b6c6973743a2073656e64657220697320696e20626c61636b6c69736044820152601d60fa1b6064820152608401610719565b6001600160a01b03821660009081526005602052604090205460ff1615610d645760405162461bcd60e51b815260206004820152602360248201527f426c61636b6c6973743a20726563656976657220697320696e20626c61636b6c6044820152621a5cdd60ea1b6064820152608401610719565b6001600160a01b03831633146106a8573360009081526005602052604090205460ff16156106a85760405162461bcd60e51b815260206004820152602260248201527f426c61636b6c6973743a207370656e64657220697320696e20626c61636b6c696044820152611cdd60f21b6064820152608401610719565b6001600160a01b038316610e415760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610719565b6001600160a01b038216610ea25760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610719565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6000610f0f8484610ab6565b905060001981146106a65781811015610f6a5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610719565b6106a68484848403610ddf565b6001600160a01b038316610fdb5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610719565b6001600160a01b03821661103d5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610719565b6110488383836116d8565b6001600160a01b038316600090815260208190526040902054818110156110c05760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610719565b6001600160a01b038085166000908152602081905260408082208585039055918516815290812080548492906110f7908490611cb3565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161114391815260200190565b60405180910390a36106a6565b6107a181336116eb565b60008281526008602052604090206001015461117581611150565b6106a88383611772565b60005b81518110156111e7576001600660008484815181106111a3576111a3611c87565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff1916911515919091179055806111df81611ce2565b915050611182565b507f8ec05053eabbe22d02c22d6f38264dc48844a9124d46444242ae2f4a1060648a81335b60405161121a929190611cfd565b60405180910390a150565b61122f82826108ff565b1561072c5760008281526008602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6112946117f8565b6009805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b6112e88282610ae1565b80600a60008282546112fa9190611cb3565b90915550505050565b6001600160a01b0382166113635760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b6064820152608401610719565b61136f826000836116d8565b6001600160a01b038216600090815260208190526040902054818110156113e35760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b6064820152608401610719565b6001600160a01b0383166000908152602081905260408120838303905560028054849290611412908490611ccb565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a3505050565b60005b81518110156114c55760006006600084848151811061148157611481611c87565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff1916911515919091179055806114bd81611ce2565b915050611460565b507ff8ce93c76467f88de50b32f3da327bbd3c8e2dbbbe542441d3fb079127d18558813361120c565b6007805460ff191660011790557f7f93a45f70dde0bd08c45d334f84774f8aaa04a8b7c8349cf2837646445984db6112c13390565b61152b611843565b6009805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586112c13390565b60005b81518110156115c85760006005600084848151811061158457611584611c87565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff1916911515919091179055806115c081611ce2565b915050611563565b507f5a4725934bdecae9c9a0667e8d4c8d41439cab15714e5f728a05016c67a33329813361120c565b60005b81518110156116595760016005600084848151811061161557611615611c87565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff19169115159190911790558061165181611ce2565b9150506115f4565b507f83fbe52cf5eb3dcf05adec4bc136712a8fd2cf73ad5eb0945332af6aaf87d8a7813361120c565b6007805460ff191690557fc0e106cf568e50698fdbde1eff56f5a5c966cc7958e37e276918e9e4ccdf8cd4336112c1565b6000828152600860205260409020600101546116ce81611150565b6106a88383611225565b6116e0611843565b6106a8838383610bcc565b6116f582826108ff565b15801561170a57506117086000826108ff565b155b1561072c57611723816001600160a01b03166014611889565b61172e836020611889565b61173a60006020611889565b60405160200161174c93929190611d5a565b60408051601f198184030181529082905262461bcd60e51b825261071991600401611a82565b61177c82826108ff565b61072c5760008281526008602090815260408083206001600160a01b03851684529091529020805460ff191660011790556117b43390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b60095460ff166118415760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b6044820152606401610719565b565b60095460ff16156118415760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b6044820152606401610719565b60606000611898836002611df5565b6118a3906002611cb3565b67ffffffffffffffff8111156118bb576118bb611c71565b6040519080825280601f01601f1916602001820160405280156118e5576020820181803683370190505b509050600360fc1b8160008151811061190057611900611c87565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061192f5761192f611c87565b60200101906001600160f81b031916908160001a9053506000611953846002611df5565b61195e906001611cb3565b90505b60018111156119d6576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061199257611992611c87565b1a60f81b8282815181106119a8576119a8611c87565b60200101906001600160f81b031916908160001a90535060049490941c936119cf81611e14565b9050611961565b508315611a255760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610719565b9392505050565b600060208284031215611a3e57600080fd5b81356001600160e01b031981168114611a2557600080fd5b60005b83811015611a71578181015183820152602001611a59565b838111156106a65750506000910152565b6020815260008251806020840152611aa1816040850160208701611a56565b601f01601f19169190910160400192915050565b80356001600160a01b0381168114611acc57600080fd5b919050565b60008060408385031215611ae457600080fd5b611aed83611ab5565b946020939093013593505050565b600080600060608486031215611b1057600080fd5b611b1984611ab5565b9250611b2760208501611ab5565b9150604084013590509250925092565b600060208284031215611b4957600080fd5b5035919050565b60008060408385031215611b6357600080fd5b82359150611b7360208401611ab5565b90509250929050565b60008060208385031215611b8f57600080fd5b823567ffffffffffffffff80821115611ba757600080fd5b818501915085601f830112611bbb57600080fd5b813581811115611bca57600080fd5b8660208260051b8501011115611bdf57600080fd5b60209290920196919550909350505050565b600060208284031215611c0357600080fd5b611a2582611ab5565b60008060408385031215611c1f57600080fd5b611c2883611ab5565b9150611b7360208401611ab5565b600181811c90821680611c4a57607f821691505b60208210811415611c6b57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b60008219821115611cc657611cc6611c9d565b500190565b600082821015611cdd57611cdd611c9d565b500390565b6000600019821415611cf657611cf6611c9d565b5060010190565b604080825283519082018190526000906020906060840190828701845b82811015611d3f5781516001600160a01b031684529284019290840190600101611d1a565b5050506001600160a01b039490941692019190915250919050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008451611d92816017850160208901611a56565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528451611dc3816028840160208901611a56565b6301037b9160e51b602892909101918201528351611de881602c840160208801611a56565b01602c0195945050505050565b6000816000190483118215151615611e0f57611e0f611c9d565b500290565b600081611e2357611e23611c9d565b50600019019056fe9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6a2646970667358221220245b3d875c562617b4440d7aa8940c9dbc8872832043c9e853cca1a6e1b84fb264736f6c634300080b0033";

type Token2ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: Token2ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Token2__factory extends ContractFactory {
  constructor(...args: Token2ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    initialSupply_: PromiseOrValue<BigNumberish>,
    holderAddress_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Token2> {
    return super.deploy(
      initialSupply_,
      holderAddress_,
      overrides || {}
    ) as Promise<Token2>;
  }
  override getDeployTransaction(
    initialSupply_: PromiseOrValue<BigNumberish>,
    holderAddress_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      initialSupply_,
      holderAddress_,
      overrides || {}
    );
  }
  override attach(address: string): Token2 {
    return super.attach(address) as Token2;
  }
  override connect(signer: Signer): Token2__factory {
    return super.connect(signer) as Token2__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): Token2Interface {
    return new utils.Interface(_abi) as Token2Interface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Token2 {
    return new Contract(address, _abi, signerOrProvider) as Token2;
  }
}
