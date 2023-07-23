import React, { useState, useMemo, useRef, useContext } from "react";
import TinderCard from "react-tinder-card";
import { config } from "dotenv";
import { CONTRACT_ADDRESS, SISMO_CONST } from  './constants'
import { UserContext } from './App';
import { IBundler, Bundler } from "@biconomy/bundler";
import {
  BiconomySmartAccount,
  BiconomySmartAccountConfig,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import { Wallet, providers, ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import {
  IPaymaster,
  BiconomyPaymaster,
  IHybridPaymaster,
  PaymasterMode,
  SponsorUserOperationDto,
} from "@biconomy/paymaster";

config();
import { ethers } from 'ethers';
import ABI from './abi.json'
import { CONTRACT_ADDRESS, SISMO_CONST } from  './constants'
import { UserContext } from './App';

//we dont want to use this anymore
const db = [
  {
    promise: "Some Things are gonna need to be done",
    name: "Patrick Fuchs",
    party: "42 Heilbronn",
    url: "./img/dinesh.jpg",
  },
  {
    promise: "Some Things are gonna need to be done",
    name: "Angela Merkel",
    party: "CDU",
    url: "./img/richard.jpg",
  },
  {
    promise: "Some Things are gonna need to be done",
    name: "Emmanuel Macron",
    party: "Renaissance",
    url: "./img/erlich.jpg",
  },
  {
    promise: "yessss",
    name: "Joe Biden",
    party: "Democratic Party",
    url: "./img/monica.jpg",
  },
  {
    promise: "Some Things are gonna need to be done",
    name: "Marine Le Pen",
    party: "National Rally",
    url: "./img/jared.jpg",
  },
];

function Cards() {
  const { address } = useContext(UserContext);
  const { sismoResponse } = useContext(UserContext);
  const [currentIndex, setCurrentIndex] = useState(db.length - 1);;
  const [lastDirection, setLastDirection] = useState();;
  let promiseArray = [];
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);
  const bundler = new Bundler({
    bundlerUrl: "https://bundler.biconomy.io/api/v2/5/abc", // you can get this value from biconomy dashboard.
    chainId: ChainId.GOERLI,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  });

  const paymaster = new BiconomyPaymaster({
    paymasterUrl:
      "https://paymaster.biconomy.io/api/v1/5/LQp8FEukU.26be3b3a-7f6b-4483-9525-36007d2a7306",
  });

  const provider = new providers.JsonRpcProvider(
    "https://mainnet.infura.io/v3/cc4dfaed43d64627b49f83a8f98d6f78"
  );
  const wallet = new Wallet(process.env.PRIVATE_KEY || "", provider);

  const biconomySmartAccountConfig = {
    signer: wallet,
    chainId: ChainId.GOERLI,
    bundler: bundler,
    paymaster: paymaster,
  };

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    if (direction === "left" || direction === "skipped")
      setLastDirection("skipped");
    else {
      setLastDirection("bribed");
      createTransaction();
    }
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  async function createAccount() {
    let biconomySmartAccount = new BiconomySmartAccount(
      biconomySmartAccountConfig
    );
    biconomySmartAccount = await biconomySmartAccount.init();
    console.log("owner: ", biconomySmartAccount.owner);
    console.log(
      "address: ",
      await biconomySmartAccount.getSmartAccountAddress()
    );
    return biconomySmartAccount;
  }

  async function getPromise() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    try {
      const tx = await contract.promiseArr(0);
      console.log((tx));
      const promise = ethers.utils.toUtf8String(tx[2]);
    } catch (error) {
      console.log("Error while creating campaign: ", error);
    }
    return (promise);
  } 

  const promise = getPromise();
  // @note need the promise data here
  const createTransaction = async () => {
    const usdtAddress = "0xfad6367E97217cC51b4cd838Cc086831f81d38C2";
    const smartContractAddress = "0x8e46A84eCf34caff642b9B6c38Da3511187DE707";
    const smartContractInterface = new ethers.utils.Interface([
        // @note is this the correct form?
        "function stakeForPromise(uint256 promiseID, bytes memory sismoSig, bytes memory sismoResponse)",
    ])
    const erc20Interface = new ethers.utils.Interface([
      "function transfer(address _to, uint256 _value)",
    ]);
    const usdtData = erc20Interface.encodeFunctionData("transfer", [
      smartContractAddress,
      1000000,
    ]);
    const smartContractData = smartContractInterface.encodeFunctionData("stakeForPromise", [
        // @note need the promise data here
    ])
    // @note need to check if the "to" addresses here are correct
    const usdtTransaction = {
      to: usdtAddress,
      data: usdtData,
    };
    const smartContractTransaction = {
        to: smartContractAddress,
        data: smartContractData,
    }
    promiseArray.push(transaction);
    promiseArray.push(smartContractTransaction);
  };

  const submitVotes = async () => {
    const smartAccount = await createAccount();
    let partialUserOp = await smartAccount.buildUserOp(promiseArray);
    const biconomyPaymaster = smartAccount.paymaster;

    let paymasterServiceData = {
      mode: PaymasterMode.SPONSORED,
    };
    try {
      const paymasterAndDataResponse =
        await biconomyPaymaster.getPaymasterAndData(
          partialUserOp,
          paymasterServiceData
        );
      partialUserOp.paymasterAndData =
        paymasterAndDataResponse.paymasterAndData;
    } catch (e) {
      console.log("error received ", e);
    }

    try {
      const userOpResponse = await smartAccount.sendUserOp(partialUserOp);
      console.log(`userOp Hash: ${userOpResponse.userOpHash}`);
      const transactionDetails = await userOpResponse.wait();
      console.log(
        `transactionDetails: ${JSON.stringify(
          transactionDetails.logs[0].transactionHash,
          null,
          "\t"
        )}`
      );
    } catch (e) {
      console.log("error received ", e);
    }
  };

  return (
    <div classNames="middleblock">
      <link
        href="https://fonts.googleapis.com/css?family=Damion&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Alatsi&display=swap"
        rel="stylesheet"
      />
      <link
        href="//cdn.jsdelivr.net/npm/hack-font@3.3.0/build/web/hack.css"
        rel="stylesheet"
      />
      <div className="space"></div>
      <div className="cardContainer">
        {db.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="swipe"
            key={character.name}
            onSwipe={(dir) => swiped(dir, character.name, index)}
            onCardLeftScreen={() => outOfFrame(character.name, index)}
          >
            <div
              style={{ backgroundImage: "url(" + character.url + ")" }}
              className="card"
            >
              <p></p>
              <h3>{character.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="buttons">
        <button
          style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
          onClick={() => swipe("left")}
        >
          Skip
        </button>
        <button
          style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
          onClick={() => swipe("right")}
        >
          Bribe
        </button>
      </div>
      {lastDirection ? (
        <h2 key={lastDirection} className="infoText">
          You {lastDirection}!
        </h2>
      ) : (
        <div className="twoInfo">
          <h3 className="infoText">Swipe left - Skip</h3>
          <h3 className="infoText">Bribe - Swipe right</h3>
        </div>
      )}
    </div>
  );
}

export default Cards;
