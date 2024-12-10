// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol"

//Deployed this contract an Sepolia at 0xC5b9AE74081aC043552c666B8020b2D77cD84F22

contract BuyMeCoffee {
    //creating a new event named NewMemo to emit
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    //creating a struct for memo
    struct Memo{
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //address of the deployed owner must be payable
    address payable owner;

    //Pushing all the memos into one single array
    Memo[] memos;

    constructor(){
        owner=payable(msg.sender);
    }

    function buyCoffee(string memory _name, string memory _message) public payable{
        require(msg.value > 0,'cant buy a coffee right now!');

        //Adding memo to the storage
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );

    }

    function withdraw() public{
        require(owner.send(address(this).balance));
    }

    function getMemos() public view returns(Memo[] memory){
        return memos;
    }

}
