# 📦 PPT-FIL-Token

**PPT-FIL-Token** is an **ERC-20 utility token** deployed on the **Filecoin Mainnet**. It powers **token-gated access** for dApps and communities, enabling governance, staking, and gated participation within the Filecoin ecosystem.

---

## 🚀 Features

* ✅ **ERC-20 Standard** — Fully compatible with wallets and exchanges.
* 🔑 **Token Gated Access** — Use PPT to unlock gated features or communities.
* 🌐 **Filecoin Native** — Deployable on Filecoin EVM-compatible networks.
* 🔄 **Multi-chain Deployments** — Works across other EVM chains with simple config changes.

---

## 📂 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/seetadev/PPT-FIL-Token.git
cd PPT-FIL-Token
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory with the following values:

```env
RPC_URL=""        # RPC endpoint of your target chain
PRIVATE_KEY=""    # Private key of deployer wallet
VERIFY_KEY=""     # Etherscan (or Filfox/Blockscout) API key for contract verification
```

---

## 📜 Deployment

Run the deployment script with Hardhat:

```bash
npx hardhat run scripts/deploy.js --network filecoin
```

### Notes:

* The `--network` flag determines the deployment chain.
* To deploy to another EVM-compatible chain, update the `RPC_URL` in `.env`.
* Verification will automatically run if the explorer supports it (via your `VERIFY_KEY`).

---

## 🔧 Example: Deploying to Filecoin Mainnet

1. Set your `.env`:

   ```env
   RPC_URL="https://api.node.glif.io"
   PRIVATE_KEY="0xYOUR_PRIVATE_KEY"
   VERIFY_KEY="YOUR_FILFOX_API_KEY"
   ```
2. Deploy:

   ```bash
   npx hardhat run scripts/deploy.js --network filecoin
   ```

---

## 📖 Resources

* [Filecoin EVM Docs](https://docs.filecoin.io/smart-contracts/evm/)
* [OpenZeppelin ERC-20 Reference](https://docs.openzeppelin.com/contracts/4.x/erc20)
* [Hardhat Documentation](https://hardhat.org/getting-started/)

---

## 🤝 Contributing

Pull requests and feature suggestions are welcome. Please open an issue to discuss changes before submitting a PR.

---

## 📜 License

This project is licensed under the **MIT License**.

---

Would you like me to also add a **Usage section** (example scripts for minting, transferring, or checking balances) so new developers can test the token right after deployment?
