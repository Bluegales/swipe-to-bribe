// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@uma/core/contracts/optimistic-oracle-v3/implementation/ClaimData.sol";
import "@uma/core/contracts/optimistic-oracle-v3/interfaces/OptimisticOracleV3Interface.sol";

import "./SismoVerifier.sol";

// @todo add events for all functions
// @todo especially emit promiseCreated event
// @todo remove NFT collection placeholders in constructor and the functions
// @todo which currency to use?
// @todo do I have to store the promises? take look at insurance UMA contract, they do it differently
// @todo add UMA more-than-yes-or-no check
// @todo add upper limit for staking
contract PromiseEscrow
{
    using SafeERC20 for IERC20;
    IERC20 public immutable                      currency;
    OptimisticOracleV3Interface public immutable oo;
    bytes32 public immutable                     defaultIdentifier;
    uint64 public constant                       oneDayInBlocks = 7200;
    SismoVerifier public                         sismoVerifier;

    // struct Voting {
    //     uint                     totalVotes;
    //     uint                     positiveVotes;
    //     mapping(address => bool) voters;
    // }

    struct Promise
    {
        address politician;
        string  statement;
        uint256 stake;
        uint32  assertedOutcome;
        uint32  payedOutcome;
        bool    resolved;
    }

    struct AssertedPromise {
        address asserter; // Address of the asserter used for reward payout.
        bytes32 promiseId; // Identifier for promises mapping.
    }

    // mapping(bytes32 => Voting) public  votes;
    mapping(bytes32 => Promise)         public promises;
    mapping(bytes32 => AssertedPromise) public assertedPromises; // Maps assertionId to Assertedpromise.

    // mapping(bytes32 => bytes32) public assertions;

    // address payable constant BURN_ADDRESS = payable(0x000000000000000000000000000000000000dEaD);

    constructor(address _currency, address _optimisticOracleV3)
    {
        // collectionA = IERC721(_collectionA);
        // collectionB = IERC721(_collectionB);
        currency = IERC20(_currency);
        oo = OptimisticOracleV3Interface(_optimisticOracleV3);
        defaultIdentifier = oo.defaultIdentifier();
    }

    function getPromise(bytes32 promiseId) public view returns (Promise memory) {
        return promises[promiseId];
    }

    function createPromise(string memory statement) public returns (bytes32 promiseId)
    {
        sismoVerifier.verifyPolitician(abi.encodePacked("Creating promise ", statement));

        promiseId = keccak256(abi.encode(statement, msg.sender));
        require(promises[promiseId].politician == address(0), "promise already exists");
        promises[promiseId] = Promise
        ({
            politician: msg.sender,
            statement: statement,
            stake: 0,
            assertedOutcome: 0,
            payedOutcome: 0,
            resolved: false
        });
    }

    // @todo restrict possible payment amounts
    function    stakeForPromise(bytes32 promiseId, bytes memory responseSismo) external payable
    {
        sismoVerifier.verifyCitizen(responseSismo, abi.encodePacked("Staking ", msg.value, " for promise ", promises[promiseId].statement));

        require(promises[promiseId].politician != address(0), "Promise does not exist");
        require(msg.value > 0, "Must send ETH to stake for a promise");

        promises[promiseId].stake += msg.value;
    }


    function assertPromise(bytes32 promiseId, uint32 assertedOutcome) public returns (bytes32 assertionId) {
        Promise storage promise_ = promises[promiseId];
        require(promise_.politician != address(0), "promise does not exist");
        require(outcomePercentage > 0 && outcomePercentage <= 100, "percentage outside valid range");

        require(promise_.assertedOutcome == bytes32(0), "Assertion active or resolved");
        promise_.assertedOutcome = assertedOutcome;

        uint256 bond = oo.getMinimumBond(address(defaultCurrency));
        bytes memory claim = _composeClaim(assertedOutcome, promise_.statement);


        uint256 bond = oo.getMinimumBond(address(currency)); // OOv3 might require higher bond.
        bytes memory claim = _composeClaim(assertedOutcome, promise_.statement);

        // Pull bond and make the assertion.
        currency.safeTransferFrom(msg.sender, address(this), bond);
        currency.safeApprove(address(oo), bond);
        assertionId = _assertTruthWithDefaults(claim, bond);

        // Store the asserter and promiseId for the assertionResolvedCallback.
        assertedPromises[assertionId] = Assertedpromise({ asserter: msg.sender, promiseId: promiseId });

        emit promiseAsserted(promiseId, assertedOutcome, assertionId);
    }

    function    assertionResolvedCallback(bytes32 assertionId, bool assertedTruthfully) public
    {
        require(msg.sender == address(oo), "Not authorized");
        Promise storage promise_ = promises[assertions[assertionId].promiseId];

        if (assertedTruthfully)
        {
            promise_.resolved = true;
            if (promise_.stake > 0) {
                uint265 amount = (promise_.assertedOutcome - promise_.payedOutcome) * promise_.stake;
                promise_.payedOutcome = promise_.assertedOutcome;
                currency.safeTransfer(promise_.politician, amount);
            }
            emit promiseResolved(assertedPromises[assertionId].promiseId);
        }
        promise_.assertedOutcome = 0;
    }

    function    assertionDisputedCallback(bytes32 assertionId) public {}

    function _composeClaim(uint32 count, bytes memory description) internal view returns (bytes memory) {
        return
            abi.encodePacked
            (
                "During the elected period the described promise has been fulfilled to",
                count,
                "%, the promise is: ",
                description
            );
    }

    function _assertTruthWithDefaults(bytes memory claim, uint256 bond) internal returns (bytes32 assertionId) {
        assertionId = oo.assertTruth(
            claim,
            msg.sender, // Asserter
            address(this), // Receive callback in this contract.
            address(0), // No sovereign security.
            assertionLiveness,
            currency,
            bond,
            defaultIdentifier,
            bytes32(0) // No domain.
        );
    }
}

    // function    voteForPromise(bytes32 promiseId, bool vote, bytes memory responseSismo) external
    // {
    //     require(promises[promiseId].politician != address(0), "Promise does not exist");
    //     require(promises[promiseId].stake > 0, "No ETH deposited for this promise");
    //     // @todo check Sismo
    //     require(promises[promiseId].endBlock > block.number, "Voting period has not started yet");
    //     require(promises[promiseId].endBlock + oneDayInBlocks < block.number, "Voting period has ended");
    //     require(collectionB.balanceOf(msg.sender) > 0, "Must own an NFT from collection B");

    //     Voting storage curr = votes[promiseId];
    //     require(!curr.voters[msg.sender], "You have already voted");

    //     sismoVerifier.verifyCitizen(responseSismo, abi.encodePacked("Voting for promise ", promises[promiseId].statement));
    //     curr.voters[msg.sender] = true;
    //     curr.totalVotes += 1;
    //     if (vote)
    //     {
    //         curr.positiveVotes += 1;
    //     }
    // }

    
    // function withdraw(bytes32 promiseId) external
    // {
    //     require(promises[promiseId].politician != address(0), "Promise does not exist");
    //     require(promises[promiseId].stake > 0, "No ETH deposited for this promise");
    //     // @todo replace 100 with appropriate voting time
    //     require(block.number >= promises[promiseId].endBlock + oneDayInBlocks, "Voting period has not ended yet");
    //     require(promises[promiseId].endBlock > block.number, "Voting period has not started yet");

    //     Voting storage curr = votes[promiseId];
    //     require(curr.totalVotes > 0, "No votes cast for this promise");
    //     require(msg.sender == promises[promiseId].politician, "Only the promise's creator can withdraw");

    //     if ((curr.positiveVotes * 2) >= curr.totalVotes || promises[promiseId].resolved)
    //     {
    //         payable(msg.sender).transfer(promises[promiseId].stake);
    //     }
    //     else
    //     {
    //         BURN_ADDRESS.transfer(promises[promiseId].stake);
    //     }
    // }
