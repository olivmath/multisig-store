// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MultiSig {
    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/
    event Deposit(address indexed sender, uint256 value);
    event SubmitTransaction(uint256 indexed txId, address indexed destination, uint256 value, bytes data);
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
    error InvalidDestination();

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
    mapping(uint256 => uint256) public confirmationCount;
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
            if (owner == address(0) || isOwner[owner]) revert OwnerNotUnique();

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
        if (destination == address(0)) revert InvalidDestination();

        txId = txCount++;

        transactions[txId] = Transaction({
            destination: destination,
            value: value,
            executed: false,
            data: data
        });

        emit SubmitTransaction(txId, destination, value, data);

        _confirmTransaction(txId, msg.sender);
    }

    function confirmTransaction(uint256 txId) external onlyOwner {
        _confirmTransaction(txId, msg.sender);
    }

    function _confirmTransaction(uint256 txId, address sender) internal {
        if (txId >= txCount) revert InvalidTransactionId();
        if (confirmations[txId][sender]) revert AlreadyConfirmed();

        confirmations[txId][sender] = true;
        confirmationCount[txId]++;

        emit ConfirmTransaction(sender, txId);

        if (confirmationCount[txId] >= required && !transactions[txId].executed) {
            _executeTransaction(txId);
        }
    }

    function executeTransaction(uint256 txId) external onlyOwner {
        _executeTransaction(txId);
    }

    function _executeTransaction(uint256 txId) internal {
        if (txId >= txCount) revert InvalidTransactionId();

        Transaction storage txn = transactions[txId];
        if (txn.executed) revert TransactionAlreadyExecuted();
        if (confirmationCount[txId] < required) revert TransactionNotConfirmed();

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
    function isConfirmed(uint256 txId) external view returns (bool) {
        return confirmationCount[txId] >= required;
    }

    function getOwners() external view returns (address[] memory) {
        return owners;
    }

    function isConfirmedBy(uint256 txId, address owner) external view returns (bool) {
        return confirmations[txId][owner];
    }

    function getTransaction(uint256 txId) external view returns (Transaction memory) {
        return transactions[txId];
    }

    /*//////////////////////////////////////////////////////////////
                                RECEIVE
    //////////////////////////////////////////////////////////////*/
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
}
