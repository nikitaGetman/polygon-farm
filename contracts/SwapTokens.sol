// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract SwapTokens is Context, AccessControl, Pausable {
    using SafeERC20 for ERC20;

    uint256 private SWAP_RATE_DIVIDER = 100;
    uint256 private _swapRate; // divide on SWAP_RATE_DIVIDER
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

    function setToken1Pool(address pool) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _token1Pool = pool;
    }

    function setToken2Pool(address pool) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _token2Pool = pool;
    }

    function getReserveToken1() public view returns (uint256) {
        return _token1.balanceOf(_token1Pool);
    }

    function getReserveToken2() public view returns (uint256) {
        return _token2.balanceOf(_token2Pool);
    }

    // TODO: что случиться при разных decimals у токенов?
    function getEquivalentToken2Estimate(uint256 _amountToken1)
        public
        view
        returns (uint256)
    {
        return (_amountToken1 * SWAP_RATE_DIVIDER) / _swapRate;
    }

    function getEquivalentToken1Estimate(uint256 _amountToken2)
        public
        view
        returns (uint256)
    {
        return (_amountToken2 * _swapRate) / SWAP_RATE_DIVIDER;
    }

    function buyToken2ForToken1(uint256 _amountToken1) public whenNotPaused {
        uint256 amountToBuy = getEquivalentToken2Estimate(_amountToken1);
        require(amountToBuy > 0, "Insufficient amount");
        require(
            _token1.allowance(_msgSender(), address(this)) >= _amountToken1,
            "Not enough allowance token1"
        );
        require(
            _token2.allowance(_token2Pool, address(this)) >= amountToBuy,
            "Not enough pool allowance - token2"
        );
        require(
            _token2.balanceOf(_token2Pool) >= amountToBuy,
            "Not enough pool balance - token2"
        );

        _token1.safeTransferFrom(_msgSender(), _token1Pool, _amountToken1);
        _token2.safeTransferFrom(_token2Pool, _msgSender(), amountToBuy);
    }

    function buyToken1ForToken2(uint256 _amountToken2) public whenNotPaused {
        require(_isSellAvailable, "Selling is not available");

        uint256 amountToBuy = getEquivalentToken1Estimate(_amountToken2);
        require(amountToBuy > 0, "Insufficient amount");

        require(
            _token2.allowance(_msgSender(), address(this)) >= _amountToken2,
            "Not enough allowance token2"
        );
        require(
            _token1.allowance(_token1Pool, address(this)) >= amountToBuy,
            "Not enough pool allowance - token1"
        );
        require(
            _token1.balanceOf(_token1Pool) >= amountToBuy,
            "Not enough pool balance - token1"
        );

        _token2.safeTransferFrom(_msgSender(), _token2Pool, _amountToken2);
        _token1.safeTransferFrom(_token1Pool, _msgSender(), amountToBuy);
    }
}
