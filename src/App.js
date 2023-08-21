import { ethers } from 'ethers'
import React, { useState, useEffect, ref } from 'react';
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

  async function makePoll(question, options, unlockTime) {
    const signer = await provider.getSigner();
    const contract = await _intializeContract(signer)
    const pollIndex = await contract.getPollsLength()
    const tx = await contract.makePoll(question, options, unlockTime)
    await tx.wait()
    const pollAddress = await contract.getPoll(pollIndex)
    console.log("Created poll at address: ", pollAddress, " with index: ", pollIndex, ".\tQuestion: ", question, "\tOptions: ", options, "\tUnlock Time: ", unlockTime)
  }

  async function renderPollFromAddress(pollAddress) {
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

  async function getPollsAddresses() {
    const signer = await provider.getSigner();
    const contract = await _intializeContract(signer)
    const pollsLength = await contract.getPollsLength()
    const polls = []
    for (let i = 0; i < pollsLength; i++) {
      const pollAddress = await contract.getAddressOfPoll(i)
      polls.push(pollAddress)

    }

    return polls
  }


  // Fetch all polls which exists as render-time
  const [items, setItems] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const polls = await getPollsAddresses()
      const pollsToRender = []
      for (let i = 0; i < polls.length; i++) {
        const poll = await renderPollFromAddress(polls[i])
        pollsToRender.push(poll)
      }
      setItems(pollsToRender)
    }
    fetchData()
  }, [])

  // Handle Input for Poll Creation
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['']); // Initialize with one empty option

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']); // Add an empty option
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  const handleMakePollClick = () => {
    // Perform your desired action with the question and options

    // Assert that 'question' is not empty
    if (!question) {
      console.log("Question is empty")
      return
    }

    // Assert that there are at least two options
    if (options.length < 2) {
      console.log("There are less than two options")
      return
    }

    // Assert that all options are not empty
    for (let i = 0; i < options.length; i++) {
      if (!options[i]) {
        console.log("Option ", i, " is empty")
        return
      }
    }

    makePoll(question, options, 0) // Ingore UnlockTime for now...
    console.log("Made poll with question: ", question, " and options: ", options)
    setQuestion('');
    setOptions(['']);
  };


  class DataInputComponent extends React.Component {
    render() {
      return (
        <div>
          <h1>Data Input Component</h1>

          <label>
            Question:
            <br /> <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question"
            />
          </label>
          <br />
          <label>
            Options:
            {options.map((option, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                {index > 0 && (
                  <button onClick={() => handleRemoveOption(index)}>Remove</button>
                )}
              </div>
            ))}
            <button onClick={handleAddOption}>Add Option</button>
          </label>
        </div >
      )
    }
  }


  return (
    <div>
      <h1>Make a Poll</h1>
      <DataInputComponent />
      <button onClick={handleMakePollClick}>Make Poll!</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div >
  );

}

export default App;
