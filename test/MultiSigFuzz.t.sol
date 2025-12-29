// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {Test, console2} from "forge-std/Test.sol";
import {MultiSig} from "../src/MultiSig.sol";

contract MultiSigFuzzTest is Test {
    MultiSig public multiSig;
    address[] public owners;

    function setUp() public {
        address owner1 = makeAddr("owner1");
        address owner2 = makeAddr("owner2");
        address owner3 = makeAddr("owner3");

        owners.push(owner1);
        owners.push(owner2);
        owners.push(owner3);

        multiSig = new MultiSig(owners, 2);
        vm.deal(address(multiSig), 100 ether);
    }

    function testFuzz_constructor(uint8 numOwners, uint8 requiredConfirmations) public {
        vm.assume(numOwners > 0 && numOwners <= 50);
        vm.assume(requiredConfirmations > 0 && requiredConfirmations <= numOwners);

        address[] memory fuzzOwners = new address[](numOwners);
        for (uint256 i = 0; i < numOwners; i++) {
            fuzzOwners[i] = address(uint160(i + 1));
        }

        MultiSig fuzzMultiSig = new MultiSig(fuzzOwners, requiredConfirmations);

        assertEq(fuzzMultiSig.required(), requiredConfirmations);
        assertEq(fuzzMultiSig.getOwners().length, numOwners);
    }

    function testFuzz_submitTransaction(address destination, uint96 value, bytes calldata data) public {
        vm.assume(destination != address(0));
        vm.assume(value <= 100 ether);

        vm.prank(owners[0]);
        uint256 txId = multiSig.submitTransaction(destination, value, data);

        (address dest, uint256 val, bool executed, bytes memory txData) = multiSig.transactions(txId);

        assertEq(dest, destination);
        assertEq(val, value);
        assertFalse(executed);
        assertEq(txData, data);
        assertTrue(multiSig.confirmations(txId, owners[0]));
    }

    function testFuzz_confirmTransaction(uint8 txCount, uint8 confirmIndex) public {
        vm.assume(txCount > 0 && txCount <= 20);
        vm.assume(confirmIndex < txCount);

        for (uint256 i = 0; i < txCount; i++) {
            vm.prank(owners[0]);
            multiSig.submitTransaction(makeAddr(vm.toString(i)), 1 ether, "");
        }

        vm.prank(owners[1]);
        multiSig.confirmTransaction(confirmIndex);

        assertTrue(multiSig.confirmations(confirmIndex, owners[1]));
    }

    function testFuzz_executeTransaction(address destination, uint96 value) public {
        vm.assume(destination != address(0));
        vm.assume(uint160(destination) > 20);
        vm.assume(value > 0 && value <= 10 ether);
        vm.assume(destination.code.length == 0);

        vm.prank(owners[0]);
        uint256 txId = multiSig.submitTransaction(destination, value, "");

        vm.prank(owners[1]);
        multiSig.confirmTransaction(txId);

        uint256 balanceBefore = destination.balance;

        vm.prank(owners[0]);
        multiSig.executeTransaction(txId);

        assertEq(destination.balance, balanceBefore + value);

        (,, bool executed,) = multiSig.transactions(txId);
        assertTrue(executed);
    }

    function testFuzz_multipleTransactions(uint8 count) public {
        vm.assume(count > 0 && count <= 50);

        for (uint256 i = 0; i < count; i++) {
            vm.prank(owners[0]);
            multiSig.submitTransaction(address(uint160(i + 1)), 1 ether, "");
        }

        assertEq(multiSig.txCount(), count);

        for (uint256 i = 0; i < count; i++) {
            (address dest,,,) = multiSig.transactions(i);
            assertEq(dest, address(uint160(i + 1)));
        }
    }

    function testFuzz_requiredConfirmations(uint8 required) public {
        vm.assume(required > 0 && required <= owners.length);

        MultiSig testMultiSig = new MultiSig(owners, required);
        vm.deal(address(testMultiSig), 100 ether);

        vm.prank(owners[0]);
        uint256 txId = testMultiSig.submitTransaction(makeAddr("dest"), 1 ether, "");

        for (uint256 i = 1; i < required; i++) {
            vm.prank(owners[i]);
            testMultiSig.confirmTransaction(txId);
        }

        assertTrue(testMultiSig.isConfirmed(txId));
    }

    function testFuzz_deposit(uint96 amount) public {
        vm.assume(amount > 0 && amount <= 1000 ether);

        uint256 balanceBefore = address(multiSig).balance;

        vm.deal(address(this), amount);
        payable(address(multiSig)).transfer(amount);

        assertEq(address(multiSig).balance, balanceBefore + amount);
    }

    function testFuzz_cannotExecuteWithInsufficientConfirmations(uint8 confirmCount) public {
        vm.assume(confirmCount < 2);

        vm.prank(owners[0]);
        uint256 txId = multiSig.submitTransaction(makeAddr("dest"), 1 ether, "");

        if (confirmCount == 0) {
            vm.prank(owners[0]);
            vm.expectRevert(MultiSig.TransactionNotConfirmed.selector);
            multiSig.executeTransaction(txId);
        }
    }

    function testFuzz_transactionWithData(bytes calldata data, uint96 value) public {
        vm.assume(value <= 10 ether);
        vm.assume(data.length <= 10000);

        address destination = address(new MockReceiver());

        vm.prank(owners[0]);
        uint256 txId = multiSig.submitTransaction(destination, value, data);

        vm.prank(owners[1]);
        multiSig.confirmTransaction(txId);

        vm.prank(owners[0]);
        multiSig.executeTransaction(txId);

        (,, bool executed,) = multiSig.transactions(txId);
        assertTrue(executed);
    }
}

contract MockReceiver {
    event Received(address sender, uint256 value, bytes data);

    fallback() external payable {
        emit Received(msg.sender, msg.value, msg.data);
    }

    receive() external payable {
        emit Received(msg.sender, msg.value, "");
    }
}
