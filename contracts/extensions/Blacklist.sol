// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

abstract contract Blacklist is Context {
    mapping(address => bool) blacklist;
    mapping(address => bool) whitelist;

    bool public isWhitelistRestrictionMode;

    function isAddressInBlacklist(address _address) public view returns (bool) {
        return blacklist[_address];
    }

    function isAddressInWhiteList(address _address) public view returns (bool) {
        return whitelist[_address];
    }

    function _onWhitelistMode() internal virtual {
        isWhitelistRestrictionMode = true;
    }

    function _offWhitelistMode() internal virtual {
        isWhitelistRestrictionMode = false;
    }

    function _addToBlacklist(address[] calldata _addresses) internal virtual {
        for (uint256 i = 0; i < _addresses.length; i++) {
            blacklist[_addresses[i]] = true;
        }
    }

    function _removeFromBlacklist(address[] calldata _addresses)
        internal
        virtual
    {
        for (uint256 i = 0; i < _addresses.length; i++) {
            blacklist[_addresses[i]] = false;
        }
    }

    function _addToWhitelist(address[] calldata _addresses) internal virtual {
        for (uint256 i = 0; i < _addresses.length; i++) {
            whitelist[_addresses[i]] = true;
        }
    }

    function _removeFromWhitelist(address[] calldata _addresses)
        internal
        virtual
    {
        for (uint256 i = 0; i < _addresses.length; i++) {
            whitelist[_addresses[i]] = false;
        }
    }
}
