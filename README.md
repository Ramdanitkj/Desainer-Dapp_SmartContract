# 🛡️ Decentralized Design Escrow (DApp)

A secure, transparent, and automated escrow system built on the Ethereum blockchain. This project facilitates trustless transactions between a **Client** and a **Designer** (or any freelancer), ensuring that funds are only released upon successful delivery of work.

---

## 🚀 Key Features

- **State Machine Logic:** Prevents illegal state transitions (e.g., releasing payment before funds are deposited).
- **Security First:** Implements OpenZeppelin's `ReentrancyGuard` to prevent reentrancy attacks and `Address` utility for safe ETH transfers.
- **Client Protections:** Includes a `cancelEscrow` feature to withdraw funds if the project hasn't reached the delivery stage.
- **Reusable Contract:** `resetEscrow` functionality allows the same contract instance to be used for multiple project milestones.
- **Gas Optimized:** Uses `immutable` variables and efficient `enum` types to minimize gas costs.

---

## 🛠️ Smart Contract Workflow

The contract follows a strict lifecycle to ensure security:

1. **Created:** Contract is deployed with designated Client and Designer addresses.
2. **Funded:** Client deposits ETH.
3. **Delivered:** Designer marks the work as completed.
4. **Released/Refunded:** - Client approves and releases payment to Designer, OR
   - Client rejects delivery and issues a refund to themselves.
5. **Canceled:** Client can withdraw funds if the Designer hasn't marked the work as delivered.

---

## 💻 Tech Stack

- **Smart Contract:** Solidity (^0.8.20)
- **Framework:** OpenZeppelin (Security Standards)
- **Frontend:** HTML5, JavaScript (ES6+), Ethers.js (v6)
- **Provider:** MetaMask / Browser Provider

---

## 📜 How to Deploy & Use

### Prerequisites
- [MetaMask](https://metamask.io/) extension installed.
- Some testnet ETH (Sepolia or Holesky).

### Steps
1. **Deploy Contract:** Deploy `DappEscrow.sol` using Remix or Hardhat. Pass the Client and Designer addresses in the constructor.
2. **Update Frontend:** Copy the deployed contract address and ABI into your `app.js`.
3. **Run Locally:**
   Open `index.html` using a live server and connect your MetaMask.

---

## 🛡️ Security Considerations

This contract includes several safeguards:
- **Access Control:** Only the Client can fund/release/cancel; only the Designer can mark delivery.
- **Pull over Push:** Uses secure transfer patterns to avoid denial-of-service (DoS) vulnerabilities.
- **Reentrancy Protection:** All fund-transferring functions are protected by the `nonReentrant` modifier.

---

## 👤 Author
**[RAMDANI]** * GitHub: [@username](https://github.com/Ramdanitkj)
* Instagram: [linkedin.com/in/username](https://linkedin.com/in/userfraxzz)