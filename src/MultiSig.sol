// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MultiSig {
    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/
    event Deposit(address indexed sender, uint256 value);
    event SubmitTransaction(
        uint256 indexed txId,
        address indexed destination,
        uint256 value,
        bytes data
    );
    event ConfirmTransaction(address indexed owner, uint256 indexed txId);
    event ExecuteTransaction(uint256 indexed txId);

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/
    error InvalidTransactionId();
    error TransactionAlreadyExecuted();
    error TransactionNotConfirmed();
    error NotAuthorized();
    error InvalidRequired();
    error NoOwners();
    error OwnerNotUnique();
    error AlreadyConfirmed();

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public required;

    struct Transaction {
        address destination;
        uint256 value;
        bool executed;
        bytes data;
    }

    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmations;
    uint256 public txCount;

    /*//////////////////////////////////////////////////////////////
                              MODIFIERS
    //////////////////////////////////////////////////////////////*/
    modifier onlyOwner() {
        if (!isOwner[msg.sender]) revert NotAuthorized();
        _;
    }

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    constructor(address[] memory _owners, uint256 _required) {
        uint256 len = _owners.length;
        if (len == 0) revert NoOwners();
        if (_required == 0 || _required > len) revert InvalidRequired();

        for (uint256 i; i < len; ++i) {
            address owner = _owners[i];
            if (owner == address(0)) revert OwnerNotUnique();
            if (isOwner[owner]) revert OwnerNotUnique();

            isOwner[owner] = true;
            owners.push(owner);
        }

        required = _required;
    }

    /*//////////////////////////////////////////////////////////////
                        TRANSACTION LIFECYCLE
    //////////////////////////////////////////////////////////////*/
    function submitTransaction(
        address destination,
        uint256 value,
        bytes calldata data
    ) external onlyOwner returns (uint256 txId) {
        txId = txCount;

        transactions[txId] = Transaction({
            destination: destination,
            value: value,
            executed: false,
            data: data
        });

        txCount++;

        emit SubmitTransaction(txId, destination, value, data);

        confirmTransaction(txId);
    }

    function confirmTransaction(uint256 txId) public onlyOwner {
        if (txId >= txCount) revert InvalidTransactionId();
        if (confirmations[txId][msg.sender]) revert AlreadyConfirmed();

        confirmations[txId][msg.sender] = true;
        emit ConfirmTransaction(msg.sender, txId);
    }

    function executeTransaction(uint256 txId) external onlyOwner {
        if (txId >= txCount) revert InvalidTransactionId();

        Transaction storage txn = transactions[txId];
        if (txn.executed) revert TransactionAlreadyExecuted();
        if (!isConfirmed(txId)) revert TransactionNotConfirmed();

        txn.executed = true;

        (bool ok, bytes memory returndata) =
            payable(txn.destination).call{value: txn.value}(txn.data);

        if (!ok) {
            assembly {
                revert(add(returndata, 0x20), mload(returndata))
            }
        }

        emit ExecuteTransaction(txId);
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function isConfirmed(uint256 txId) public view returns (bool) {
        uint256 count;
        uint256 len = owners.length;

        for (uint256 i; i < len; ++i) {
            if (confirmations[txId][owners[i]]) {
                count++;
                if (count >= required) return true;
            }
        }
        return false;
    }

    function getOwners() external view returns (address[] memory) {
        return owners;
    }

    /*//////////////////////////////////////////////////////////////
                                RECEIVE
    //////////////////////////////////////////////////////////////*/
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
}
