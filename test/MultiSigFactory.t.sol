// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {Test, console2} from "forge-std/Test.sol";
import {MultiSigFactory} from "../src/MultiSigFactory.sol";
import {MultiSig} from "../src/MultiSig.sol";

contract MultiSigFactoryTest is Test {
    MultiSigFactory public factory;
    address[] public owners;
    address public creator;
    uint256 public constant CREATION_FEE = 0.01 ether;

    event MultiSigCreated(
        address indexed multiSig, address indexed creator, address[] owners, uint256 required, uint256 timestamp
    );

    function setUp() public {
        factory = new MultiSigFactory();
        creator = makeAddr("creator");
        vm.deal(creator, 100 ether);

        owners.push(makeAddr("owner1"));
        owners.push(makeAddr("owner2"));
        owners.push(makeAddr("owner3"));
    }

    receive() external payable {}

    function test_createMultiSig() public {
        vm.prank(creator);
        address multiSigAddr = factory.createMultiSig{value: CREATION_FEE}(owners, 2);

        assertTrue(multiSigAddr != address(0));
        assertTrue(factory.isMultiSig(multiSigAddr));

        MultiSig multiSig = MultiSig(payable(multiSigAddr));
        assertEq(multiSig.required(), 2);
        assertEq(multiSig.getOwners().length, 3);
    }

    function test_createMultiSig_emitsEvent() public {
        vm.prank(creator);

        vm.expectEmit(false, true, false, false);
        emit MultiSigCreated(address(0), creator, owners, 2, block.timestamp);

        factory.createMultiSig{value: CREATION_FEE}(owners, 2);
    }

    function test_createMultiSig_tracksDeployment() public {
        vm.prank(creator);
        address multiSig1 = factory.createMultiSig{value: CREATION_FEE}(owners, 2);

        assertEq(factory.getMultiSigCount(), 1);
        assertEq(factory.deployedMultiSigs(0), multiSig1);

        address[] memory creatorMultiSigs = factory.getCreatorMultiSigs(creator);
        assertEq(creatorMultiSigs.length, 1);
        assertEq(creatorMultiSigs[0], multiSig1);
    }

    function test_createMultiSig_multipleDeployments() public {
        vm.startPrank(creator);
        address multiSig1 = factory.createMultiSig{value: CREATION_FEE}(owners, 2);
        address multiSig2 = factory.createMultiSig{value: CREATION_FEE}(owners, 3);
        vm.stopPrank();

        assertEq(factory.getMultiSigCount(), 2);

        address[] memory allMultiSigs = factory.getDeployedMultiSigs();
        assertEq(allMultiSigs.length, 2);
        assertEq(allMultiSigs[0], multiSig1);
        assertEq(allMultiSigs[1], multiSig2);

        address[] memory creatorMultiSigs = factory.getCreatorMultiSigs(creator);
        assertEq(creatorMultiSigs.length, 2);
    }

    function test_createMultiSig_differentCreators() public {
        address creator2 = makeAddr("creator2");
        vm.deal(creator2, 100 ether);

        vm.prank(creator);
        address multiSig1 = factory.createMultiSig{value: CREATION_FEE}(owners, 2);

        vm.prank(creator2);
        address multiSig2 = factory.createMultiSig{value: CREATION_FEE}(owners, 2);

        assertEq(factory.getMultiSigCount(), 2);

        address[] memory creator1MultiSigs = factory.getCreatorMultiSigs(creator);
        assertEq(creator1MultiSigs.length, 1);
        assertEq(creator1MultiSigs[0], multiSig1);

        address[] memory creator2MultiSigs = factory.getCreatorMultiSigs(creator2);
        assertEq(creator2MultiSigs.length, 1);
        assertEq(creator2MultiSigs[0], multiSig2);
    }

    function test_createMultiSig_functionalMultiSig() public {
        vm.prank(creator);
        address multiSigAddr = factory.createMultiSig{value: CREATION_FEE}(owners, 2);

        MultiSig multiSig = MultiSig(payable(multiSigAddr));
        vm.deal(multiSigAddr, 10 ether);

        vm.prank(owners[0]);
        multiSig.submitTransaction(makeAddr("destination"), 1 ether, "");

        vm.prank(owners[1]);
        multiSig.confirmTransaction(0);

        vm.prank(owners[0]);
        multiSig.executeTransaction(0);

        (,, bool executed,) = multiSig.transactions(0);
        assertTrue(executed);
    }

    function test_createMultiSig_feeTransfer() public {
        uint256 initialOwnerBalance = address(this).balance;

        vm.prank(creator);
        factory.createMultiSig{value: CREATION_FEE}(owners, 2);

        assertEq(address(this).balance, initialOwnerBalance + CREATION_FEE);
    }

    function test_createMultiSig_revertIfInsufficientFee() public {
        vm.prank(creator);
        vm.expectRevert("Insufficient creation fee");
        factory.createMultiSig{value: CREATION_FEE - 1 wei}(owners, 2);
    }

    function test_updateCreationFee() public {
        uint256 newFee = 0.05 ether;
        factory.updateCreationFee(newFee);
        assertEq(factory.creationFee(), newFee);

        vm.prank(creator);
        vm.expectRevert("Not owner");
        factory.updateCreationFee(0);
    }

    function testFuzz_createMultiSig(uint8 numOwners, uint8 required, address fuzzCreator) public {
        vm.assume(numOwners > 0 && numOwners <= 20);
        vm.assume(required > 0 && required <= numOwners);
        vm.assume(fuzzCreator != address(0));
        vm.deal(fuzzCreator, CREATION_FEE);

        address[] memory fuzzOwners = new address[](numOwners);
        for (uint256 i = 0; i < numOwners; i++) {
            fuzzOwners[i] = address(uint160(i + 1));
        }

        vm.prank(fuzzCreator);
        address multiSigAddr = factory.createMultiSig{value: CREATION_FEE}(fuzzOwners, required);

        assertTrue(factory.isMultiSig(multiSigAddr));

        MultiSig multiSig = MultiSig(payable(multiSigAddr));
        assertEq(multiSig.required(), required);
        assertEq(multiSig.getOwners().length, numOwners);
    }

    function testFuzz_multipleCreations(uint8 count) public {
        vm.assume(count > 0 && count <= 10);
        vm.deal(creator, count * CREATION_FEE);

        for (uint256 i = 0; i < count; i++) {
            vm.prank(creator);
            factory.createMultiSig{value: CREATION_FEE}(owners, 2);
        }

        assertEq(factory.getMultiSigCount(), count);
        assertEq(factory.getCreatorMultiSigs(creator).length, count);
    }
}
