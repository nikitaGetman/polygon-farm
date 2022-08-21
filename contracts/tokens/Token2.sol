// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "./BasicToken.sol";

contract Token2 is BasicToken {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(uint256 initialSupply_, address holderAddress_)
        BasicToken(initialSupply_, holderAddress_, "Token2", "TKN2")
    {
        _grantRole(MINTER_ROLE, _msgSender());

        isWhitelistRestrictionMode = true;
        address[] memory whitelistAddresses = new address[](2);
        whitelistAddresses[0] = _msgSender();
        whitelistAddresses[1] = holderAddress_;
        _addToWhitelist(whitelistAddresses);
    }

    function grantRole(bytes32 role, address account)
        public
        virtual
        override
        onlyRole(getRoleAdmin(role))
    {
        super.grantRole(role, account);
        if (role == MINTER_ROLE) {
            address[] memory addresses = new address[](1);
            addresses[0] = account;
            _addToWhitelist(addresses);
        }
    }

    function revokeRole(bytes32 role, address account)
        public
        virtual
        override
        onlyRole(getRoleAdmin(role))
    {
        super.revokeRole(role, account);
        if (role == MINTER_ROLE) {
            address[] memory addresses = new address[](1);
            addresses[0] = account;
            _removeFromWhitelist(addresses);
        }
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}
