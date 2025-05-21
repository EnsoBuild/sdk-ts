<div align="center">

[![NPM Version](https://img.shields.io/npm/v/%40ensofinance%2Fsdk)](https://www.npmjs.com/package/@ensofinance/sdk)
[![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/EnsoBuild)](https://x.com/EnsoBuild)

</div>

# Enso SDK

The Enso SDK provides a set of tools and methods to interact with the Enso API. It includes functionalities for token approvals, routing, quoting, and balance checking.

## Introduction

The Enso API offers two powerful routing components:

1. **Route API**: Finds the optimal execution path across multiple DeFi protocols including liquidity pools, lending platforms, automated market makers, yield optimizers, and more. It automatically determines the best path between two tokens or positions.

2. **Bundle API**: Enables building custom route creators for complex multi-step DeFi operations by composing sequences of actions. This is perfect for advanced use cases like yield farming, leveraged positions, and portfolio rebalancing.

## Installation

```bash
npm install @ensofinance/sdk
```

or

```bash
yarn add @ensofinance/sdk
```

## Quick Start

```typescript
import { EnsoClient } from "@ensofinance/sdk";

// Initialize the client with your API key
const ensoClient = new EnsoClient({
  apiKey: "YOUR_API_KEY",
});

// Get the best route from one token to another
const routeData = await ensoClient.getRouteData({
  fromAddress: "0xYourAddress",
  chainId: 1,
  amountIn: ["1000000000000000000"],
  tokenIn: ["0xTokenInAddress"],
  tokenOut: ["0xTokenOutAddress"],
  routingStrategy: "router",
});

// Execute the transaction with your web3 provider
// const tx = await web3.eth.sendTransaction(routeData.tx);
```

## Routing Strategies

There are 3 routing strategies available depending on your use case:

- `router` - Uses a single contract which acts as a universal router
- `delegate` - Returns calldata in the form of delegateCalls for smart accounts
- `ensowallet` - Returns calldata for deploying an Enso smart account, and executing all the logic inside of the smart account in the same transaction

## Core Features

### Token Approvals

Get approval data to allow token spending:

```typescript
// Example: Approving USDC for spending
const approvalData = await ensoClient.getApprovalData({
  fromAddress: "0xYourAddress",
  tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
  chainId: 1,
  amount: "1000000000", // 1000 USDC (6 decimals)
  routingStrategy: "router",
});
```

### Automated Routing

Get the optimal execution data for a route between tokens:

```typescript
const routeData = await ensoClient.getRouteData({
  fromAddress: "0xYourAddress",
  receiver: "0xReceiverAddress", // Optional, defaults to fromAddress
  chainId: 1,
  amountIn: ["1000000000000000000"],
  tokenIn: ["0xTokenInAddress"],
  tokenOut: ["0xTokenOutAddress"],
  slippage: "50", // 0.5%
  routingStrategy: "router",
});
```

### Wallet Balances

Get token balances for a wallet:

```typescript
// Example: Get all token balances for an Ethereum address
const balances = await ensoClient.getBalances({
  eoaAddress: "0xYourAddress",
  chainId: 1, // Ethereum mainnet
  useEoa: true, // Default is true - get balances for the EOA, not the Enso wallet
});
```

### Token Data

Get paginated information about tokens:

```typescript
// Example: Get details about wstETH including metadata
const tokenData = await ensoClient.getTokenData({
  chainId: 1,
  address: "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0", // wstETH
  includeMetadata: true,
  type: "defi", // Filter by token type - can be "defi" or "base"
});
```

### Token Pricing

Get token price data:

```typescript
// Example: Get current price of WETH
const priceData = await ensoClient.getPriceData({
  chainId: 1,
  address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
});

// Example: Get prices for multiple tokens
const multiPriceData = await ensoClient.getMultiplePriceData({
  chainId: 1,
  addresses: [
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  ],
});
```

### Bundled Transactions

Bundle multiple DeFi actions into a single transaction and use results between transactions.

```typescript
// Example: Convert ETH to USDC then deposit into Aave V3
const bundleData = await ensoClient.getBundleData(
  {
    fromAddress: "0xYourAddress",
    chainId: 1,
    routingStrategy: "router",
  },
  [
    {
      protocol: "enso",
      action: "route",
      args: {
        tokenIn: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // ETH
        tokenOut: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
        amountIn: "1000000000000000000", // 1 ETH
        slippage: "100", // 1%
      },
    },
    {
      protocol: "aave-v3",
      action: "deposit",
      args: {
        tokenIn: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
        tokenOut: "0xbcca60bb61934080951369a648fb03df4f96263c", // aUSDC v3
        amountIn: {
          useOutputOfCallAt: 0, // Use output from the first action
        },
        primaryAddress: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2", // Aave V3 pool
      },
    },
  ],
);
```

### Non-Tokenized Positions

Route to a non-tokenized position:

```typescript
// Example: Routing to a Morpho Blue USDC vault position
const nonTokenizedRoute = await ensoClient.getRouteNonTokenized({
  fromAddress: "0xYourAddress",
  chainId: 1,
  tokenIn: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"], // ETH
  positionOut: "0xBEeFFF209270748ddd194831b3fa287a5386f5bC", // Morpho USDC vault
  amountIn: ["1000000000000000000"], // 1 ETH
  receiver: "0xYourAddress",
  slippage: "300", // 3%
  routingStrategy: "delegate",
});
```

### Protocol Interactions

Get information about supported protocols:

```typescript
// Get all protocols
const protocols = await ensoClient.getProtocolData();

// Get protocols for a specific chain
const ethereumProtocols = await ensoClient.getProtocolData({ chainId: 1 });

// Get a specific protocol
const aaveProtocol = await ensoClient.getProtocolData({ slug: "aave-v3" });
```

## Handling Large Numbers

The SDK properly handles large numbers common in blockchain transactions:

```typescript
// Using string representation for large numbers (recommended)
const largeAmount = "1000000000000000000000000"; // 1 million tokens with 18 decimals

// You can also use JavaScript numbers for smaller values
const smallAmount = 1000000; // 1 USDC with 6 decimals
```

## Supported Actions

The Bundle API supports a variety of [actions for interacting with DeFi protocols](https://docs.enso.build/pages/build/reference/actions).

For an up-to-date reference of all available actions and their parameters, you can call:

```typescript
// Get all available actions
const actions = await ensoClient.getActions();

// Get actions for a specific protocol
const aaveActions = await ensoClient.getActionsBySlug("aave-v3");
```

## Supported Networks

To get information about [supported networks](https://docs.enso.build/pages/build/reference/supported-networks):

```typescript
// Get all supported networks
const networks = await ensoClient.getNetworks();

// Get a specific network
const ethereumNetwork = await ensoClient.getNetworks({
  chainId: "1",
  name: "Ethereum",
});
```

## API Reference

For detailed information about all available methods and parameters, see our [API Reference Documentation](https://docs.enso.build/pages/api-reference/overview).

### Main Client Methods

| Method                     | Description                                       |
| -------------------------- | ------------------------------------------------- |
| `getApprovalData`          | Get token approval transaction data               |
| `getRouteData`             | Get optimal routing between tokens                |
| `getBalances`              | Get wallet token balances                         |
| `getTokenData`             | Get token information                             |
| `getPriceData`             | Get token price data                              |
| `getMultiplePriceData`     | Get prices for multiple tokens                    |
| `getProtocolData`          | Get protocol information                          |
| `getBundleData`            | Bundle multiple actions into a single transaction |
| `getRouteNonTokenized`     | Get optimal routing to a non-tokenized position   |
| `getIporShortcut`          | Get transaction data for IPOR operations          |
| `getStandards`             | Get available standards for bundling              |
| `getActions`               | Get actions that can be bundled                   |
| `getNonTokenizedPositions` | Get non-tokenized positions                       |
| `getProjects`              | Get supported projects                            |
| `getProtocolsByProject`    | Get protocols within a project                    |
| `getNetworks`              | Get supported networks                            |
| `getAggregators`           | Get supported aggregators                         |
| `getVolume`                | Get volume data for a chain                       |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
