// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/PromiseEscrow.sol";
import "protocol/packages/core/contracts/data-verification-mechanism/implementation/Finder.sol";
import "protocol/packages/core/contracts/optimistic-oracle-v3/implementation/OptimisticOracleV3.sol";

contract PromiseEscrowTest is Test {
    PromiseEscrow public escrow;
    address constant usdc = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address constant oracle = 0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE;
    address constant finder = 0x40f941E48A552bF496B154Af6bf55725f18D77c3;

    function setUp() public {
        escrow = new PromiseEscrow(finder, usdc, oracle);
        // emit log_named_uint("Current ether balance of myAddress", myAddress.balance);
        // counter.setNumber(0);
    }

    function testGetPromise() public {
        bytes32 test = escrow.kekw();
        emit log_named_bytes32("asd", test);
        // bytes32 promiseId = escrow.getPromise(byte32(0));
    }

    // function testPromise() public {
    //     bytes32 promiseId = escrow.createPromise("will shit live on tv");
    // }

    // function testSetNumber(uint256 x) public {
    //     counter.setNumber(x);
    //     assertEq(counter.number(), x);
    // }
}
