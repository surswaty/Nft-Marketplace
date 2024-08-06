require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");

const fs = require('fs');

const INFURA_API_KEY = "c071e3450fe44baa8b2a096892250a39";

const SEPOLIA_PRIVATE_KEY = fs.readFileSync(".secret").toString().trim();

module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  },
};