// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "./BasicToken.sol";

contract Token1 is BasicToken, ERC20Snapshot {
    bytes32 public constant SNAPSHOT_ROLE = keccak256("SNAPSHOT_ROLE");

    constructor(uint256 initialSupply_, address holderAddress_)
        BasicToken(initialSupply_, holderAddress_, "Test SAV", "TSAV")
    {
        _grantRole(SNAPSHOT_ROLE, _msgSender());
    }

    function snapshot() public onlyRole(SNAPSHOT_ROLE) {
        _snapshot();
    }

    function snapshotCount()
        public
        view
        onlyRole(SNAPSHOT_ROLE)
        returns (uint256)
    {
        return _getCurrentSnapshotId();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(BasicToken, ERC20Snapshot) whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }

    function _mint(address account, uint256 amount)
        internal
        virtual
        override(BasicToken, ERC20)
    {
        super._mint(account, amount);
    }
}
