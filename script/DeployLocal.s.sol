// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {Script, console2} from "forge-std/Script.sol";
import {MultiSigFactory} from "../src/MultiSigFactory.sol";
import {MultiSig} from "../src/MultiSig.sol";

contract DeployLocalScript is Script {
    function run() external {
        // Default Anvil private key (account 0)
        vm.startBroadcast();

        // Deploy Factory
        MultiSigFactory factory = new MultiSigFactory(0);
        console2.log("===========================================");
        console2.log("MultiSigFactory deployed at:", address(factory));
        console2.log("===========================================");

        // Create example MultiSig for testing
        address[] memory owners = new address[](3);
        owners[0] = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266; // Anvil account 0
        owners[1] = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8; // Anvil account 1
        owners[2] = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC; // Anvil account 2

        address multiSigAddress = factory.createMultiSig{value: 0}(owners, 2);
        console2.log("Example MultiSig created at:", multiSigAddress);

        // Fund the MultiSig with some ETH
        payable(multiSigAddress).transfer(100 ether);
        console2.log("MultiSig funded with 100 ETH");
        console2.log("===========================================");

        vm.stopBroadcast();
    }
}
