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
    constructor(address aeternamAddress_,
    uint256  icoStartTime_, 
    uint256 icoEndTime_) Ownable()  {
         _icoStartTime = icoStartTime_;
         _icoEndTime = icoEndTime_;
         _rate = 1 gwei;
         _aeternam = Aeternam(aeternamAddress_);
    }
    
    function returnString() public view onlyOwner returns(string memory)   {
        return "hello";
    }

    modifier icoIsActive {
        require(
            _icoStartTime >= block.timestamp && _icoEndTime <= block.timestamp,
            "Ico : the Ico is either not active yet or already ended."
        );
        _;
    }

    
    
    function buyTokens() public payable icoIsActive {
        require(msg.sender != owner(),"Ico : The owner Ico can't buy tokens!");
        require(msg.sender != _aeternam.owner(), "Ico : the owner of the token can't buy tokens!");
        uint256 purchaseInWei = msg.value; // Calculate tokens to sell
        uint256 purchaseInGwei = purchaseInWei / _rate;
    
        _aeternam.transfer(msg.sender, purchaseInGwei); // Send tokens to buyer
    
   }

}
