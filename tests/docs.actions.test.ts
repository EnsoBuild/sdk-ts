import { Address, BundleAction, EnsoClient } from "../src";

describe("docs", () => {
  const client = new EnsoClient({
    apiKey: "56b3d1f4-5c59-4fc1-8998-16d001e277bc",
  });
  beforeAll(() => {});

  it("slippage", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        // First do a swap to get an output to apply slippage to
        {
          protocol: "uniswap-v2",
          action: "swap",
          args: {
            tokenIn: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
            tokenOut: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
            amountIn: "1000000000000000000", // 1 WETH
            primaryAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // Uniswap V2 Router
            receiver: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
          },
        },
        // Now apply slippage to the swap output
        {
          protocol: "enso",
          action: "slippage",
          args: {
            bps: "100", // 1% maximum slippage (100 basis points)
            amountOut: { useOutputOfCallAt: 0 }, // Reference previous action's output
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  it("route", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        {
          protocol: "enso",
          action: "route",
          args: {
            tokenIn: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // ETH address
            tokenOut: "0xae7ab96520de3a18e5e111b5eaab095312d7fe84", // stETH address
            amountIn: "1000000000000000000", // Amount in wei (1 ETH)
            slippage: "300", // 3% slippage tolerance (in basis points)
            receiver: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // Optional: Receiver address
            primaryAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // Optional: Primary contract address
            poolFee: "3000", // Optional: Pool fee in basis points (e.g., 3000 for 0.3%)
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  it("swap", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        {
          protocol: "uniswap-v2",
          action: "swap",
          args: {
            tokenIn: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
            tokenOut: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
            amountIn: "1000000000000000000", // 1 WETH (18 decimals)
            primaryAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // Uniswap V2 Router
            receiver: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // Receiver
            slippage: "100", // Optional: 1% slippage (100 basis points)
            poolFee: "3000", // Optional: Pool fee in basis points (e.g., 3000 for 0.3%)
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  it("call", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        {
          protocol: "enso",
          action: "call",
          args: {
            address: "0xD0aF6F692bFa10d6a535A3A321Dc8377F4EeEF12", // Contract address
            method: "percentMul", // Method name
            abi: "function percentMul(uint256,uint256) external", // ABI signature
            args: [
              "1000000000000000000", // 1 ETH (first argument)
              "7000", // 70% (second argument)
            ],
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  it("deposit", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        {
          protocol: "aave-v3",
          action: "deposit",
          args: {
            tokenIn: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH address
            tokenOut: "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8", // aWETH address (optional)
            amountIn: "1000000000000000000", // Amount in wei (1 WETH)
            primaryAddress: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2", // Aave V3 pool
            receiver: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // Optional: Receiver address
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  it("depositCLMM", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0x93621DCA56fE26Cdee86e4F6B18E116e9758Ff11",
        spender: "0x93621DCA56fE26Cdee86e4F6B18E116e9758Ff11",
        routingStrategy: "router",
      },
      [
        {
          protocol: "uniswap-v4",
          action: "depositclmm",
          args: {
            tokenOut: "0xbd216513d74c8cf14cf4747e6aaa6420ff64ee9e",
            ticks: [-887270, 887270],
            tokenIn: [
              "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
              "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", // WBTC
            ],
            poolFee: "500",
            amountIn: ["1000000000", "100000000"], // 1000 USDT (6 decimals), 1 WBTC (8 decimals)
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  it.skip("redeem", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        // Step 1: First deposit into the ERC4626 vault to get shares
        {
          protocol: "erc4626",
          action: "deposit",
          args: {
            tokenIn: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI (underlying asset)
            tokenOut: "0xdA816459F1AB5631232FE5e97a05BBBb94970c95", // yvDAI (vault shares)
            amountIn: "1000000000000000000", // 1 DAI
            primaryAddress: "0xdA816459F1AB5631232FE5e97a05BBBb94970c95", // Vault address
          },
        },
        // Step 2: Now redeem the shares we just received
        {
          protocol: "erc4626",
          action: "redeem",
          args: {
            tokenIn: "0xdA816459F1AB5631232FE5e97a05BBBb94970c95", // yvDAI shares
            tokenOut: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI (underlying asset)
            amountIn: { useOutputOfCallAt: 0 }, // Use the shares from the deposit
            primaryAddress: "0xdA816459F1AB5631232FE5e97a05BBBb94970c95", // Vault address
            receiver: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // Optional: Receiver
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  it.skip("redeemCLMM", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        {
          protocol: "uniswap-v3",
          action: "redeemclmm",
          args: {
            tokenIn: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88", // UNI-V3-POS NFT
            tokenOut: [
              "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
              "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
            ],
            liquidity: "1000000000000", // Liquidity amount to withdraw
            tokenId: "123456", // The NFT token ID
            receiver: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // Optional: Receiver
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  it("borrow", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        {
          protocol: "aave-v3",
          action: "deposit",
          args: {
            tokenIn: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH address
            tokenOut: "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8", // aWETH address (optional)
            amountIn: "1000000000000000000", // Amount in wei (1 WETH)
            primaryAddress: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2", // Aave V3 pool
            receiver: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045", // Optional: Receiver address
          },
        },
        {
          protocol: "aave-v3",
          action: "borrow",
          args: {
            collateral: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH address (collateral)
            tokenOut: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC address (to borrow)
            amountOut: "1000000000", // Amount to borrow in wei (1000 USDC with 6 decimals)
            primaryAddress: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2", // Aave V3 pool
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  it("repay", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        {
          protocol: "aave-v3",
          action: "deposit",
          args: {
            tokenIn: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH address
            tokenOut: "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8", // aWETH address (optional)
            amountIn: "1000000000000000000", // Amount in wei (1 WETH)
            primaryAddress: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2", // Aave V3 pool
            receiver: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045", // Optional: Receiver address
          },
        },
        {
          protocol: "aave-v3",
          action: "borrow",
          args: {
            collateral: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH address (collateral)
            tokenOut: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC address (to borrow)
            amountOut: "1000000000", // Amount to borrow in wei (1000 USDC with 6 decimals)
            primaryAddress: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2", // Aave V3 pool
          },
        },
        // Step 3: Now repay the borrowed USDT
        {
          protocol: "aave-v3",
          action: "repay",
          args: {
            tokenIn: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
            amountIn: "1000000000", // 100 USDC
            primaryAddress: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  it("repay on behalf of other", async () => {
    const bundleData = await client.getBundleData(
      {
        chainId: 1, // Mainnet
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045" as Address,
        routingStrategy: "delegate",
      },
      [
        // 3. Repay the ETH debt
        {
          protocol: "compound-v2",
          action: "repay",
          args: {
            tokenIn: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // ETH
            amountIn: "300000000000000000",
            primaryAddress: "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5", // cETH contract
            onBehalfOf: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
          },
        },
      ],
    );

    console.log(JSON.stringify(bundleData));
  });

  it("harvest", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        {
          protocol: "curve-gauge",
          action: "harvest",
          args: {
            token: "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0", // Token address (LP token or gauge token)
            primaryAddress: "0x182B723a58739a9c974cFDB385ceaDb237453c28", // Curve gauge address
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  it("approve", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        {
          protocol: "erc20",
          action: "approve",
          args: {
            token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH address
            spender: "0xe592427a0aece92de3edee1f18e0157c05861564", // Spender address (e.g., Uniswap router)
            amount: "1000000000000000000000000", // Amount to approve in wei (1M WETH)
            routingStrategy: "router", // Optional: Routing strategy
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  it("transfer", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        {
          protocol: "erc20",
          action: "transfer",
          args: {
            token: "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07", // OMG token address
            receiver: "0x80eba3855878739f4710233a8a19d89bdd2ffb8e", // Recipient address
            amount: "1000000000000000000", // Amount to transfer in wei (1 OMG)
            id: "1234", // Optional: ID for ERC721 or ERC1155 tokens
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  it.skip("transferFrom", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        {
          protocol: "enso",
          action: "balance",
          args: {
            token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          },
        },
        {
          protocol: "erc20",
          action: "transferfrom",
          args: {
            token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // OMG token address
            sender: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045", // Sender address
            receiver: "0x93621DCA56fE26Cdee86e4F6B18E116e9758Ff11", // Recipient address
            amount: "1000000000000000000", // Amount to transfer in wei (1 OMG)
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  it.skip("permitTransferFrom", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        {
          protocol: "permit2",
          action: "permittransferfrom",
          args: {
            token: "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07", // Token address
            amount: "1000000000000000000", // Amount in wei (1 token)
            sender: "0xb67f3CE46bB9E1a1127796c27f38DbaB9f643ec0", // Sender address
            receiver: "0x35a2839b617F7da6534d636f22945f6Cb6137130", // Receiver address
            nonce: "1", // Nonce to prevent replay attacks
            deadline: "1710150268", // Timestamp deadline for signature validity
            signature: "0x...", // Permit signature
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  it.skip("bridge", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0x93621DCA56fE26Cdee86e4F6B18E116e9758Ff11",
        spender: "0x93621DCA56fE26Cdee86e4F6B18E116e9758Ff11",
        routingStrategy: "router",
      },
      [
        {
          protocol: "enso",
          action: "route",
          args: {
            tokenIn: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC on mainnet
            amountIn: "1000000000", // 1000 USDC
            tokenOut: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // ETH
          },
        },
        {
          protocol: "enso",
          action: "fee",
          args: {
            token: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            amount: { useOutputOfCallAt: 0 },
            bps: 25,
            receiver: "0x93621DCA56fE26Cdee86e4F6B18E116e9758Ff11", // Fee receiver
          },
        },
        {
          protocol: "stargate",
          action: "bridge",
          args: {
            primaryAddress: "0x77b2043768d28e9c9ab44e1abfc95944bce57931",
            destinationChainId: 8453,
            tokenIn: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            amountIn: { useOutputOfCallAt: 1 },
            receiver: "0x93621DCA56fE26Cdee86e4F6B18E116e9758Ff11",
            callback: [
              {
                protocol: "enso",
                action: "balance",
                args: {
                  token: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                },
              },
              {
                protocol: "enso",
                action: "split",
                args: {
                  tokenIn: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                  tokenOut: [
                    "0x50c5725949a6f0c72e6c4a641f24049a917db0cb",
                    "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
                  ],
                  amountIn: { useOutputOfCallAt: 0 },
                },
              },
              {
                protocol: "enso",
                action: "slippage",
                args: {
                  amountOut: { useOutputOfCallAt: 1, index: 0 },
                  bps: 50,
                },
              },
              {
                protocol: "enso",
                action: "slippage",
                args: {
                  amountOut: { useOutputOfCallAt: 1, index: 1 },
                  bps: 50,
                },
              },
              {
                protocol: "uniswap-v4",
                action: "depositclmm",
                args: {
                  tokenOut: "0x7c5f5a4bbd8fd63184577525326123b519429bdc",
                  ticks: [-276842, -275842],
                  tokenIn: [
                    "0x50c5725949a6f0c72e6c4a641f24049a917db0cb",
                    "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
                  ],
                  poolFee: "100",
                  amountIn: [
                    { useOutputOfCallAt: 1, index: 0 },
                    { useOutputOfCallAt: 1, index: 1 },
                  ],
                },
              },
              {
                protocol: "enso",
                action: "slippage",
                args: {
                  amountOut: { useOutputOfCallAt: 4 },
                  bps: 200,
                },
              },
            ],
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  it("fee", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        {
          protocol: "enso",
          action: "fee",
          args: {
            token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            amount: "1000000000000",
            bps: "500",
            receiver: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  it.skip("split", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        {
          protocol: "enso",
          action: "balance",
          args: {
            token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
          },
        },
        {
          protocol: "enso",
          action: "split",
          args: {
            tokenIn: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
            tokenOut: [
              "0x6b175474e89094c44da98b954eedeac495271d0f", // USDC
              "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            ],
            amountIn: { useOutputOfCallAt: 0 }, // Use the balance from the first action
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  it.skip("merge", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        {
          protocol: "enso",
          action: "merge",
          args: {
            tokenIn: [
              "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
              "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
            ],
            tokenOut: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // Combined WETH
            amountIn: [
              "2000000000000000000000", // 2 USDC
              "3000000000000000000000", // 3 DAI
            ],
            receiver: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  it("balance", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        {
          protocol: "enso",
          action: "balance",
          args: {
            token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  it("minAmountOut", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        // First action to get an output
        {
          protocol: "uniswap-v2",
          action: "swap",
          args: {
            tokenIn: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
            tokenOut: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
            amountIn: "1000000000000000000", // 1 WETH
            primaryAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // Uniswap V2 Router
            receiver: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
          },
        },
        // Now apply minAmountOut check
        {
          protocol: "enso",
          action: "minamountout",
          args: {
            amountOut: { useOutputOfCallAt: 0 }, // Reference to first action's output
            minAmountOut: "1940000000", // hardcoded minimum amount (1.94 USDC)
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  // singleDeposit action (from docs)
  it.skip("singleDeposit", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        {
          protocol: "yearn",
          action: "singledeposit",
          args: {
            tokenIn: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI address
            tokenOut: "0xdA816459F1AB5631232FE5e97a05BBBb94970c95", // yvDAI address
            amountIn: "10000000000000000000", // 10 DAI (18 decimals)
            primaryAddress: "0xdA816459F1AB5631232FE5e97a05BBBb94970c95", // Yearn vault
            receiver: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // Optional: Receiver
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  // multiDeposit action (from docs)
  it.skip("multiDeposit", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        {
          protocol: "curve",
          action: "multideposit",
          args: {
            tokenIn: [
              "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
              "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
              "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
            ],
            tokenOut: "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490", // 3Crv LP token
            amountIn: [
              "10000000000000000000", // 10 DAI (18 decimals)
              "10000000", // 10 USDC (6 decimals)
              "10000000", // 10 USDT (6 decimals)
            ],
            primaryAddress: "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7", // Curve 3pool
            receiver: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // Optional: Receiver
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });

  // multiOutSingleDeposit action (from docs)
  it.skip("multiOutSingleDeposit", async () => {
    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        routingStrategy: "delegate",
      },
      [
        {
          protocol: "uniswap-v3",
          action: "multioutsingledeposit",
          args: {
            tokenIn: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
            tokenOut: [
              "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // WBTC
              "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
            ],
            amountIn: "1000000000000000000", // 1 WETH (18 decimals)
            primaryAddress: "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640", // Uniswap pool
            receiver: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // Optional: Receiver
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });
});
