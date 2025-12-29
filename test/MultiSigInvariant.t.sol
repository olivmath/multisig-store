// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {Test, console2} from "forge-std/Test.sol";
import {StdInvariant} from "forge-std/StdInvariant.sol";
import {MultiSig} from "../src/MultiSig.sol";

contract MultiSigInvariantTest is StdInvariant, Test {
    MultiSig public multiSig;
    InvariantHandler public handler;

    function setUp() public {
        address[] memory owners = new address[](3);
        owners[0] = address(0x1);
        owners[1] = address(0x2);
        owners[2] = address(0x3);

        multiSig = new MultiSig(owners, 2);
        handler = new InvariantHandler(multiSig);

        vm.deal(address(multiSig), 100 ether);

        targetContract(address(handler));
    }

    function invariant_txCountNeverDecreases() public view {
        uint256 txCount = multiSig.txCount();
        assertTrue(txCount >= handler.maxTxCount());
    }

    function invariant_executedTransactionsStayExecuted() public view {
        for (uint256 i = 0; i < multiSig.txCount(); i++) {
            (,, bool executed,) = multiSig.transactions(i);
            if (executed) {
                assertTrue(handler.wasExecuted(i));
            }
        }
    }

    function invariant_requiredConfirmationsConstant() public view {
        assertEq(multiSig.required(), 2);
    }

    function invariant_ownersCountConstant() public view {
        assertEq(multiSig.getOwners().length, 3);
    }

    function invariant_cannotExecuteWithoutEnoughConfirmations() public view {
        for (uint256 i = 0; i < multiSig.txCount(); i++) {
            (,, bool executed,) = multiSig.transactions(i);
            if (executed) {
                assertTrue(multiSig.isConfirmed(i));
            }
        }
    }

    function invariant_callSummary() public view {
        console2.log("Call summary:");
        console2.log("Submit calls:", handler.submitCalls());
        console2.log("Confirm calls:", handler.confirmCalls());
        console2.log("Execute calls:", handler.executeCalls());
        console2.log("Deposit calls:", handler.depositCalls());
    }
}

contract InvariantHandler is Test {
    MultiSig public multiSig;
    address[] public owners;

    uint256 public submitCalls;
    uint256 public confirmCalls;
    uint256 public executeCalls;
    uint256 public depositCalls;
    uint256 public maxTxCount;

    mapping(uint256 => bool) public wasExecuted;

    constructor(MultiSig _multiSig) {
        multiSig = _multiSig;
        owners = multiSig.getOwners();
    }

    function submitTransaction(uint256 ownerIndex, address destination, uint256 value) public {
        ownerIndex = bound(ownerIndex, 0, owners.length - 1);
        value = bound(value, 0, address(multiSig).balance);

        if (destination == address(0)) {
            destination = address(0x123);
        }

        vm.prank(owners[ownerIndex]);
        try multiSig.submitTransaction(destination, value, "") returns (uint256 txId) {
            submitCalls++;
            if (multiSig.txCount() > maxTxCount) {
                maxTxCount = multiSig.txCount();
            }
        } catch {}
    }

    function confirmTransaction(uint256 ownerIndex, uint256 txId) public {
        ownerIndex = bound(ownerIndex, 0, owners.length - 1);

        if (multiSig.txCount() == 0) return;
        txId = bound(txId, 0, multiSig.txCount() - 1);

        vm.prank(owners[ownerIndex]);
        try multiSig.confirmTransaction(txId) {
            confirmCalls++;
        } catch {}
    }

    function executeTransaction(uint256 ownerIndex, uint256 txId) public {
        ownerIndex = bound(ownerIndex, 0, owners.length - 1);

        if (multiSig.txCount() == 0) return;
        txId = bound(txId, 0, multiSig.txCount() - 1);

        vm.prank(owners[ownerIndex]);
        try multiSig.executeTransaction(txId) {
            executeCalls++;
            wasExecuted[txId] = true;
        } catch {}
    }

    function deposit(uint256 amount) public {
        amount = bound(amount, 0, 10 ether);
        vm.deal(address(this), amount);

        if (amount > 0) {
            payable(address(multiSig)).transfer(amount);
            depositCalls++;
        }
    }

    receive() external payable {}
}
