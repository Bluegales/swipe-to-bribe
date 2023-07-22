// SPDX-License-Identifier: MIT
pragma solidity ^0.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@uma/core/contracts/optimistic-oracle-v3/implementation/ClaimData.sol";
import "@uma/core/contracts/optimistic-oracle-v3/interfaces/OptimisticOracleV3Interface.sol";

import "@sismo-core/sismo-connect-solidity/contracts/libs/SismoLib.sol";

// @todo add events for all functions
// @todo especially emit promiseCreated event
// @todo remove NFT collection placeholders in constructor and the functions
// @todo which currency to use?
// @todo do I have to store the promises? take look at insurance UMA contract, they do it differently
// @todo add UMA more-than-yes-or-no check
// @todo add upper limit for staking
contract PromiseEscrow is SismoConnect {
	event ResponseVerified(SismoConnectVerifiedResult result);

	using SafeERC20 for IERC20;
    IERC721 public collectionA;
    IERC721 public collectionB;
	IERC20 public defaultCurrency;
	OptimisticOracleV3Interface public immutable oo;
	bytes32 public immutable defaultIdentifier;
	uint64 public constant oneDayInBlocks = 7200;
	address citizenGroup = 0x6e41539fdb94fe30e82d46d7f664860f;
	address politicianGroup = 0xe57abdb9acb2d308d4ec1a12833e1c9f;

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
		bool resolved;
	}

	mapping(bytes32 => Voting) public votes;
	mapping(bytes32 => Promise) public promises;
	mapping(bytes32 => bytes32) public assertions;

    address payable constant BURN_ADDRESS = payable(0x000000000000000000000000000000000000dEaD);

    constructor(address _collectionA, address _collectionB, address _defaultCurrency, address _optimisticOracleV3)
        SismoConnect(
            buildConfig({
                // replace with your appId from the Sismo factory https://factory.sismo.io/
                // should match the appId used to generate the response in your frontend
                appId: 0xd03c149aa5fdde1c6a88e3f720bffa21,
                // For development purposes insert when using proofs that contains impersonation
                // Never use this in production
                isImpersonationMode: true
            })
        )
    {
        collectionA = IERC721(_collectionA);
        collectionB = IERC721(_collectionB);
		defaultCurrency = IERC20(_defaultCurrency);
		oo = OptimisticOracleV3Interface(_optimisticOracleV3);
		defaultIdentifier = oo.defaultIdentifier();

    }

	function verifySismoConnectResponse(bytes memory response, address groupId) public {
        // build the auth and claim requests that should match the response
        AuthRequest[] memory auths = new AuthRequest[](1);
        auths[0] = buildAuth({authType: AuthType.GITHUB});

        ClaimRequest[] memory claims = new ClaimRequest[](2);
        // ENS DAO Voters
        claims[0] = buildClaim(groupId);
        // verify the response regarding our original request
        require(SismoConnectVerifiedResult memory result = verify({
            responseBytes: response,
            auths: auths,
            claims: claims,
            signature: buildSignature({message: "I vote Yes to Privacy"})
        }), "SismoConnect response is not valid");

        emit ResponseVerified(result);
	}

    function createPromise(string memory statement, uint256 _endBlock) public returns (bytes32 promiseId) {
		// @todo add EAS politician-attestation check
        require(collectionA.balanceOf(msg.sender) > 0, "Must own an NFT from collection A");

		verifySismoConnectResponse(responseSismo, politicianGroup);
		promiseId = keccak256(abi.encode(statement, msg.sender, _endBlock));
		promises[promiseId] = Promise({
			statement: statement,
			politician: msg.sender,
			endBlock: _endBlock,
			stake: 0,
			resolved: false
		});
	}

	// @todo restrict possible payment amounts
    function stakeForPromise(bytes32 promiseId, bytes memory responseSismo) external payable {
        require(promises[promiseId].politician != address(0), "Promise does not exist");
		require(promises[promiseId].endBlock < block.number, "Staking period has already ended");
        require(collectionB.balanceOf(msg.sender) > 0, "Must own an NFT from collection B");
        require(msg.value > 0, "Must send ETH to stake for a promise");

		verifySismoConnectResponse(responseSismo, citizenGroup);
		promises[promiseId].stake += msg.value;
    }

    function voteForPromise(bytes32 promiseId, bool vote, bytes memory responseSismo) external {
		require(promises[promiseId].politician != address(0), "Promise does not exist");
		require(promises[promiseId].stake > 0, "No ETH deposited for this promise");
		// @todo check Sismo
		require(promises[promiseId].endBlock > block.number, "Voting period has not started yet");
		require(promises[promiseId].endBlock + oneDayInBlocks < block.number, "Voting period has ended");
        require(collectionB.balanceOf(msg.sender) > 0, "Must own an NFT from collection B");

		Voting storage curr = votes[promiseId];
        require(!curr.voters[msg.sender], "You have already voted");

		verifySismoConnectResponse(responseSismo, citizenGroup);
        curr.voters[msg.sender] = true;
        curr.totalVotes += 1;
        if (vote) {
            curr.positiveVotes += 1;
        }
    }

	function resolveWithUma(bytes32 promiseId) public returns (bytes32 assertionId) {
		require(promises[promiseId].politician != address(0), "Promise does not exist");
		// @todo is 0 = ETH?
		uint256 bond = oo.getMinimumBond(address(defaultCurrency));
		defaultCurrency.safeTransferFrom(msg.sender, address(this), bond);
		defaultCurrency.safeApprove(address(oo), bond); // @note no idea whats happening
		assertionId = oo.assertTruth(
			abi.encodePacked(
				"Politician is claiming that the promise ",
				promises[promiseId].statement,
				" has been fulfilled"
			),
			msg.sender,
			address(this),
			// @todo make use of the escalationManager
			address(0),
			oneDayInBlocks,
			defaultCurrency,
			bond,
			defaultIdentifier,
			bytes32(0) // @todo later replace with appropriate domain for escalationManager
		);
		assertions[assertionId] = promiseId;
	}

    function assertionResolvedCallback(bytes32 assertionId, bool assertedTruthfully) public {
        require(msg.sender == address(oo));
        // If the assertion was true, then the policy is settled.
        if (assertedTruthfully) {
            promises[assertions[assertionId]].resolved = true;
        }
    }

    function withdraw(bytes32 promiseId) external {
		require(promises[promiseId].politician != address(0), "Promise does not exist");
        require(promises[promiseId].stake > 0, "No ETH deposited for this promise");
		// @todo replace 100 with appropriate voting time
		require(block.number >= promises[promiseId].endBlock + oneDayInBlocks, "Voting period has not ended yet");
		require(promises[promiseId].endBlock > block.number, "Voting period has not started yet");

        Voting storage curr = votes[promiseId];
        require(curr.totalVotes > 0, "No votes cast for this promise");
		require(msg.sender == promises[promiseId].politician, "Only the promise's creator can withdraw");

        if ((curr.positiveVotes * 2) >= curr.totalVotes || promises[promiseId].resolved) {
            payable(msg.sender).transfer(promises[promiseId].stake);
        } else {
            BURN_ADDRESS.transfer(promises[promiseId].stake);
        }
    }
}