# Blockvote: Ethereum-Based Decentralized Voting Platform
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/frederikgramkortegaard/https://github.com/frederikgramkortegaard/decentralized-voting/blob/master/LICENSE)
[![CodeQL](https://github.com/frederikgramkortegaard/https://github.com/frederikgramkortegaard/decentralized-voting/workflows/CodeQL/badge.svg)](https://github.com/frederikgram/https://github.com/frederikgramkortegaard/decentralized-voting/actions?query=workflow%3ADependency+Review)
[![Dependency Review](https://github.com/frederikgramkortegaard/https://github.com/frederikgramkortegaard/decentralized-voting/workflows/Dependency%20Review/badge.svg)]()
Blockvote is a decentralized voting platform built on the Ethereum blockchain, utilizing smart contracts powered by Web3 and Solidity. This project aims to provide a secure and transparent way for conducting digital voting while ensuring immutability and tamper resistance.

## Features

- **Decentralized Voting:** Blockvote allows users to participate in voting without the need for intermediaries. The decentralized nature of the platform ensures that votes are recorded on the Ethereum blockchain, providing transparency and security.

- **Smart Contracts:** The voting process is governed by smart contracts written in Solidity. These contracts autonomously handle the voting logic, ensuring that the process is tamper-proof and verifiable.

- **Web3 and React Frontend:** The frontend of the Blockvote application is developed using Node.js and React, providing an intuitive user interface for voters to cast their votes and monitor ongoing polls.

- **Testing and Deployment:** Comprehensive testing scripts using Hardhat have been devised to ensure the robustness and reliability of the smart contracts. Additionally, deployment scripts are included to facilitate the deployment of the application onto the Ethereum network.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js: Make sure you have Node.js installed on your system.
- Ethereum Wallet: Install a compatible Ethereum wallet like MetaMask to interact with the DApp.
- Ethereum Network: You'll need an Ethereum network to deploy and interact with the smart contracts. See [here](#setting-up-the-ethereum-network) to setup a local Ethereum network using Hardhat

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/blockvote.git
```
2. Navigate to the project directory:
```
cd blockvote
```

### Install Node.js 
```bash
npm install
```

### Install Web3 Libraries
3. Blockvotes uses the following npm librarie
```
npm install ethers@5.7 hardhat @nomiclabs/hardhat-waffle ethereum-waffle @nomiclabs/hardhat-ethers chai
```
Ethers is a 'A complete, compact and simple library for Ethereum and ilk, written in TypeScript.' It is used to interact with the Ethereum blockchain and smart contracts.

Hardhat is a development environment to compile, deploy, test, and debug your Ethereum software. It is used to compile and deploy the smart contracts.¨

## Usage
### Setting up the Ethereum Network
Before running this DApp on the blockchain, testing should be done by the user to ensure proper functionality. This can be done by setting up a local Ethereum network using Hardhat. To do so, follow the steps below:
1. Start a local testnode 
```bash
npx hardhat node
```
2. Deploy the DApp onto the local chain
```bash
npx hardhat run scripts/deploy.js --network localhost
```
3. Configure Metamask to use the test network
See [the following guide](https://medium.com/@kaishinaw/connecting-metamask-with-a-local-hardhat-network-7d8cea604dc6). IMPORTANT! Instead of "HardhatETH" as the currency symbol, just write ETH, as we're not developing a token.
4. Run NPM
```bash
npm run start
```
5. The DApp should now be running on localhost:3000
The application works by creating a poll, and then voting on it. The poll can be created by entering the question and the options, and then clicking on the "Create Poll" button. The poll will be created and displayed on the screen. The user can then vote on the poll by clicking on the "Vote" button, and then entering the option name. It is not possible to vote more than once per account.
## Testing
The smart contracts have been tested using Hardhat. To run the tests, run the following command:
```bash
npx hardhat test
```

## Contributing
Especially with regards to the graphical fidelity of the DApp, there is a lot of room for improvement. If you have any suggestions, feel free to open an issue to discuss a new feature or a change you would like to see.

## Troubleshooting
If you have any issues with the application, please open an issue to discuss the problem you are facing.

## License
This project uses the [MIT License](https://choosealicense.com/licenses/mit/).