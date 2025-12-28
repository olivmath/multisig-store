// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {Script, console2} from "forge-std/Script.sol";
import {MultiSigFactory} from "../src/MultiSigFactory.sol";

contract DeployScript is Script {
    function run() external returns (MultiSigFactory) {
        vm.startBroadcast();

        MultiSigFactory factory = new MultiSigFactory();

        console2.log("MultiSigFactory deployed at:", address(factory));

        vm.stopBroadcast();

        return factory;
    }
}
