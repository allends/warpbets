// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.27;
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Bet {

    // Define what token we are taking
    IERC20 public sbatToken;
    address owner = msg.sender;

    // Expire the bet
    uint public creationTime = block.timestamp;
    uint public expirationTime;

    // Display Information about this bet
    string public message;
    string public optionA;
    string public optionB;

    // Determining outcome (hard coded for now, this won't get 10,000 bets :( unfortunately)
    bool public outcomeSet = true;
    bool public outcome = false; // true = outcome A wins, false = outcome B wins

    mapping(address => uint256) public stakesA;
    mapping(address => uint256) public stakesB;

    uint256 public totalStakesA;
    uint256 public totalStakesB;

    constructor(uint256 _expirationTime, string memory _message, string memory _optionA, string memory _optionB) {
        sbatToken = IERC20(0x48ebb7cb09F1D4753C1d3A35c55d2507c64D34cb);
        expirationTime = _expirationTime;
        message = _message;
        optionA = _optionA;
        optionB = _optionB;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier beforeDeadline() {
        require(block.timestamp < expirationTime, "Staking deadline has passed");
        _;
    }

    modifier afterDeadline() {
        require(block.timestamp >= expirationTime, "Deadline not yet reached");
        _;
    }

    modifier outcomeHasBeenSet() {
        require(outcomeSet, "Outcome not yet set");
        _;
    }

    // Function for users to stake SBAT on outcome A (true) or B (false)
    function putStake(bool _onOutcomeA, uint256 _amount) public beforeDeadline {
        require(_amount > 0, "Cannot stake 0");

        bool result = sbatToken.transferFrom(msg.sender, address(this), _amount);
        require(result, "Transfer failed");

        if (_onOutcomeA) {
            stakesA[msg.sender] += _amount;
            totalStakesA += _amount;
        } else {
            stakesB[msg.sender] += _amount;
            totalStakesB += _amount;
        }
    }

    // Function for owner to set the final outcome
    function setOutcome(bool _outcome) public onlyOwner afterDeadline {
        require(!outcomeSet, "Outcome already set");
        outcome = _outcome;
        outcomeSet = true;
    }

    // Function for users to withdraw their winnings based on the correct outcome
    function withdraw() public afterDeadline outcomeHasBeenSet {
        uint256 stake;
        uint256 reward;

        if (outcome) {
            // Outcome A wins
            stake = stakesA[msg.sender];
            require(stake > 0, "No stake on the winning outcome");
            reward = stake + (stake * totalStakesB / totalStakesA); // Proportional reward from losing side
            stakesA[msg.sender] = 0;
        } else {
            // Outcome B wins
            stake = stakesB[msg.sender];
            require(stake > 0, "No stake on the winning outcome");
            reward = stake + (stake * totalStakesA / totalStakesB); // Proportional reward from losing side
            stakesB[msg.sender] = 0;
        }

        sbatToken.transfer(msg.sender, reward);
    }
}