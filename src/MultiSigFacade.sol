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
        return MultiSig(payable(multisig)).submitTransaction(destination, value, data);
    }

    function confirmTransaction(address multisig, uint256 txId) external {
        MultiSig(payable(multisig)).confirmTransaction(txId);
    }

    function executeTransaction(address multisig, uint256 txId) external {
        MultiSig(payable(multisig)).executeTransaction(txId);
    }

    /*//////////////////////////////////////////////////////////////
                            READ HELPERS
    //////////////////////////////////////////////////////////////*/
    function getTransaction(address multisig, uint256 txId)
        external
        view
        returns (MultiSig.Transaction memory)
    {
        return MultiSig(payable(multisig)).getTransaction(txId);
    }

    function getTxCount(address multisig) external view returns (uint256) {
        return MultiSig(payable(multisig)).txCount();
    }

    function getConfirmationCount(address multisig, uint256 txId)
        external
        view
        returns (uint256)
    {
        return MultiSig(payable(multisig)).confirmationCount(txId);
    }

    function isConfirmed(address multisig, uint256 txId) external view returns (bool) {
        return MultiSig(payable(multisig)).isConfirmed(txId);
    }

    function isConfirmedBy(address multisig, uint256 txId, address owner)
        external
        view
        returns (bool)
    {
        return MultiSig(payable(multisig)).isConfirmedBy(txId, owner);
    }

    function getOwners(address multisig) external view returns (address[] memory) {
        return MultiSig(payable(multisig)).getOwners();
    }

    function getRequired(address multisig) external view returns (uint256) {
        return MultiSig(payable(multisig)).required();
    }
}
