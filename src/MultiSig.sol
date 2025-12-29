// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}

contract MultiSig {
    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/
    event Deposit(address indexed sender, uint256 value);

    event SubmitTransaction(
        uint256 indexed txId,
        TxType txType,
        address indexed token,
        address indexed to,
        uint256 amount
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
    error InvalidDestination();

    /*//////////////////////////////////////////////////////////////
                                TYPES
    //////////////////////////////////////////////////////////////*/
    enum TxType {
        ETH,
        ERC20,
        CUSTOM
    }

    struct Transaction {
        TxType txType;
        address token;
        address to;
        uint256 amount;
        bool executed;
        bytes data;
    }

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public required;

    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmations;
    mapping(uint256 => address[]) public confirmers;
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
                        SUBMIT TRANSACTIONS
    //////////////////////////////////////////////////////////////*/

    function submitETH(address to, uint256 amount)
        external
        onlyOwner
        returns (uint256 txId)
    {
        if (to == address(0)) revert InvalidDestination();

        txId = _createTransaction(
            TxType.ETH,
            address(0),
            to,
            amount,
            ""
        );
    }

    function submitERC20(address token, address to, uint256 amount)
        external
        onlyOwner
        returns (uint256 txId)
    {
        if (token == address(0) || to == address(0)) revert InvalidDestination();

        txId = _createTransaction(
            TxType.ERC20,
            token,
            to,
            amount,
            ""
        );
    }

    function submitCustom(address to, uint256 value, bytes calldata data)
        external
        onlyOwner
        returns (uint256 txId)
    {
        if (to == address(0)) revert InvalidDestination();

        txId = _createTransaction(
            TxType.CUSTOM,
            address(0),
            to,
            value,
            data
        );
    }

    function _createTransaction(
        TxType txType,
        address token,
        address to,
        uint256 amount,
        bytes memory data
    ) internal returns (uint256 txId) {
        txId = txCount++;

        transactions[txId] = Transaction({
            txType: txType,
            token: token,
            to: to,
            amount: amount,
            executed: false,
            data: data
        });

        emit SubmitTransaction(txId, txType, token, to, amount);

        _confirm(txId, msg.sender);
    }

    /*//////////////////////////////////////////////////////////////
                        CONFIRM / EXECUTE
    //////////////////////////////////////////////////////////////*/

    function confirmTransaction(uint256 txId) external onlyOwner {
        _confirm(txId, msg.sender);
    }

    function _confirm(uint256 txId, address sender) internal {
        if (txId >= txCount) revert InvalidTransactionId();
        if (confirmations[txId][sender]) revert AlreadyConfirmed();

        confirmations[txId][sender] = true;
        confirmationCount[txId]++;
        confirmers[txId].push(sender);

        emit ConfirmTransaction(sender, txId);

        if (confirmationCount[txId] >= required) {
            _execute(txId);
        }
    }

    function executeTransaction(uint256 txId) external onlyOwner {
        _execute(txId);
    }

    function _execute(uint256 txId) internal {
        Transaction storage txn = transactions[txId];

        if (txn.executed) revert TransactionAlreadyExecuted();
        if (confirmationCount[txId] < required) revert TransactionNotConfirmed();

        txn.executed = true;

        if (txn.txType == TxType.ETH) {
            payable(txn.to).transfer(txn.amount);
        } else if (txn.txType == TxType.ERC20) {
            IERC20(txn.token).transfer(txn.to, txn.amount);
        } else {
            (bool ok, bytes memory returndata) =
                txn.to.call{value: txn.amount}(txn.data);

            if (!ok) {
                assembly {
                    revert(add(returndata, 0x20), mload(returndata))
                }
            }
        }

        emit ExecuteTransaction(txId);
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW HELPERS
    //////////////////////////////////////////////////////////////*/

    function getOwners() external view returns (address[] memory) {
        return owners;
    }

    function getConfirmers(uint256 txId) external view returns (address[] memory) {
        return confirmers[txId];
    }

    function isConfirmed(uint256 txId) external view returns (bool) {
        return confirmationCount[txId] >= required;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
}
