// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract VendorSell is Context, AccessControl, Pausable {
    using SafeERC20 for IERC20;

    uint256 public DIVIDER = 1000;
    uint256 private TOKEN_DECIMALS = 18;
    uint256 private CHANGE_TOKEN_DECIMALS = 6; // USDT decimals

    uint256 public swapRate; // div by DIVIDER
    uint256 public sellTokenFee = 100; // 10%
    bool private _isSellAvailable;

    IERC20 public token;
    address private _tokenPool;
    IERC20 public changeToken;
    address private _changeTokenPool;

    event TokensPurchased(
        address indexed buyer,
        uint256 amountToken,
        uint256 amountChangeToken
    );
    event TokensSold(
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
        swapRate = swapRate_;

        token = IERC20(tokenAddress_);
        changeToken = IERC20(changeTokenAddress_);

        _tokenPool = tokenPool_;
        _changeTokenPool = changeTokenPool_;
    }

    // @params: _amountChangeToken - how much user spend
    function buyTokens(uint256 _amountChangeToken) public whenNotPaused {
        uint256 _amountToken = getEquivalentTokenEstimate(_amountChangeToken);
        require(_amountToken > 0, "Insufficient amount");
        require(
            token.balanceOf(_tokenPool) >= _amountToken,
            "Not enough tokens in exchange pool"
        );

        changeToken.safeTransferFrom(
            _msgSender(),
            _changeTokenPool,
            _amountChangeToken
        );
        token.safeTransferFrom(_tokenPool, _msgSender(), _amountToken);

        emit TokensPurchased(_msgSender(), _amountToken, _amountChangeToken);
    }

    // @params: _amountToken - how much user spend
    function sellTokens(uint256 _amountToken) public whenNotPaused {
        require(_isSellAvailable, "Selling is not available");

        uint256 _amountChangeTokenWithFee = getEquivalentChangeTokenEstimate(
            _amountToken
        );
        uint256 fee = (_amountChangeTokenWithFee * sellTokenFee) / DIVIDER;
        uint256 _amountChangeToken = _amountChangeTokenWithFee - fee;

        require(_amountChangeToken > 0, "Insufficient amount");
        require(
            changeToken.balanceOf(_changeTokenPool) >= _amountChangeToken,
            "Not enough tokens in exchange pool"
        );

        token.safeTransferFrom(_msgSender(), _tokenPool, _amountToken);
        changeToken.safeTransferFrom(
            _changeTokenPool,
            _msgSender(),
            _amountChangeToken
        );

        emit TokensSold(_msgSender(), _amountToken, _amountChangeToken);
    }

    // --------- Helper functions ---------
    function getTokenReserve() public view returns (uint256) {
        return token.balanceOf(_tokenPool);
    }

    function getChangeTokenReserve() public view returns (uint256) {
        return changeToken.balanceOf(_changeTokenPool);
    }

    // !important: hope that decimals of tokens are the same
    function getEquivalentChangeTokenEstimate(uint256 _amountToken)
        public
        view
        returns (uint256)
    {
        return
            (((_amountToken * DIVIDER) / swapRate) *
                10**CHANGE_TOKEN_DECIMALS) / 10**TOKEN_DECIMALS;
    }

    // !important: hope that decimals of tokens are the same
    function getEquivalentTokenEstimate(uint256 _amountChangeToken)
        public
        view
        returns (uint256)
    {
        return
            (((_amountChangeToken * swapRate) / DIVIDER) * 10**TOKEN_DECIMALS) /
            10**CHANGE_TOKEN_DECIMALS;
    }

    function isSellAvailable() public view returns (bool) {
        return _isSellAvailable;
    }

    // --------- Administrative functions ---------
    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function enableSell() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _isSellAvailable = true;
    }

    function disableSell() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _isSellAvailable = false;
    }

    function updateTokenPool(address pool) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _tokenPool = pool;
    }

    function updateSwapRate(uint256 swapRate_)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        swapRate = swapRate_;
    }

    function updateSellFee(uint256 sellTokenFee_)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        sellTokenFee = sellTokenFee_;
    }

    function updateChangeTokenPool(address pool)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _changeTokenPool = pool;
    }

    function updateToken(IERC20 token_) public onlyRole(DEFAULT_ADMIN_ROLE) {
        token = token_;
    }

    function updateChangeToken(IERC20 token_)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        changeToken = token_;
    }
}
