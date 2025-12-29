// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {MultiSig} from "./MultiSig.sol";

contract MultiSigFactory {
    event MultiSigCreated(
        address indexed multiSig,
        address indexed creator,
        address[] owners,
        uint256 required,
        uint256 timestamp
    );

    address[] public deployedMultiSigs;
    mapping(address => address[]) public creatorMultiSigs;
    mapping(address => address[]) public ownerMultiSigs;
    mapping(address => bool) public isMultiSig;

    address public owner;
    uint256 public creationFee;

    constructor(uint256 _creationFee) {
        owner = msg.sender;
        creationFee = _creationFee;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function updateCreationFee(uint256 newFee) external onlyOwner {
        creationFee = newFee;
    }

    function createMultiSig(
        address[] calldata owners,
        uint256 required
    ) external payable returns (address multisig) {
        require(msg.value >= creationFee, "Insufficient fee");

        MultiSig ms = new MultiSig(owners, required);
        multisig = address(ms);

        deployedMultiSigs.push(multisig);
        creatorMultiSigs[msg.sender].push(multisig);

        for (uint256 i; i < owners.length; ++i) {
            ownerMultiSigs[owners[i]].push(multisig);
        }

        isMultiSig[multisig] = true;

        emit MultiSigCreated(multisig, msg.sender, owners, required, block.timestamp);

        (bool ok,) = owner.call{value: msg.value}("");
        require(ok, "Fee transfer failed");
    }

    function getDeployedMultiSigs() external view returns (address[] memory) {
        return deployedMultiSigs;
    }

    function getCreatorMultiSigs(address creator) external view returns (address[] memory) {
        return creatorMultiSigs[creator];
    }

    function getOwnerMultiSigs(address _owner) external view returns (address[] memory) {
        return ownerMultiSigs[_owner];
    }
}
