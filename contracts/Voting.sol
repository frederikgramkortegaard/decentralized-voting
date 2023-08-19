// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Poll {
    address owner;
    bool paused = false;

    event VoteCast(address voter, string option);
    event PollEnded(string winner);
    event PollPaused();
    event PollUnpaused();

    string question;
    string[] options;

    uint256 totalVotes;
    uint256 totalOptions;
    string mostVotes;
    uint256 endtime;

    mapping(string => uint256) votes;
    mapping(address => bool) hasVoted;
    mapping(string => bool) isOption;

    constructor(
        string memory _question,
        string[] memory _options,
        uint256 _timelock
    ) {
        require(
            _options.length <= 32,
            "A poll can not have more than 32 options"
        );
        owner = msg.sender;
        options = _options;
        question = _question;

        if (_timelock != 0) {
            endtime = block.timestamp + _timelock;
        }

        totalOptions = _options.length;
        for (uint256 i = 0; i < _options.length; i++) {
            isOption[_options[i]] = true;
        }
    }

    modifier onlyOnce() {
        require(!hasVoted[msg.sender], "Already voted");
        _;
    }

    modifier hasNotEnded() {
        if (endtime != 0) {
            emit PollEnded(mostVotes);
            require(block.timestamp < endtime, "The poll has ended");
            _;
        } else {
            _;
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can do this");
        _;
    }

    modifier notPaused() {
        require(!paused, "The contract is paused");
        _;
    }

    function changePauseState() external onlyOwner {
        if (paused) {
            emit PollUnpaused();
        } else {
            emit PollPaused();
        }
        paused = !paused;
    }

    function vote(
        string memory _option
    ) external onlyOnce notPaused hasNotEnded returns (bool) {
        require(isOption[_option], "Not a valid option");
        votes[_option]++;

        if (votes[_option] >= votes[mostVotes]) {
            mostVotes = _option;
        }

        totalVotes++;
        hasVoted[msg.sender] = true;
        emit VoteCast(msg.sender, _option);
        return true;
    }

    function getVotes(string memory _option) external view returns (uint256) {
        require(isOption[_option], "Not a valid option");
        return (votes[_option]);
    }

    function getOptions() external view returns (string[] memory) {
        return options;
    }

    function getQuestion() external view returns (string memory) {
        return question;
    }

    function getWinner() external view returns (string memory) {
        return mostVotes;
    }

    function getTotalOptions() external view returns (uint256) {
        return totalOptions;
    }

    function getTotalVotes() external view returns (uint256) {
        return totalVotes;
    }
}

contract PollFactory {
    Poll[] public polls;
    event PollCreated(address pollAddress);

    constructor() {}

    function makePoll(
        string memory _question,
        string[] memory _options,
        uint256 _timelock
    ) external returns (address) {
        Poll poll = new Poll(_question, _options, _timelock);
        polls.push(poll);
        emit PollCreated(address(poll));
        console.log("----- poll:", address(poll));
        return address(poll);
    }

    function getPolls() external view returns (Poll[] memory) {
        return polls;
    }

    function getPoll(uint256 _index) external view returns (Poll) {
        return polls[_index];
    }

    function getPollsLength() external view returns (uint256) {
        return polls.length;
    }

    fallback() external payable {
        console.log("----- fallback:", msg.value);
    }

    receive() external payable {
        console.log("----- receive:", msg.value);
    }
}
