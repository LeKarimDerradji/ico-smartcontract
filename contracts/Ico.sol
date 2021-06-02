// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Aeternam.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Ico is Ownable {

    /**
    * @dev 
    * We define the token as a "state variable" that will be of the Type of the Contract 
    * so that the contract will inherit all the functionalities and implicit bytecodes of the 
    * Token contract.
    * */
    Aeternam private _aeternam;
    
   /* address private _owner; */

    /**
    * @dev
    * Here, we can set up a mapping to track the beneficiaries of the Ico
    * All the people that will buy the token during the Ico will be beneficiaries. 
    * */
    mapping(address => uint256) private _beneficiaries;   

    /**
    * @dev 
    * Here we need to set up two important storage variables to keep track of the begining of the Ico
    * And the end of the Ico. 
    * */
    uint256 private _icoStartTime;
    uint256 private _icoEndTime; 
    

    /**
    * @dev 
    * Last but not least, we need to set up the rate of which buyers will get tokens in comparaison to the amount 
    * of gwei that they put into the smart contract. 
    * */
    uint256 private _rate;
    
    /**
    * @dev 
    * This is were the Ico contract is deployed, inside the constructor, we pass as an argument : 
    * The address of the Smart Contract that is our Token, so that the functions can be avaible everywhere in our contract. 
    * The Rate, amount of Token for a given amount of Gwei.
    * The time, in epoch, when the Ico should begins.
    * The time, in epoch, when the Ico should end. 
    * */
    constructor(address aeternamAddress_
    /*uint256  icoStartTime_, 
    uint256 icoEndTime_, 
    uint256 rate_*/) Ownable()  {
        /* _icoStartTime = icoStartTime_;
         _icoEndTime = icoEndTime_;
         _rate = rate_;*/
         _aeternam = Aeternam(aeternamAddress_);
    }
    
    function returnString() public view onlyOwner returns(string memory)   {
        return "hello";
    }

    
    /*
    function buyTokens() public payable icoIsActive {
    uint256 weiAmount = msg.value; // Calculate tokens to sell
    uint256 tokens = weiAmount * rate
    
    emit BoughtTokens(msg.sender, tokens); // log event onto the blockchain
    raisedAmount = raisedAmount.add(msg.value); // Increment raised amount
    token.transfer(msg.sender, tokens); // Send tokens to buyer
    
    owner.transfer(msg.value);// Send money to owner
   }*/

}
