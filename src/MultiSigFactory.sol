// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {MultiSig} from "./MultiSig.sol";

contract MultiSigFactory {
    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/
    event MultiSigCreated(
        address indexed multiSig,
        address indexed creator,
        address[] owners,
        uint256 required,
        uint256 timestamp
    );

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    address[] public deployedMultiSigs;
    mapping(address => address[]) public creatorMultiSigs;
    mapping(address => bool) public isMultiSig;

    address public owner;
    uint256 public creationFee;

    constructor() {
        owner = msg.sender;
        creationFee = 0.01 ether;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function updateCreationFee(uint256 _newFee) external onlyOwner {
        creationFee = _newFee;
    }

    /*//////////////////////////////////////////////////////////////
                            FACTORY LOGIC
    //////////////////////////////////////////////////////////////*/
    function createMultiSig(
        address[] memory _owners,
        uint256 _required
    ) external payable returns (address multiSig) {
        require(msg.value >= creationFee, "Insufficient creation fee");
        
        (bool success, ) = payable(owner).call{value: msg.value}("");
        require(success, "Fee transfer failed");

        MultiSig newMultiSig = new MultiSig(_owners, _required);
        multiSig = address(newMultiSig);

        deployedMultiSigs.push(multiSig);
        creatorMultiSigs[msg.sender].push(multiSig);
        isMultiSig[multiSig] = true;

        emit MultiSigCreated(
            multiSig,
            msg.sender,
            _owners,
            _required,
            block.timestamp
        );
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function getDeployedMultiSigs() external view returns (address[] memory) {
        return deployedMultiSigs;
    }

    function getCreatorMultiSigs(address creator)
        external
        view
        returns (address[] memory)
    {
        return creatorMultiSigs[creator];
    }

    function getMultiSigCount() external view returns (uint256) {
        return deployedMultiSigs.length;
    }
}
