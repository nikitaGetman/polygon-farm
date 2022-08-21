// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract SwapTokens is Context, AccessControl {
    using SafeERC20 for ERC20;

    uint256 private SWAP_RATE_DIVIDER = 100;
    uint256 private _swapRate; // divide to SWAP_RATE_DIVIDER
    bool private _isSellAvailable;

    ERC20 private _token1;
    address private _token1Pool;
    ERC20 private _token2;
    address private _token2Pool;

    constructor(
        address token1Address_,
        address token1Pool_,
        address token2Address_,
        address token2Pool_,
        uint256 swapRate_
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _swapRate = swapRate_;

        _token1 = ERC20(token1Address_);
        _token2 = ERC20(token2Address_);

        _token1Pool = token1Pool_;
        _token2Pool = token2Pool_;
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

    function setToken1Pool(address pool) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _token1Pool = pool;
    }

    function setToken2Pool(address pool) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _token2Pool = pool;
    }

    // TODO: что случиться при разных decimals у токенов?
    function estimateToken1ForToken2(uint256 amount)
        public
        view
        returns (uint256)
    {
        return (amount * _swapRate) / SWAP_RATE_DIVIDER;
    }

    // TODO: test with 0, 1, and other amount values
    function estimateToken2ForToken1(uint256 amount)
        public
        view
        returns (uint256)
    {
        return (amount * SWAP_RATE_DIVIDER) / _swapRate;
    }

    function getToken1ForToken2(uint256 amount) public {
        require(
            _token2.allowance(_msgSender(), address(this)) >= amount,
            "Not enough allowance token2"
        );
        uint256 amountToBuy = estimateToken1ForToken2(amount);

        require(
            _token1.allowance(_token1Pool, address(this)) >= amountToBuy,
            "Not enough allowance token1"
        );
        require(
            _token1.balanceOf(_token1Pool) >= amountToBuy,
            "Not enough balance token1"
        );

        _token2.safeTransferFrom(_msgSender(), _token2Pool, amount);
        _token1.safeTransferFrom(_token1Pool, _msgSender(), amountToBuy);
    }

    function getToken2ForToken1(uint256 amount) public {
        require(_isSellAvailable, "Selling is not available");

        require(
            _token1.allowance(_msgSender(), address(this)) >= amount,
            "Not enough allowance token1"
        );
        uint256 amountToBuy = estimateToken2ForToken1(amount);

        require(
            _token2.allowance(_token2Pool, address(this)) >= amountToBuy,
            "Not enough allowance token2"
        );
        require(
            _token2.balanceOf(_token2Pool) >= amountToBuy,
            "Not enough balance token2"
        );

        _token1.safeTransferFrom(_msgSender(), _token1Pool, amount);
        _token2.safeTransferFrom(_token2Pool, _msgSender(), amountToBuy);
    }
}
