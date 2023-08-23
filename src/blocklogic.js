import { ethers } from 'ethers'
import React, { useState, useEffect, useRef } from 'react';

import { createRoot } from 'react-dom/client';


import { PollComponent, PollForm } from './components/pollComponents';

import pollFactoryArtifact from "./artifacts/contracts/Voting.sol/PollFactory.json"
import pollArtifact from "./artifacts/contracts/Voting.sol/Poll.json"

const pollFactoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const provider = new ethers.BrowserProvider(window.ethereum);

async function _establish_connection(address, abi, signer) {
    // We first initialize ethers by creating a provider using window.ethereum
    // When, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    const contract = new ethers.Contract(
        address,
        abi,
        signer
    );

    return contract
}

async function makePoll(question, options) {
    console.log("Making poll...")
    const signer = await provider.getSigner();
    const contract = await _establish_connection(pollFactoryAddress, pollFactoryArtifact.abi, signer)
    const pollIndex = await contract.getPollsLength()
    // The new poll index is going to be the current length of the polls array
    console.log("Poll index: ", pollIndex)
    const tx = await contract.makePoll(question, options, 0)
    await tx.wait()
    const pollAddress = await contract.getPoll(pollIndex)
    console.log("Created poll at address: ", pollAddress, " with index: ", pollIndex, ".\tQuestion: ", question, "\tOptions: ", options, "\tUnlock Time: ", 0)
    return pollAddress
}

async function votePoll(pollAddress, option) {
    console.log("Voting on poll...")
    const signer = await provider.getSigner();
    const contract = await _establish_connection(pollAddress, pollArtifact.abi, signer)
    const tx = await contract.vote(option)
    await tx.wait()
    console.log("Voted on poll at address: ", pollAddress, " with option: ", option)
    // Print the total votes for each option
    const votes = await contract.prettyGetVotes()
    console.log("Votes: ", votes)
}

async function getPollComponentFromAddress(pollAddress) {
    const signer = await provider.getSigner();
    const contract = await _establish_connection(pollAddress, pollArtifact.abi, signer)
    const question = await contract.getQuestion()
    const options = await contract.getOptions()
    const votes = await contract.prettyGetVotes()
    const onVote = async () => {
        const option = prompt("Enter the option you want to vote for: ")
        await votePoll(pollAddress, option)
        console.log("Voted on poll at address: ", pollAddress, " with option: ", option)
    }

    return (
        <PollComponent question={question} options={options} votes={votes.split(',')} onVote={onVote} />
    )
}

async function _initial_load() {
    // Get all active poll's addresses
    const signer = await provider.getSigner();
    const contract = await _establish_connection(pollFactoryAddress, pollFactoryArtifact.abi, signer)
    const pollAddresses = await contract.getPolls()
    console.log("Poll addresses: ", pollAddresses)

    // Create a PollComponent for each poll address
    const root = createRoot(document.getElementById("pollsList"))
    const pollComponents = []
    for (const pollAddress of pollAddresses) {
        const pollComponent = await getPollComponentFromAddress(pollAddress)
        pollComponents.push(pollComponent)
    }
    root.render(
        <ul>
            {pollComponents.map((pollComponent) => (
                <li>{pollComponent}</li>
            ))}
        </ul>
    )
}




export { makePoll, _initial_load, getPollComponentFromAddress };