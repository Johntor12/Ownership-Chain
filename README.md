# Ancient Sclupture Project's: OwnershipChain

## OwnershipChain

### Problem 

High-value assets like land, buildings, businesses, and art often face issues such as theft through document fraud, unclear ownership records, and the absence of transparent systems for shared ownership leading to legal disputes and limiting fair, inclusive access to investment and co-ownership.

See This Page For Further Problem Case: https://ancientsclupture.github.io/Ownership-Chain/

### Target Solution
The problem is addressed through tokenization of real-world assets using Internet Computer Protocol (ICP) technology. This solution aims to:

- **Secure ownership data** by recording it on an immutable blockchain, protecting it from manipulation or forgery.

- **Increase transparency and accountability** in every transaction or change in ownership status.

- **Enable fractional ownership** in a digital and legally compliant way, allowing individuals to own portions of high-value assets.

- **Bridge the physical and digital worlds efficiently**, enabling digital interactions such as selling, leasing, revenue sharing, or real-time asset status reporting.

With this approach, assets like properties, businesses, or artworks can be managed in a modern, secure, and inclusive way, both locally and globally.


## Features

This Web3 application is designed to tokenize and manage real-world assets using the Internet Computer Protocol (ICP). It provides an end-to-end decentralized system for asset registration, fractional ownership, marketplace trading, and transparent ownership history.

### 🔐 Secure Ownership & Asset Management

* Assets (e.g. properties, businesses, artworks) are registered and stored securely on-chain via the `createAsset` function.
* Each asset is uniquely identified and linked to an owner (principal) with a record of ownership shares.

### 📈 Dashboard Overview (`/`)

* Displays a **summary of all tokenized assets**.
* Shows metrics such as number of assets, total ownership shares, and potential earnings from dividends.

### 🧾 Personal Asset View (`/assets`)

* Lists all assets owned by the logged-in user, including:

  * Status of buy/sell proposals.
  * Vote on existing proposals (if already a shareholder).
  * Dividend payout history.
* Connected to the backend via `getUserAssets`, `getUserProfile`, and `getDividendHistory`.

### 🏪 Marketplace (`/marketplace`)

* Browse available assets for sale or fractional purchase.
* Enables tokenized **buying of ownership shares** via `buyTokens`, pending voting approval.
* Real-time updates of proposals using `getBuyProposals` and `approveBuyProposal`.

### 🔍 Marketplace Asset Detail (`/marketplace/:id`)

* Shows **detailed information** for a selected asset:
  * Ownership share percentage breakdown.
  * Dividend distribution history via `getDividendHistory`.
  * Active and past buy proposals via `getBuyProposals` & `getProposalStatus`.
* Allows user to:

  * Submit buy proposals (`createBuyProposal`).
  * View transaction history and ownership timeline (`getAssetHistory`).

### 📊 Proposal Voting & Governance

* Every transaction involving share transfer must go through a decentralized approval process:

  * Token purchase requests are subject to **voting by existing shareholders** (≥50% approval required).
  * The `approveBuyProposal` function supports secure multi-party governance.

### 🤝 Dividend & Revenue Sharing

* Enables asset owners to **distribute dividends** to shareholders.
* Shareholders can track and claim their dividends securely on-chain.

### 🔄 Full ICP Integration

* Built using Internet Computer (ICP) smart contracts (canisters).
* Assets and ownership data are immutable, transparent, and cryptographically secure.

### Future Development

* I propose an `historical summary of the assets owner` using llm, because of the limited time provided to me. I only inject the llm inside the web3, but not using it.
This Fututure development will help user to see the asset credibelity transparently, so the user can decided whether to buy or sell or cancle to buy the assets.
* I propose the further kyc too, with implementation of using wallet sign-in so the feature before `historical summary of the assets owner`, will be approved and work well.

We Use:

- 💻 **Motoko-based Canister** backend
- 🔥 **React + Tailwind + Typescript** frontend
- 🤖  **IC LLM Canister** integration of Agentic AI as a helpfull agent ai.

---

## 📜 Table of Contents

