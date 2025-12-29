// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {MultiSig} from "./MultiSig.sol";

contract MultiSigFacade {
    /*//////////////////////////////////////////////////////////////
                            WRITE
    //////////////////////////////////////////////////////////////*/

    function submitETH(address multisig, address to, uint256 amount)
        external
        returns (uint256)
    {
        return MultiSig(payable(multisig)).submitETH(to, amount);
    }

    function submitERC20(address multisig, address token, address to, uint256 amount)
        external
        returns (uint256)
    {
        return MultiSig(payable(multisig)).submitERC20(token, to, amount);
    }

    function submitCustom(
        address multisig,
        address to,
        uint256 value,
        bytes calldata data
    ) external returns (uint256) {
        return MultiSig(payable(multisig)).submitCustom(to, value, data);
    }

    function confirm(address multisig, uint256 txId) external {
        MultiSig(payable(multisig)).confirmTransaction(txId);
    }

    function execute(address multisig, uint256 txId) external {
        MultiSig(payable(multisig)).executeTransaction(txId);
    }

    /*//////////////////////////////////////////////////////////////
                            READ
    //////////////////////////////////////////////////////////////*/

    function getTransaction(address multisig, uint256 txId)
        external
        view
        returns (MultiSig.Transaction memory transaction)
    {
        (
            MultiSig.TxType txType,
            address token,
            address to,
            uint256 amount,
            bool executed,
            bytes memory data
        ) = MultiSig(payable(multisig)).transactions(txId);

        transaction = MultiSig.Transaction({
            txType: txType,
            token: token,
            to: to,
            amount: amount,
            executed: executed,
            data: data
        });
    }

    function getConfirmers(address multisig, uint256 txId)
        external
        view
        returns (address[] memory)
    {
        return MultiSig(payable(multisig)).getConfirmers(txId);
    }

    function getTxCount(address multisig) external view returns (uint256) {
        return MultiSig(payable(multisig)).txCount();
    }

    function getRequired(address multisig) external view returns (uint256) {
        return MultiSig(payable(multisig)).required();
    }

    function getOwners(address multisig) external view returns (address[] memory) {
        return MultiSig(payable(multisig)).getOwners();
    }
}
