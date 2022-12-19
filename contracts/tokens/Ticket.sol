// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../extensions/ContextMixin.sol";

contract Ticket is
    ERC1155,
    ERC1155Burnable,
    ERC1155Supply,
    IERC2981,
    AccessControl,
    Pausable,
    ContextMixin
{
    using Strings for uint256;
    string public name;
    string public symbol;
    address private _recipient;
    uint256 private _royalty;

    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor()
        ERC1155(
            "https://bafkreidpjakpjd5o3rwmbwwdrc6czdtgn6ylxvzio6bmxcf7zllpzwqhvy.ipfs.nftstorage.link/"
        )
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(URI_SETTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        name = "iSaver Raffle Ticket";
        symbol = "SAVRT";
        _recipient = msg.sender;
        _royalty = 100;
    }

    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    /** @dev EIP2981 royalties implementation. */

    // Maintain flexibility to modify royalties recipient (could also add basis points).
    function _setRoyalties(address newRecipient)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            newRecipient != address(0),
            "Royalties: new recipient is the zero address"
        );
        _recipient = newRecipient;
    }

    function setRoyaltyPercent(uint256 percentBasePoints)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _royalty = percentBasePoints;
    }

    // EIP2981 standard royalties return.
    function royaltyInfo(uint256 _tokenId, uint256 _salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        return (_recipient, (_salePrice * _royalty) / 10000);
    }

    // EIP2981 standard Interface return. Adds to ERC1155 and ERC165 Interface returns.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, IERC165, AccessControl)
        returns (bool)
    {
        return (interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId));
    }

    /** @dev Meta-transactions override for OpenSea. */

    function _msgSender() internal view override returns (address) {
        return ContextMixin.msgSender();
    }

    /** @dev Contract-level metadata for OpenSea. */

    // Update for collection-specific metadata.
    function contractURI() public pure returns (string memory) {
        return
            "https://bafkreidpjakpjd5o3rwmbwwdrc6czdtgn6ylxvzio6bmxcf7zllpzwqhvy.ipfs.nftstorage.link/"; // Contract-level metadata for ParkPics
    }
}
