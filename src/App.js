import { ethers } from 'ethers'
import React, { useState } from 'react';
import contractArtifact from "./artifacts/contracts/Voting.sol/PollFactory.json"
import pollArtifact from "./artifacts/contracts/Voting.sol/Poll.json"
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"


function App() {
  const ethers = require("ethers");

  const provider = new ethers.BrowserProvider(window.ethereum);
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
    const pollIndex = await contract.getPollsLength()
    const tx = await contract.makePoll(question, options, unlockTime)
    await tx.wait()
    const pollAddress = await contract.getPoll(pollIndex)
    console.log("Created poll at address: ", pollAddress, " with index: ", pollIndex, ".\tQuestion: ", question, "\tOptions: ", options, "\tUnlock Time: ", unlockTime)
  }

  async function _renderPollFromAddress(pollAddress) {
    console.log("Rendering poll at address: ", pollAddress)
    const signer = await provider.getSigner();
    const poll = new ethers.Contract(pollAddress, pollArtifact.abi, signer)

    const question = await poll.getQuestion()
    const options = await poll.getOptions()
    const votes = await poll.prettyGetVotes()
    console.log("Rendering poll with info: ", question, options, votes)
    return (
      <div>
        <h1>{question}</h1>
        <ul>
          {options.map((option, index) => (
            <li key={index}>{option}: {votes.split(',')[index]}</li>
          ))}
        </ul>
      </div>
    )
  }

  async function renderPollFromIndex(pollIndex) {
    console.log("Rendering poll at index: ", pollIndex)
    const signer = await provider.getSigner();
    const contract = await _intializeContract(signer)

    // Assert that the poll exists
    const pollsLength = await contract.getPollsLength()
    if (pollIndex >= pollsLength) {
      console.log("Poll at index ", pollIndex, " does not exist")
      return
    }

    const pollAddress = await contract.getAddressOfPoll(pollIndex)
    return _renderPollFromAddress(pollAddress)
  }



  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => makePoll("Test", ["1", "2", "3"], 5)}>Make Poll</button>
        <button onClick={() => renderPollFromIndex(0)}>Render Poll</button>
      </header>
    </div>
  );

}

export default App;
