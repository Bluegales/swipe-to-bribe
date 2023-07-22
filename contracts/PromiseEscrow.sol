// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// @todo add events for all functions
contract PromiseEscrow {
    IERC721 public collectionA;
    IERC721 public collectionB;

    struct Voting {
        uint totalVotes;
        uint positiveVotes;
        mapping(address => bool) voters;
    }

	struct Promise {
		string statement;
		address politician;
		uint256 endBlock;
		uint256 stake;
	}

    uint256 public promiseCount = 0;
	mapping(uint256 => Promise) public promises;
    mapping(uint256 => Voting) public votes;

    address payable constant BURN_ADDRESS = payable(0x000000000000000000000000000000000000dEaD);

    // @todo remove
    constructor(address _collectionA, address _collectionB) {
        collectionA = IERC721(_collectionA);
        collectionB = IERC721(_collectionB);
    }

    function createPromise(string memory statement, uint256 _endBlock) external {
		// @todo add EAS politician-attestation check
        require(collectionA.balanceOf(msg.sender) > 0, "Must own an NFT from collection A");

		promises[promiseCount] = Promise({
			statement: statement,
			politician: msg.sender,
			endBlock: _endBlock,
			stake: 0
		});
        promiseCount++;
	}

	// @todo restrict possible payment amounts
    function stakeForPromise(uint256 promiseID) external payable {
        require(promiseID >= promiseCount, "Promise does not exist");
		// @todo add SISMO national group-authentification check
        require(collectionB.balanceOf(msg.sender) > 0, "Must own an NFT from collection B");
        require(msg.value > 0, "Must send ETH to stake for a promise");

		promises[promiseID].stake += msg.value;
    }

    function voteForPromise(uint256 promiseID, bool vote) external {
		require(promiseID >= promiseCount, "Promise does not exist");
		require(promises[promiseID].endBlock > block.number, "Voting period has not started yet");
		// @todo add SISMO national group-authentification check
		// @todo replace/add UMA check
        require(collectionB.balanceOf(msg.sender) > 0, "Must own an NFT from collection B");

		Voting storage curr = votes[promiseID];
        require(!curr.voters[msg.sender], "You have already voted");

        curr.voters[msg.sender] = true;
        curr.totalVotes += 1;

        if (vote) {
            curr.positiveVotes += 1;
        }
    }

    function withdraw(uint256 promiseID) external {
        require(promiseID >= promiseCount, "Promise does not exist");
        require(promises[promiseID].stake > 0, "No ETH deposited for this promise");
		// @todo replace 100 with appropriate voting time
		require(block.number >= promises[promiseID].endBlock + 100, "Voting period has not ended yet");

        Voting storage curr = votes[promiseID];
        require(curr.totalVotes > 0, "No votes cast for this promise");

        if ((curr.positiveVotes * 2) >= curr.totalVotes) {
        	require(msg.sender == promises[promiseID].politician, "Only the promise's creator can withdraw");
            payable(msg.sender).transfer(promises[promiseID].stake);
        } else {
            BURN_ADDRESS.transfer(promises[promiseID].stake);
        }
    }
}
