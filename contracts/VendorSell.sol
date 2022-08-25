// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract VendorSell is Context, AccessControl, Pausable {
    using SafeERC20 for ERC20;

    uint256 private SWAP_RATE_DIVIDER = 100;
    uint256 private _swapRate; // divide on SWAP_RATE_DIVIDER
    bool private _isSellAvailable;

    ERC20 private _token;
    address private _tokenPool;
    ERC20 private _changeToken;
    address private _changeTokenPool;

    event BuyTokens(
        address indexed buyer,
        uint256 amountToken,
        uint256 amountChangeToken
    );
    event SellTokens(
        address indexed seller,
        uint256 amountToken,
        uint256 amountChangeToken
    );

    constructor(
        address tokenAddress_,
        address tokenPool_,
        address changeTokenAddress_,
        address changeTokenPool_,
        uint256 swapRate_
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _swapRate = swapRate_;

        _token = ERC20(tokenAddress_);
        _changeToken = ERC20(changeTokenAddress_);

        _tokenPool = tokenPool_;
        _changeTokenPool = changeTokenPool_;
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function isSellAvailable() public view returns (bool) {
        return _isSellAvailable;
    }

    function enableSell() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _isSellAvailable = true;
    }

    function disableSell() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _isSellAvailable = false;
    }

    function setTokenPool(address pool) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _tokenPool = pool;
    }

    function setChangeTokenPool(address pool)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _changeTokenPool = pool;
    }

    function getTokenReserve() public view returns (uint256) {
        return _token.balanceOf(_tokenPool);
    }

    function getChangeTokenReserve() public view returns (uint256) {
        return _changeToken.balanceOf(_changeTokenPool);
    }

    // TODO: что случиться при разных decimals у токенов?
    function getEquivalentChangeTokenEstimate(uint256 _amountToken)
        public
        view
        returns (uint256)
    {
        return (_amountToken * SWAP_RATE_DIVIDER) / _swapRate;
    }

    function getEquivalentTokenEstimate(uint256 _amountChangeToken)
        public
        view
        returns (uint256)
    {
        return (_amountChangeToken * _swapRate) / SWAP_RATE_DIVIDER;
    }

    // @params: _amountChangeToken - how much user spend
    function buyTokens(uint256 _amountChangeToken) public whenNotPaused {
        uint256 _amountToken = getEquivalentTokenEstimate(_amountChangeToken);
        require(_amountToken > 0, "Insufficient amount");

        require(
            _changeToken.allowance(_msgSender(), address(this)) >=
                _amountChangeToken,
            "User allowance of token is not enough"
        );
        require(
            _changeToken.balanceOf(_msgSender()) >= _amountChangeToken,
            "User balance of token is not enough"
        );
        require(
            _token.allowance(_tokenPool, address(this)) >= _amountToken,
            "Vendor allowance of token is not enough"
        );
        require(
            _token.balanceOf(_tokenPool) >= _amountToken,
            "Vendor balance of token is not enough"
        );

        _changeToken.safeTransferFrom(
            _msgSender(),
            _changeTokenPool,
            _amountChangeToken
        );
        _token.safeTransferFrom(_tokenPool, _msgSender(), _amountToken);

        emit BuyTokens(_msgSender(), _amountToken, _amountChangeToken);
    }

    // @params: _amountToken - how much user spend
    function sellTokens(uint256 _amountToken) public whenNotPaused {
        require(_isSellAvailable, "Selling is not available");

        uint256 _amountChangeToken = getEquivalentChangeTokenEstimate(
            _amountToken
        );
        require(_amountChangeToken > 0, "Insufficient amount");
        require(
            _token.allowance(_msgSender(), address(this)) >= _amountToken,
            "User allowance of token is not enough"
        );
        require(
            _token.balanceOf(_msgSender()) >= _amountToken,
            "User balance of token is not enough"
        );
        require(
            _changeToken.allowance(_changeTokenPool, address(this)) >=
                _amountChangeToken,
            "Vendor allowance of change token is not enough"
        );
        require(
            _changeToken.balanceOf(_changeTokenPool) >= _amountChangeToken,
            "Vendor balance of change token is not enough"
        );

        _token.safeTransferFrom(_msgSender(), _tokenPool, _amountToken);
        _changeToken.safeTransferFrom(
            _changeTokenPool,
            _msgSender(),
            _amountChangeToken
        );

        emit SellTokens(_msgSender(), _amountToken, _amountChangeToken);
    }
}
