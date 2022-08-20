// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "../extensions/ERC20Blacklist.sol";

contract Token1 is
    ERC20,
    ERC20Burnable,
    ERC20Snapshot,
    ERC20Blacklist,
    AccessControl,
    Pausable
{
    bytes32 public constant SNAPSHOT_ROLE = keccak256("SNAPSHOT_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    uint256 private _initialSupply;

    constructor(uint256 initialSupply_, address holderAddress_)
        ERC20("Token1", "TKN1")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SNAPSHOT_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);

        _mint(holderAddress_, initialSupply_);
        _initialSupply = initialSupply_;
    }

    function totalBurn() public view virtual returns (uint256) {
        return _initialSupply - totalSupply();
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _initialSupply;
    }

    function snapshot() public onlyRole(SNAPSHOT_ROLE) {
        _snapshot();
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function onWhitelistMode() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _onWhitelistMode();
    }

    function offWhitelistMode() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _offWhitelistMode();
    }

    function addToBlacklist(address[] calldata _addresses)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _addToBlacklist(_addresses);
    }

    function removeFromBlacklist(address[] calldata _addresses)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _removeFromBlacklist(_addresses);
    }

    function addToWhitelist(address[] calldata _addresses)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _addToWhitelist(_addresses);
    }

    function removeFromWhitelist(address[] calldata _addresses)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _removeFromWhitelist(_addresses);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Snapshot, ERC20Blacklist) whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }

    function _checkRole(bytes32 role, address account)
        internal
        view
        virtual
        override
    {
        if (!hasRole(role, account) && !hasRole(DEFAULT_ADMIN_ROLE, account)) {
            revert(
                string(
                    abi.encodePacked(
                        "AccessControl: account ",
                        Strings.toHexString(uint160(account), 20),
                        " is missing role ",
                        Strings.toHexString(uint256(role), 32),
                        " or ",
                        Strings.toHexString(uint256(DEFAULT_ADMIN_ROLE), 32)
                    )
                )
            );
        }
    }
}
