import { ethers } from 'ethers'
import React, { useState } from 'react';
import contractArtifact from "./artifacts/contracts/Voting.sol/PollFactory.json"
const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"


function App() {

  const [polls, setPolls] = useState([])

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = provider.getSigner();
  async function _intializeContract(init) {
    // We first initialize ethers by creating a provider using window.ethereum
    // When, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    const contract = new ethers.Contract(
      contractAddress,
      contractArtifact.abi,
      init
    );

    return contract
  }

  async function getAccount() {
    const acc = ethers.BrowserProvider(window.ethereum).getSigner()
  }

  async function makePoll(question, options, unlockTime) {
    const signer = await provider.getSigner();

    const contract = await _intializeContract(signer)
    console.log("Making poll")

    const tx = await contract.makePoll(question, options, unlockTime)
    console.log(tx)
    const receipt = await tx.wait()


  }



  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => makePoll("What is your favorite color?", ["Red", "Blue"
          , "Green"], 10
        )}>Make Poll</button>
      </header>
    </div>
  );
}

export default App;
