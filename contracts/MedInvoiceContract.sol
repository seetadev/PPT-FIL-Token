// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract MedInvoiceContract is Ownable, ReentrancyGuard {
    mapping(address => string[]) private fileList;
    IERC20 public immutable pptToken;
    uint256 public constant SUBSCRIPTION_AMOUNT = 10 * 10**18;
    uint256 public constant SUBSCRIPTION_PERIOD = 365 days;
    mapping(address => uint256) public subscriptionEndTimes;

    event FileSaved(address indexed user, string file, uint256 timestamp);
    event NewSubscription(address indexed subscriber, uint256 endTime);

    constructor(address _pptToken) Ownable(msg.sender) {
        pptToken = IERC20(_pptToken);
    }

    function saveFile(string memory file) public {
        require(bytes(file).length > 0, "File content cannot be empty");
        require(pptToken.balanceOf(msg.sender) >= 1, "You need to hold a MediToken to save.");
        fileList[msg.sender].push(file);
        emit FileSaved(msg.sender, file, block.timestamp);
    }

    function getFiles() public view returns (string[] memory) {
        require(pptToken.balanceOf(msg.sender) >= 1, "You need to hold a MediToken to view saved files.");
        return fileList[msg.sender];
    }
    
    function getUserTokens() public view returns (uint256) {
        return pptToken.balanceOf(msg.sender);
    }

    function isSubscribed(address user) public view returns (bool) {
        return subscriptionEndTimes[user] > block.timestamp;
    }

    function getSubscriptionDetails() public view returns (
        bool exists,
        uint256 endTime
    ) {
        uint256 userEndTime = subscriptionEndTimes[msg.sender];
        exists = userEndTime > 0;
        endTime = userEndTime;
        return (exists, endTime);
    }

    function getSubscriptionEndDate(address user) public view returns (uint256) {
        return subscriptionEndTimes[user];
    }
    
    function subscribe() external nonReentrant {
        require(!isSubscribed(msg.sender), "Already subscribed");
        require(pptToken.transfer(msg.sender, SUBSCRIPTION_AMOUNT), "Token transfer failed");
        

        uint256 endTime = block.timestamp + SUBSCRIPTION_PERIOD;
        subscriptionEndTimes[msg.sender] = endTime;
        
        emit NewSubscription(msg.sender, endTime);
    }

    function withdrawTokens(uint256 amount) external onlyOwner {
        require(pptToken.transfer(owner(), amount), "Token withdrawal failed");
    }
}
