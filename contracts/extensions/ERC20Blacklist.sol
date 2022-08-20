// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Blacklist.sol";

abstract contract ERC20Blacklist is ERC20, Blacklist {
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        if (isWhitelistRestrictionMode) {
            require(
                !whitelist[from] && !whitelist[_msgSender()] && !whitelist[to],
                "Whitelist: sender or receiver is not in whitelist"
            );
        }
        require(!blacklist[from], "Blacklist: sender is in blacklist");
        require(!blacklist[to], "Blacklist: receiver is in blacklist");
        require(
            !blacklist[_msgSender()],
            "Blacklist: message sender is in blacklist"
        );
        super._beforeTokenTransfer(from, to, amount);
    }
}
