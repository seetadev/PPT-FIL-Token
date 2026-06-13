require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    "calibnet": {
      url: process.env.CALIBNET_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    "filecoin": {
      url: process.env.FILECOIN_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    "op-sepolia": {
      url: process.env.OP_SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    "op-mainnet": {
      url: process.env.OP_MAINNET_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    "arbitrumSepolia": {
      url: process.env.ARBITRUM_SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    "celo-alfajores": {
      url: process.env.CELO_ALFAJORES_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: {
      "calibnet": process.env.CALIBNET_VERIFY_KEY || "",
      "op-sepolia": process.env.OP_VERIFY_KEY || "",
      "op-mainnet": process.env.OP_VERIFY_KEY || "",
      "optimism": process.env.OP_VERIFY_KEY || "",
      "arbitrumSepolia": process.env.ARBITRUM_VERIFY_KEY || "",
      "celo-alfajores": process.env.CELO_VERIFY_KEY || ""
    },
    customChains: [
      {
        network: "calibnet",
        chainId: 314159,
        urls: {
          apiURL: "https://api.calibration.node.glif.io/rpc/v1",
          browserURL: "https://calibration.filscan.io"
        }
      },
      {
        network: "op-sepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
          browserURL: "https://sepolia-optimism.etherscan.io"
        }
      },
      {
        network: "optimism",
        chainId: 10,
        urls: {
          apiURL: "https://api-optimistic.etherscan.io/api",
          browserURL: "https://optimistic.etherscan.io"
        }
      },
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/"
        }
      },
      {
        network: "celo-alfajores",
        chainId: 44787,
        urls: {
          apiURL: "https://api-alfajores.celoscan.io/api",
          browserURL: "https://alfajores.celoscan.io"
        }
      },
      {
        network: "op-mainnet",
        chainId: 10,
        urls: {
          apiURL: "https://api-optimistic.etherscan.io/api",
          browserURL: "https://optimistic.etherscan.io"
        }
      }
    ]
  }
};
