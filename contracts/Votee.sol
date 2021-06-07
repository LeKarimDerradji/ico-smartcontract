//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./Aeternam.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// Deploy token
// Deploy ico
// Run ico
// Deploy votee
// Owner votre, revert.
// Alice allow votee 
// Alice vote, too much revert.
// Alice vote, too low revert.
// Alice vote, check if hasVoted(alice.address) returns true.
// 
contract Votee is Ownable {

    Aeternam private _aeternam;

    mapping(address => bool) private _hasVoted;

    uint256 private _votesForBurn;
    
    event VotedForBurn(address indexed votee, bool hasVoted);

    constructor(address aeternamAddress_) {
        _aeternam = Aeternam(aeternamAddress_);
    }

    modifier votingGuard {
        require(_hasVoted[msg.sender] == false, "Votee: the user already voted");
        require(_aeternam.balanceOf(msg.sender) > 0, "Votee: you need to own Aeternam Token to be able to vote");
        require(msg.sender != this.owner(), "Votee: the votee can not be the owner");
        _;
    }

    function voteForBurn(uint256 amount_) public votingGuard  {
        require(amount_ == 1, "Votee: to be able to vote, you should send one token");
        _hasVoted[msg.sender] = true;
        _votesForBurn += 1;
        _aeternam.transferFrom(msg.sender, address(this), amount_);
        emit VotedForBurn(msg.sender, _hasVoted[msg.sender]);
    }

    function hasVoted(address account) public view returns(bool) {
        return _hasVoted[account];
    }

    function amountOfVote() public view returns(uint256) {
        return _votesForBurn;
    }

}

