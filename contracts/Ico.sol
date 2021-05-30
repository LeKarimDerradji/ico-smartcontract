// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Aeternam.sol";



contract Ico {

    address private _owner;
    mapping(address => uint256) private _beneficiaries;   
    uint256 private _unlockTime; 
    uint256 private _epochStartTime;
    uint256 private _rate;

    constructor(address owner_, 
    uint256 unlockTime_, 
    uint256 epochStartTime_, 
    uint256 rate_)  {
        _owner = owner_;
        _epochStartTime = epochStartTime_;
        _unlockTime = epochStartTime_ + unlockTime_;
        _rate = rate_;

    }
}
