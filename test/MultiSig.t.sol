// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {Test, console2} from "forge-std/Test.sol";
import {MultiSig} from "../src/MultiSig.sol";

contract MultiSigTest is Test {
    MultiSig public multiSig;
    address[] public owners;
    address public owner1;
    address public owner2;
    address public owner3;
    address public notOwner;

    event Deposit(address indexed sender, uint256 value);
    event SubmitTransaction(
        uint256 indexed txId,
        MultiSig.TxType txType,
        address indexed token,
        address indexed to,
        uint256 amount
    );
    event ConfirmTransaction(address indexed owner, uint256 indexed txId);
    event ExecuteTransaction(uint256 indexed txId);

    function setUp() public {
        owner1 = makeAddr("owner1");
        owner2 = makeAddr("owner2");
        owner3 = makeAddr("owner3");
        notOwner = makeAddr("notOwner");

        owners.push(owner1);
        owners.push(owner2);
        owners.push(owner3);

        multiSig = new MultiSig(owners, 2);

        vm.deal(address(multiSig), 10 ether);
    }

    function test_constructor() public view {
        assertEq(multiSig.required(), 2);
        assertEq(multiSig.owners(0), owner1);
        assertEq(multiSig.owners(1), owner2);
        assertEq(multiSig.owners(2), owner3);
        assertTrue(multiSig.isOwner(owner1));
        assertTrue(multiSig.isOwner(owner2));
        assertTrue(multiSig.isOwner(owner3));
        assertFalse(multiSig.isOwner(notOwner));
    }

    function test_constructor_revertsIfNoOwners() public {
        address[] memory emptyOwners;
        vm.expectRevert(MultiSig.NoOwners.selector);
        new MultiSig(emptyOwners, 1);
    }

    function test_constructor_revertsIfRequiredIsZero() public {
        vm.expectRevert(MultiSig.InvalidRequired.selector);
        new MultiSig(owners, 0);
    }

    function test_constructor_revertsIfRequiredTooHigh() public {
        vm.expectRevert(MultiSig.InvalidRequired.selector);
        new MultiSig(owners, 4);
    }

    function test_constructor_revertsIfOwnerIsZeroAddress() public {
        owners[1] = address(0);
        vm.expectRevert(MultiSig.OwnerNotUnique.selector);
        new MultiSig(owners, 2);
    }

    function test_constructor_revertsIfOwnerNotUnique() public {
        owners[1] = owner1;
        vm.expectRevert(MultiSig.OwnerNotUnique.selector);
        new MultiSig(owners, 2);
    }

    function test_receive() public {
        vm.expectEmit(true, false, false, true);
        emit Deposit(address(this), 1 ether);

        payable(address(multiSig)).transfer(1 ether);
        assertEq(address(multiSig).balance, 11 ether);
    }

    function test_submitTransaction() public {
        vm.prank(owner1);
        vm.expectEmit(true, true, true, true);
        emit SubmitTransaction(0, MultiSig.TxType.ETH, address(0), owner2, 1 ether);

        uint256 txId = multiSig.submitETH(owner2, 1 ether);

        assertEq(txId, 0);
        assertEq(multiSig.txCount(), 1);

        (MultiSig.TxType txType, address token, address to, uint256 amount, bool executed, bytes memory data) = multiSig.transactions(0);
        assertEq(uint256(txType), uint256(MultiSig.TxType.ETH));
        assertEq(token, address(0));
        assertEq(to, owner2);
        assertEq(amount, 1 ether);
        assertFalse(executed);
        assertEq(data, "");
        assertTrue(multiSig.confirmations(0, owner1));
    }

    function test_submitTransaction_revertsIfNotOwner() public {
        vm.prank(notOwner);
        vm.expectRevert(MultiSig.NotAuthorized.selector);
        multiSig.submitETH(owner2, 1 ether);
    }

    function test_confirmTransaction() public {
        vm.prank(owner1);
        multiSig.submitETH(owner2, 1 ether);

        vm.prank(owner2);
        vm.expectEmit(true, true, false, false);
        emit ConfirmTransaction(owner2, 0);

        multiSig.confirmTransaction(0);
        assertTrue(multiSig.confirmations(0, owner2));
    }

    function test_confirmTransaction_revertsIfNotOwner() public {
        vm.prank(owner1);
        multiSig.submitETH(owner2, 1 ether);

        vm.prank(notOwner);
        vm.expectRevert(MultiSig.NotAuthorized.selector);
        multiSig.confirmTransaction(0);
    }

    function test_confirmTransaction_revertsIfInvalidTxId() public {
        vm.prank(owner1);
        vm.expectRevert(MultiSig.InvalidTransactionId.selector);
        multiSig.confirmTransaction(0);
    }

    function test_confirmTransaction_revertsIfAlreadyConfirmed() public {
        vm.prank(owner1);
        multiSig.submitETH(owner2, 1 ether);

        vm.prank(owner1);
        vm.expectRevert(MultiSig.AlreadyConfirmed.selector);
        multiSig.confirmTransaction(0);
    }

    function test_executeTransaction() public {
        vm.prank(owner1);
        multiSig.submitETH(owner2, 1 ether);

        uint256 balanceBefore = owner2.balance;

        vm.prank(owner2);
        vm.expectEmit(true, false, false, false);
        emit ExecuteTransaction(0);

        multiSig.confirmTransaction(0);

        assertEq(owner2.balance, balanceBefore + 1 ether);

        (,,,, bool executed,) = multiSig.transactions(0);
        assertTrue(executed);
    }

    function test_executeTransaction_revertsIfNotOwner() public {
        vm.prank(owner1);
        multiSig.submitETH(owner2, 1 ether);

        vm.prank(owner2);
        multiSig.confirmTransaction(0);

        vm.prank(notOwner);
        vm.expectRevert(MultiSig.NotAuthorized.selector);
        multiSig.executeTransaction(0);
    }

    function test_executeTransaction_revertsIfInvalidTxId() public {
        vm.prank(owner1);
        vm.expectRevert(MultiSig.TransactionNotConfirmed.selector);
        multiSig.executeTransaction(0);
    }

    function test_executeTransaction_revertsIfNotConfirmed() public {
        vm.prank(owner1);
        multiSig.submitETH(owner2, 1 ether);

        vm.prank(owner1);
        vm.expectRevert(MultiSig.TransactionNotConfirmed.selector);
        multiSig.executeTransaction(0);
    }

    function test_executeTransaction_revertsIfAlreadyExecuted() public {
        vm.prank(owner1);
        multiSig.submitETH(owner2, 1 ether);

        vm.prank(owner2);
        multiSig.confirmTransaction(0);

        vm.prank(owner1);
        vm.expectRevert(MultiSig.TransactionAlreadyExecuted.selector);
        multiSig.executeTransaction(0);
    }

    function test_executeTransaction_withData() public {
        MockTarget target = new MockTarget();
        bytes memory data = abi.encodeWithSignature("setValue(uint256)", 42);

        vm.prank(owner1);
        multiSig.submitCustom(address(target), 0, data);

        vm.prank(owner2);
        multiSig.confirmTransaction(0);

        assertEq(target.value(), 42);
    }

    function test_isConfirmed() public {
        vm.prank(owner1);
        multiSig.submitETH(owner2, 1 ether);

        assertFalse(multiSig.isConfirmed(0));

        vm.prank(owner2);
        multiSig.confirmTransaction(0);

        assertTrue(multiSig.isConfirmed(0));

        vm.prank(owner1);
        multiSig.submitETH(owner2, 1 ether);

        assertFalse(multiSig.isConfirmed(1));

        vm.prank(owner2);
        multiSig.confirmTransaction(1);

        assertTrue(multiSig.isConfirmed(1));
    }

    function test_getOwners() public view {
        address[] memory ownersArray = multiSig.getOwners();
        assertEq(ownersArray.length, 3);
        assertEq(ownersArray[0], owner1);
        assertEq(ownersArray[1], owner2);
        assertEq(ownersArray[2], owner3);
    }
}

contract MockTarget {
    uint256 public value;

    function setValue(uint256 _value) external {
        value = _value;
    }
}