- [🎥 Recording](#-recording)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [✅ Testing Results](#-testing-patterns)
- [🔄 CI/CD and Testing](#-cicd-workflow-and-testing)
- [🔗 Resources & Documentation](#-learning-resources)
- [🤝 Contributor](#-teams)

---

## 🎥 Recording

You can see here the full recording: [yt link]

---

## 🚀 Getting Started

### 1. Pre Requirements
1. Download and install motoko locally:
**`Installing the motoko`**
```bash
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

2. Verification
```bash
dfx --version
```

**`Installing the node js`**
1. Download and install nvm:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```
2. in lieu of restarting the shell
```bash
\. "$HOME/.nvm/nvm.sh"
```

3. Download and install Node.js:
```bash
nvm install 22
```

4. Verivication
```bash
node -v # Should print your node version
nvm current # Should print "v22.17.1".
npm -v # Should print your npm version.
```

### 2. Install Dependencies and Agent AI

**`Installing the npm for react frontend`**
```bash
npm install
```
**`Installing the mops dependencies for backend motoko`**
```bash
mops install
```

**`Installing / get the llm model`**

```bash
ollama run llama3.1:8b
```
Once the command executes and the model is loaded, you can terminate because the model will automatically run using the model `[in-case the onlu model you have installed is llama3.1:8b]`

The ollama is ussualy run and listening on port 11434

### 4. Deployment Mode

Keep the terminal on and run:

```bash
dfx start --clean
```

Keep this tab open for reading logs.

Then pull the dependency and deploy the canisters frontend and backend do:

```bash
dfx deploy
```
Then to pull and deploy llm canister:

```bash
dfx deps pull
dfx deps deploy
```

### 5. Start the Developing Process

You can start the frontend development server with:

```bash
npm start
```

after that go and view the frontend in port 5173 **(vite port)**

**For Simplification Just Run (this file run all that process)**:
```bash
# grant permission for bash file
chmod +x ./scripts/dev-container-setup.sh 

# run the scripts
./scripts/dev-container-setup.sh 
```

### 6. Granted setup Helper and simulation helper
```bash
chmod +x ./scripts/dev-container-setup.sh 
chmod +x ./scripts/simulation_agent_create_assets.sh 
chmod +x ./scripts/simulation_helper.sh 
```

---

## 📁 Project Structure

```
Ownership-Chain/
├── .devcontainer/devcontainer.json       # Container config for running your own codespace
├── .github/workflows/                    # GitHub CI/CD pipelines
├── src/
│   ├── backend/                          # Motoko backend canister
│   │   └── main.mo                       # Main Motoko file
│   ├── frontend/                         # React + Tailwind + TypeScript frontend
│   │   ├── src/
│   │   │   ├── App.tsx                   # Main App component
│   │   │   ├── index.css                 # Global styles with Tailwind
│   │   │   ├── components/               # Reusable UI components
│   │   │   ├── services/                 # Canister service layers
│   │   │   └── screens/                  # Page-level components
│   │   ├── assets/                       # Static assets (images, icons)
│   │   ├── tests/                        # Frontend unit tests
│   │   ├── index.html                    # Frontend entry point
│   │   ├── main.tsx                      # React main file
│   │   ├── package.json                  # Frontend dependencies
│   │   ├── tsconfig.json                 # TypeScript configuration
│   │   ├── vite.config.ts                # Vite build configuration
│   │   └── vite-env.d.ts                 # Vite type definitions
│   └── declarations/                     # Auto-generated canister interfaces
├── tests/
│   ├── src/                              # Backend test files
│   ├── backend-test-setup.ts             # PocketIC instance
│   └── vitest.config.ts                  # Vitest configuration
├── scripts/
│   ├── dev-container-setup.sh            # Extra set up steps for codespace
├── dfx.json                              # ICP config
└── mops.toml                             # Root Motoko package config
```

---

## 🔄 CI/CD Workflow And Testing

### Run Tests

```bash
npm test
```

---


## 📚 Learning Resources

- [ICP Dev Docs](https://internetcomputer.org/docs)
- [Motoko Docs](https://internetcomputer.org/docs/motoko/home)
- [PicJS Doc](https://dfinity.github.io/pic-js/)
- [Vitest Testing Framework](https://vitest.dev/)

---

## 🤝 **Teams**


---

