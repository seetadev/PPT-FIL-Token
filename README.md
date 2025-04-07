# PPT-FIL-Token
ERC-20 Utility Token for Token Gated Access on Filecoin Mainnet

# Instructions

```git clone https://github.com/Chaitu-Tatipamula/Contracts.git```

Setup an env file with these fields
```
RPC_URL=""
PRIVATE_KEY=""
VERIFY_KEY=""
```
And set them with your required RPC and Etherscan Api key of desired network.

To deploy run this command, with –network flag you can modify the destination chain on which the contracts will be deployed and verified
Small hack just change the RPC URL of your desired chain it’ll get deployed there.

```npx hardhat run scripts/deploy.js --network filecoin```

