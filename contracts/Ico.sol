// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Aeternam.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ICO Smart Contract
/// @author LeKarimDerradji
/// @notice We define the token as a "state variable" that will be of the Type of the Contract 
/// @dev so that the contract will inherit all the functionalities and implicit bytecodes of the 
/// Token contract.
contract Ico is Ownable {

    using Address for address payable;

    Aeternam private _aeternam;

    /**
    * @dev 
    * This variable sets the duration of the ICO 
    */
    uint256 private _icoDuration;
    

    /**
    * @dev 
    * Last but not least, we need to set up the rate of which buyers will get tokens in comparaison to the amount 
    * of gwei that they put into the smart contract. 
    */
    uint256 private _rate;

    event TokenBuyed(address indexed investor, uint256 amount);
    event Withdrew(address indexed icoWwallet, uint256 amount);
    
    /**
    * @dev 
    *@param aeternamAddress_ is for the address of the token to be passed in
    *@param rate_ is for the rate of exchange for the token to be buyed
    * This is were the Ico contract is deployed, inside the constructor, we pass as an argument : 
    * The address of the Smart Contract that is our Token, so that the functions can be avaible everywhere in our contract. 
    * The Rate, amount of Token for a given amount of Gwei.
    */
    constructor(
        address aeternamAddress_,
        uint256 rate_) Ownable()  {
             _icoDuration = block.timestamp + 1 weeks;
             _rate = rate_;
             _aeternam = Aeternam(aeternamAddress_);
    }
    /**
    *@dev
    * modifier for when the ico is over
    * */
    modifier icoIsOver {
        require(block.timestamp >= _icoDuration, "ICO: Ico is not over yet");
        _;
    }

    
    /**
    *@dev
    * The function buy tokens takes no parameters, the user buy some tokens by sending wei, 
    * it gets converted to gwei, where 1 gwei equals 1 token
    * then it transfers the token from the aeternam contract to the users wallet
    * */
    function buyTokens() public payable {
        require(msg.sender != owner(),"ICO : The owner of Ico can't buy tokens!");
        require(_aeternam.allowance(_aeternam.owner(), address(this)) > 10000000000, "ICO : aeternam is not being sold yet.");
        uint256 amount = msg.value * _rate;
        // Rate is for how many ether units, how many tokens I get. 
        _aeternam.transferFrom(_aeternam.owner(), msg.sender, amount); 
        emit TokenBuyed(msg.sender, amount);
   } 
    /**
    *@dev
    * function for the owner to withdraw their profit
    * */
     function withdrawProfit() public onlyOwner icoIsOver {
        require(address(this).balance > 0, "ICO: cannot withdraw 0 ether");
        uint256 amount = address(this).balance;
        payable(msg.sender).sendValue(amount);
        emit Withdrew(msg.sender, amount);
    }
    /**
    *@dev shows the balance in wei into the ico contract
    * */
    function balanceOfIco() public view returns(uint256) {
        return address(this).balance;
    }
    /**
    *@dev shows the remaining token the ico contract can spend
    *
    * */
    function remainingToken() public view returns(uint256) {
        return _aeternam.allowance(_aeternam.owner(), address(this));
    }

}
