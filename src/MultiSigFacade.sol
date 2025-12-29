// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {MultiSig} from "./MultiSig.sol";

contract MultiSigFacade {
    function submitTransaction(
        address multisig,
        address destination,
        uint256 value,
        bytes calldata data
    ) external returns (uint256) {
        return MultiSig(multisig).submitTransaction(destination, value, data);
    }

    function confirmTransaction(address multisig, uint256 txId) external {
        MultiSig(multisig).confirmTransaction(txId);
    }

    function executeTransaction(address multisig, uint256 txId) external {
        MultiSig(multisig).executeTransaction(txId);
    }

    /*//////////////////////////////////////////////////////////////
                            READ HELPERS
    //////////////////////////////////////////////////////////////*/
    function getTransaction(address multisig, uint256 txId)
        external
        view
        returns (MultiSig.Transaction memory)
    {
        return MultiSig(multisig).getTransaction(txId);
    }

    function getTxCount(address multisig) external view returns (uint256) {
        return MultiSig(multisig).txCount();
    }

    function getConfirmationCount(address multisig, uint256 txId)
        external
        view
        returns (uint256)
    {
        return MultiSig(multisig).confirmationCount(txId);
    }

    function isConfirmed(address multisig, uint256 txId) external view returns (bool) {
        return MultiSig(multisig).isConfirmed(txId);
    }

    function isConfirmedBy(address multisig, uint256 txId, address owner)
        external
        view
        returns (bool)
    {
        return MultiSig(multisig).isConfirmedBy(txId, owner);
    }

    function getOwners(address multisig) external view returns (address[] memory) {
        return MultiSig(multisig).getOwners();
    }

    function getRequired(address multisig) external view returns (uint256) {
        return MultiSig(multisig).required();
    }
}
