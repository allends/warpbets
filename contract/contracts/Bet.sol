// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.27;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Bet {

    // Define what token we are taking
    IERC20 public sbatToken;
    address owner = msg.sender;

    // Expire the bet
    uint public creationTime = block.timestamp;
    uint public expirationTime;

    // Display Information about this bet
    string message;
    string optionA;
    string optionB;

    // Determining outcome
    bool public outcomeSet;
    bool public outcome; // true = outcome A wins, false = outcome B wins

    mapping(address => uint256) public stakesA;
    mapping(address => uint256) public stakesB;

    uint256 public totalStakesA;
    uint256 public totalStakesB;

    constructor(uint256 _betDuration) {
        expirationTime = block.timestamp + _betDuration;
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
    function putStake(address _sbatToken, bool _onOutcomeA, uint256 _amount) public beforeDeadline {
        sbatToken = IERC20(_sbatToken);
        require(_amount > 0, "Cannot stake 0");

        sbatToken.transferFrom(msg.sender, address(this), _amount);

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