// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Context.sol";
import "../tokens/Token1.sol";

// Tests for this contract are in the Staking.test.ts file
contract Subscribable is Context {
    uint256 public subscriptionCost;
    uint256 public subscriptionPeriodDays;

    mapping(address => uint256) public subscribers;

    Token1 public subscriptionToken;

    constructor(
        address token_,
        uint256 cost_,
        uint256 periodDays_
    ) {
        require(
            cost_ > 0,
            "Subscribable: subscription cost should be greater than 0"
        );
        require(
            periodDays_ > 0,
            "Subscribable: subscription period should be greater than 0"
        );
        subscriptionToken = Token1(token_);
        subscriptionCost = cost_;
        subscriptionPeriodDays = periodDays_;
    }

    modifier subscribersOnly() virtual {
        require(
            isSubscriber(_msgSender()),
            "Subscribable: you are not subscribed"
        );
        _;
    }

    function _subscribe(address addr_) internal virtual {
        subscriptionToken.burnFrom(addr_, subscriptionCost);
        subscribers[addr_] = block.timestamp + subscriptionPeriodDays * 1 days;
    }

    // --------- Helper functions ---------
    function isSubscriber(address addr_) public view virtual returns (bool) {
        return subscribers[addr_] >= block.timestamp;
    }

    function isSubscriber() public view virtual returns (bool) {
        return isSubscriber(_msgSender());
    }

    // --------- Administrative functions ---------
    function _updateSubscriptionCost(uint256 cost_) internal {
        subscriptionCost = cost_;
    }

    function _updateSubscriptionPeriod(uint256 periodDays_) internal {
        subscriptionPeriodDays = periodDays_;
    }

    function _updateSubscriptionToken(address token_) internal {
        subscriptionToken = Token1(token_);
    }
}
