require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  "paths": {
    "artifacts": "./src/artifacts",
  },
  solidity: "0.8.19",
  networks: {
    hardhat: {
      chainId: 3177
    }
  }
};
