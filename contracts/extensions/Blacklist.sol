// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Context.sol";

// Tests for this contract are in the BasicToken.test.ts file
abstract contract Blacklist is Context {
    mapping(address => bool) blacklist;
    mapping(address => bool) whitelist;

    bool public isWhitelistRestrictionMode;

    event BlacklistAdded(address[] _addresses, address admin);
    event BlacklistRemoved(address[] _addresses, address admin);
    event WhitelistAdded(address[] _addresses, address admin);
    event WhitelistRemoved(address[] _addresses, address admin);
    event WhitelistEnabled(address admin);
    event WhitelistDisabled(address admin);

    function isAddressInBlacklist(address _address) public view returns (bool) {
        return blacklist[_address];
    }

    function isAddressInWhiteList(address _address) public view returns (bool) {
        return whitelist[_address];
    }

    function _onWhitelistMode() internal virtual {
        isWhitelistRestrictionMode = true;
        emit WhitelistEnabled(_msgSender());
    }

    function _offWhitelistMode() internal virtual {
        isWhitelistRestrictionMode = false;
        emit WhitelistDisabled(_msgSender());
    }

    function _addToBlacklist(address[] memory _addresses) internal virtual {
        for (uint256 i = 0; i < _addresses.length; i++) {
            blacklist[_addresses[i]] = true;
        }
        emit BlacklistAdded(_addresses, _msgSender());
    }

    function _removeFromBlacklist(address[] memory _addresses)
        internal
        virtual
    {
        for (uint256 i = 0; i < _addresses.length; i++) {
            blacklist[_addresses[i]] = false;
        }
        emit BlacklistRemoved(_addresses, _msgSender());
    }

    function _addToWhitelist(address[] memory _addresses) internal virtual {
        for (uint256 i = 0; i < _addresses.length; i++) {
            whitelist[_addresses[i]] = true;
        }
        emit WhitelistAdded(_addresses, _msgSender());
    }

    function _removeFromWhitelist(address[] memory _addresses)
        internal
        virtual
    {
        for (uint256 i = 0; i < _addresses.length; i++) {
            whitelist[_addresses[i]] = false;
        }
        emit WhitelistRemoved(_addresses, _msgSender());
    }
}
