# VortexEconomi: AMM & Prediction Market dApp on Flare Network

**Project Name**: VortexEconomi

## Overview
A full-stack dApp on the Flare Network combining:

- **Automated Market Maker (AMM)**
  - Add/remove liquidity and token swaps using a Uniswap V2–style router & factory deployed on Flare.
  - Real‑time price‑impact calculations from on‑chain reserves via Wagmi + Viem hooks.

- **Prediction Market**
  - Stake FLR to predict whether a crypto price will exceed a target by a deadline.
  - Dual ERC‑20 BetTokens minted at predict time (HighBetToken or LowBetToken).
  - Price feeds via Flare Time Series Oracle (FTSO) V2, on‑chain resolution, rewards distribution, and fee collection.

## Key Features

### Liquidity & Swap
- ERC‑20 ↔ ERC‑20 and FLR ↔ ERC‑20 liquidity provision, removal, and swaps.
- Debounced on‑chain ratio and `getAmountsOut` calculations for smooth UX.
- Approval flow and toast notifications for transaction status.

### Prediction Markets
- `CryptoMarketPool` Solidity contract supports:
  - `initialize` with dual BetToken addresses;
  - `predict` minting HighBetToken or LowBetToken up to MAX_SUPPLY;
  - `resolve` using FTSO V2 price data with stale‑price protection;
  - `claimRewards` distributing pooled stakes minus a 2% fee;
  - Optional fee‑withdraw function for protocol fees.
- Frontend watches `Predicted` events, fetches historical logs with pagination.
- UI for placing "Up"/"Down" bets, live market stats, and claiming rewards.

### Animations & UX
- GSAP ScrollTrigger for smooth section transitions on HomePage.
- Entry animations on PredictionPage.
- Responsive layouts styled via CSS modules and custom CSS (no Tailwind).

## Tech Stack
- **Frontend**: React, React Router v6, CSS Modules & global CSS, react-hot-toast, GSAP
- **Web3 Integration**: Wagmi hooks, Viem, @wagmi/core for event watchers
- **Contracts**: Solidity ^0.8.0, OpenZeppelin ReentrancyGuard
- **Oracle**: Flare FTSO V2 interface

## Project Structure
```
src/
├── abis/           # Contract ABIs & deployed addresses
├── components/     # Shared UI components (e.g., PredictionCard)
├── pages/          # HomePage.tsx & PredictionPage.tsx
├── styles/         # CSS modules and global styles
└── index.tsx       # App entry and Wagmi/provider setup
```

## Usage
1. **HomePage**
   - Connect wallet via injected provider (e.g., MetaMask on Flare).
   - Connect to flare testnet using this https://chainlist.org/chain/114
   - Add/remove liquidity or swap tokens through the AMM router.
   - View live price and on‑chain swap rates.

2. **PredictionPage**
   - Navigate via a PredictionCard (`/prediction/:asset`).
   - Place Up/Down bets with FLR before the participation deadline.
   - Watch live event logs of other users’ bets.
   - After resolution, claim rewards or view status.

## Contributing
Contributions welcome! Open issues or PRs for enhancements, bug fixes, or new features.

## License
@Techsteck
