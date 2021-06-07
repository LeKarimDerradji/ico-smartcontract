// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Aeternam.sol";

/**
 * @title Calculator - Interoperability with Token Aeternam
 * @author LeKarimDerradji
 * @dev a simple calculator that can be used only by spending some aeternam to call its functions 
 */
contract Calculator {
    Aeternam private _aeternam;
    address private _owner;

    uint256 private _fee = 1 ether;

    event Calculated(string calc, address indexed user, int256 nb1, int256 nb2, int256 result);

    /**
     * @dev set the tokenAddress and owner at deployment
     * tokenAddress is use to check users balance and transfer the fee to the owner account
     * @param  aeternamAddress_ ERC20 Token that will be used in this smart contract
     * @param owner_ the owner of this smart contract
     */
    constructor(address aeternamAddress_, address owner_) {
        _aeternam = Aeternam(aeternamAddress_);
        _owner = owner_;
    }

    modifier payementChecker() {
        require(
            _aeternam.balanceOf(msg.sender) >= 1 ether,
            "Calculator: you do not have enough aeternam to use this function"
        );
        require(
            _aeternam.allowance(msg.sender, address(this)) >= 1 ether,
            "Calculator: you need to approve this smart contract for at least 1 aeternam before using it"
        );
        _;
    }

    /**
    *@dev 
    * Setting up a modifer for the withdraw function
    */

    modifier onlyOwner() {
        require(msg.sender == _owner, "Calculator: only owner can call this function.");
        _;
    }

    /**
     * @dev Calculate a sum, transfer the tokens to the owner and emit an event
     * User need to possess at least one Aeternam and approve this contract before hand
     * @param nb1 a number
     * @param nb2 a number
     * @return The sum of the 2 params
     */
    function add(int256 nb1, int256 nb2) public returns (int256) {
        _aeternam.transferFrom(msg.sender, address(this), _fee);
        emit Calculated("Addition", msg.sender, nb1, nb2, nb1 + nb2);
        return nb1 + nb2;
    }

    /**
     * @dev Calculate a substraction, transfer the fee to the owner and emit an event
     * User need to possess at least one Aeternam and approve this contract before hand
     * @param nb1 a number
     * @param nb2 a number
     * @return The substraction of the 2 params
     */
    function sub(int256 nb1, int256 nb2) public payementChecker returns (int256) {
        _aeternam.transferFrom(msg.sender, address(this), _fee);
        emit Calculated("Substraction", msg.sender, nb1, nb2, nb1 - nb2);
        return nb1 - nb2;
    }

    /**
     * @dev Calculate a multiplication, transfer the fee to the owner and emit an event
     * User need to possess at least one Aeternam and approve this contract before hand
     * @param nb1 a number
     * @param nb2 a number
     * @return The multiplication of the 2 params
     */
    function mul(int256 nb1, int256 nb2) public payementChecker returns (int256) {
        _aeternam.transferFrom(msg.sender, address(this), _fee);
        emit Calculated("Multiplication", msg.sender, nb1, nb2, nb1 * nb2);
        return nb1 * nb2;
    }

    /**
     * @dev Calculate a division, transfer the fee to the owner and emit an event
     * User need to possess at least one Aeternam and approve this contract before hand
     * @param nb1 a number
     * @param nb2 a number
     * @return The division of the 2 params
     */
    function div(int256 nb1, int256 nb2) public payementChecker returns (int256) {
        require(nb2 != 0, "Calculator: can not divide by zero");
        _aeternam.transferFrom(msg.sender, address(this), _fee);
        emit Calculated("Division", msg.sender, nb1, nb2, nb1 / nb2);
        return nb1 / nb2;
    }

    /**
     * @dev Calculate a modulo, transfer the fee to the owner and emit an event
     * User need to possess at least one Aeternam and approve this contract before hand
     * @param nb1 a number
     * @param nb2 a number
     * @return The modulo of the 2 params
     */
    function mod(int256 nb1, int256 nb2) public payementChecker returns (int256) {
        require(nb2 != 0, "Calculator: can not modulus by zero");
        _aeternam.transferFrom(msg.sender, address(this), _fee);
        emit Calculated("Modulus", msg.sender, nb1, nb2, nb1 % nb2);
        return nb1 % nb2;
    }

    /**
    *@dev 
    * Now that we set up everything
    * We need to set up a withdraw function in order for the owner to withdraw his funds (in Token)
    * */

    function withdraw() public onlyOwner {
        require(_aeternam.balanceOf(address(this)) > 0, "Calculator : the contract contains 0 aeternam");
        uint256 total = _aeternam.balanceOf(address(this));
        _aeternam.transfer(_owner, total);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Returns the fee to use calc functions.
     */
    function fee() public view returns (uint256) {
        return _fee;
    }
}