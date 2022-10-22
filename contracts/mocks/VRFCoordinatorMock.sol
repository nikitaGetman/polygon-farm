// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

// import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract VRFCoordinatorMock {
    struct Request {
        VRFConsumerBaseV2 sender;
        uint256[] randomWords;
    }

    Request[] public requests;
    uint256[] public randomWords;

    constructor() {}

    function requestRandomWords(
        bytes32 keyHash,
        uint64 subId,
        uint16 minimumRequestConfirmations,
        uint32 callbackGasLimit,
        uint32 numWords
    ) public returns (uint256 requestId) {
        Request memory request = Request(
            VRFConsumerBaseV2(msg.sender),
            randomWords
        );

        requests.push(request);
        return requests.length - 1;
    }

    function fulfillRequest(uint256 requestId) public {
        Request storage request = requests[requestId];
        request.sender.rawFulfillRandomWords(requestId, request.randomWords);
    }

    function setRandomWords(uint256[] memory _randomWords) public {
        randomWords = _randomWords;
    }
}
