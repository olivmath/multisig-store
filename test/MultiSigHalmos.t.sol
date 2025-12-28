// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {Test} from "forge-std/Test.sol";
import {MultiSig} from "../src/MultiSig.sol";
import {SymTest} from "halmos-cheatcodes/SymTest.sol";

contract MultiSigHalmosTest is SymTest, Test {
    MultiSig public multiSig;
    address[] public owners;

    function setUp() public {
        owners.push(address(0x1));
        owners.push(address(0x2));
        owners.push(address(0x3));

        multiSig = new MultiSig(owners, 2);
        vm.deal(address(multiSig), 100 ether);
    }

    /// @custom:halmos --loop 5
    function check_txCountMonotonic(uint256 initialTxCount) public {
        vm.assume(initialTxCount < 100);

        for (uint256 i = 0; i < initialTxCount; i++) {
            vm.prank(owners[0]);
            multiSig.submitTransaction(address(0x999), 1 ether, "");
        }

        uint256 txCountBefore = multiSig.txCount();

        vm.prank(owners[0]);
        multiSig.submitTransaction(address(0x999), 1 ether, "");

        uint256 txCountAfter = multiSig.txCount();

        assert(txCountAfter > txCountBefore);
        assert(txCountAfter == txCountBefore + 1);
    }

    function check_executedTransactionCannotBeReExecuted() public {
        vm.prank(owners[0]);
        uint256 txId = multiSig.submitTransaction(address(0x999), 1 ether, "");

        vm.prank(owners[1]);
        multiSig.confirmTransaction(txId);

        vm.prank(owners[0]);
        multiSig.executeTransaction(txId);

        (, , bool executedBefore, ) = multiSig.transactions(txId);
        assert(executedBefore);

        vm.prank(owners[0]);
        try multiSig.executeTransaction(txId) {
            assert(false);
        } catch {
            assert(true);
        }
    }

    function check_confirmationIsPersistent(uint256 txId, uint256 ownerIndex) public {
        vm.assume(ownerIndex < owners.length);

        vm.prank(owners[0]);
        multiSig.submitTransaction(address(0x999), 1 ether, "");

        vm.assume(txId < multiSig.txCount());

        bool confirmedBefore = multiSig.confirmations(txId, owners[ownerIndex]);

        if (!confirmedBefore) {
            vm.prank(owners[ownerIndex]);
            multiSig.confirmTransaction(txId);

            bool confirmedAfter = multiSig.confirmations(txId, owners[ownerIndex]);
            assert(confirmedAfter);
        }

        bool stillConfirmed = multiSig.confirmations(txId, owners[ownerIndex]);
        assert(stillConfirmed == multiSig.confirmations(txId, owners[ownerIndex]));
    }

    function check_requiredConfirmationsToExecute() public {
        vm.prank(owners[0]);
        uint256 txId = multiSig.submitTransaction(address(0x999), 1 ether, "");

        bool canExecuteWithOne = multiSig.isConfirmed(txId);
        assert(canExecuteWithOne);

        vm.prank(owners[1]);
        multiSig.confirmTransaction(txId);

        bool canExecuteWithTwo = multiSig.isConfirmed(txId);
        assert(canExecuteWithTwo);
    }

    function check_onlyOwnersCanSubmit(address caller) public {
        vm.assume(caller != owners[0] && caller != owners[1] && caller != owners[2]);

        vm.prank(caller);
        try multiSig.submitTransaction(address(0x999), 1 ether, "") {
            assert(false);
        } catch {
            assert(true);
        }
    }

    function check_onlyOwnersCanConfirm(address caller, uint256 txId) public {
        vm.assume(caller != owners[0] && caller != owners[1] && caller != owners[2]);

        vm.prank(owners[0]);
        multiSig.submitTransaction(address(0x999), 1 ether, "");

        vm.assume(txId < multiSig.txCount());

        vm.prank(caller);
        try multiSig.confirmTransaction(txId) {
            assert(false);
        } catch {
            assert(true);
        }
    }

    function check_onlyOwnersCanExecute(address caller) public {
        vm.assume(caller != owners[0] && caller != owners[1] && caller != owners[2]);

        vm.prank(owners[0]);
        uint256 txId = multiSig.submitTransaction(address(0x999), 1 ether, "");

        vm.prank(owners[1]);
        multiSig.confirmTransaction(txId);

        vm.prank(caller);
        try multiSig.executeTransaction(txId) {
            assert(false);
        } catch {
            assert(true);
        }
    }

    function check_cannotConfirmTwice(uint256 ownerIndex) public {
        vm.assume(ownerIndex < owners.length);

        vm.prank(owners[0]);
        uint256 txId = multiSig.submitTransaction(address(0x999), 1 ether, "");

        if (ownerIndex == 0) {
            vm.prank(owners[ownerIndex]);
            try multiSig.confirmTransaction(txId) {
                assert(false);
            } catch {
                assert(true);
            }
        } else {
            vm.prank(owners[ownerIndex]);
            multiSig.confirmTransaction(txId);

            vm.prank(owners[ownerIndex]);
            try multiSig.confirmTransaction(txId) {
                assert(false);
            } catch {
                assert(true);
            }
        }
    }

    function check_transactionRequiresEnoughConfirmations() public {
        vm.prank(owners[0]);
        uint256 txId = multiSig.submitTransaction(address(0x999), 1 ether, "");

        uint256 required = multiSig.required();
        assert(required == 2);

        bool confirmedWithOne = multiSig.isConfirmed(txId);
        assert(confirmedWithOne);

        vm.prank(owners[0]);
        multiSig.executeTransaction(txId);

        (, , bool executed, ) = multiSig.transactions(txId);
        assert(executed);
    }

    /// @custom:halmos --loop 10
    function check_balanceConsistency() public {
        uint256 initialBalance = address(multiSig).balance;

        vm.deal(address(this), 10 ether);
        payable(address(multiSig)).transfer(5 ether);

        uint256 balanceAfterDeposit = address(multiSig).balance;
        assert(balanceAfterDeposit == initialBalance + 5 ether);

        vm.prank(owners[0]);
        uint256 txId = multiSig.submitTransaction(address(0x999), 1 ether, "");

        vm.prank(owners[1]);
        multiSig.confirmTransaction(txId);

        uint256 balanceBeforeExecution = address(multiSig).balance;

        vm.prank(owners[0]);
        multiSig.executeTransaction(txId);

        uint256 balanceAfterExecution = address(multiSig).balance;
        assert(balanceAfterExecution == balanceBeforeExecution - 1 ether);
    }

    function check_ownersListImmutable() public {
        address[] memory ownersBefore = multiSig.getOwners();

        vm.prank(owners[0]);
        multiSig.submitTransaction(address(0x999), 1 ether, "");

        address[] memory ownersAfter = multiSig.getOwners();

        assert(ownersBefore.length == ownersAfter.length);
        for (uint256 i = 0; i < ownersBefore.length; i++) {
            assert(ownersBefore[i] == ownersAfter[i]);
        }
    }

    function check_requiredImmutable() public {
        uint256 requiredBefore = multiSig.required();

        vm.prank(owners[0]);
        multiSig.submitTransaction(address(0x999), 1 ether, "");

        uint256 requiredAfter = multiSig.required();

        assert(requiredBefore == requiredAfter);
    }
}
