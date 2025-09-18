import { parseUnits, zeroAddress } from "viem";
import { Address, BundleAction, EnsoClient } from "../src";

describe("Docs samples inegration tests - actions", () => {
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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(2);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();
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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();
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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();


  });

  describe("call", () => {
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
      expect(bundle).toBeDefined();
      expect(bundle.bundle).toBeDefined();
      expect(Array.isArray(bundle.bundle)).toBe(true);
      expect(bundle.bundle).toHaveLength(1);

      // Transaction validation
      expect(bundle.tx).toBeDefined();
      expect(bundle.tx.data).toBeDefined();
      expect(bundle.tx.to).toBeDefined();
      expect(bundle.tx.from).toBeDefined();
    });

    it("call2", async () => {
      const CONFIG = {
        desiredTokenOut: "0x6969696969696969696969696969696969696969",
        borrowerOperations: "0xed35ff90e6593ad71ed15082e24c204c379d3599",
        trove: "0x94704805a75f9d6a18b7a2338102c63d922f1915",
        underlying: "0xdE04c469Ad658163e2a5E860a03A86B52f6FA8C8", // BYUSD-HONEY-STABLE
        mead: "0xedb5180661f56077292c92ab40b1ac57a279a396",
        debtRepayAmount: parseUnits("500", 18).toString(),
        collateralWithdrawalAmount: parseUnits("1", 18).toString(),
        maxFeePercentage: parseUnits("0.005", 18).toString(),
      } as const;

      async function main() {
        // NOTE: Using this account that has collateral on block 6861368
        // If the sender is an account that doesnt have collateral, request will fail
        const smartWalletAddress = "0x5dE1B7f14De50Ed6e430ea144eED8Bc9d0Bbb30C";

        const bundle: BundleAction[] = [
          {
            protocol: "enso",
            action: "call",
            args: {
              address: CONFIG.borrowerOperations,
              method: "adjustTrove",
              abi:
                "function adjustTrove(" +
                "address troveManager, " +
                "address account, " +
                "uint256 maxFeePercentage, " +
                "uint256 collateralDeposit, " +
                "uint256 collateralWithdrawal, " +
                "uint256 debtAmount, " +
                "bool isDebtIncrease, " +
                "address upperHint, " +
                "address lowerHint" +
                ") external",
              args: [
                CONFIG.trove,
                smartWalletAddress,
                CONFIG.maxFeePercentage,
                "0",
                CONFIG.collateralWithdrawalAmount,
                "0",
                false,
                zeroAddress,
                zeroAddress,
              ],
              tokenOut: CONFIG.underlying,
            },
          },
          {
            protocol: "enso",
            action: "balance",
            args: {
              token: CONFIG.underlying,
            },
          },
          {
            protocol: "enso",
            action: "route",
            args: {
              tokenIn: CONFIG.underlying,
              tokenOut: CONFIG.desiredTokenOut,
              amountIn: { useOutputOfCallAt: 1 },
            },
          },
        ] as any;

        const bundleData = await client.getBundleData(
          {
            chainId: 80094,
            fromAddress: smartWalletAddress,
            routingStrategy: "delegate",
          },
          bundle,
        );
        expect(bundle).toBeDefined();
        expect(bundleData.bundle).toBeDefined();
        expect(Array.isArray(bundleData.bundle)).toBe(true);
        expect(bundleData.bundle).toHaveLength(3);

        // Transaction validation
        expect(bundleData.tx).toBeDefined();
        expect(bundleData.tx.data).toBeDefined();
        expect(bundleData.tx.to).toBeDefined();
        expect(bundleData.tx.from).toBeDefined();
      }
    });
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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();
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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();
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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();

 
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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();

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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(2);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();
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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(3);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();
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

    expect(bundleData).toBeDefined();
    expect(bundleData.bundle).toBeDefined();
    expect(Array.isArray(bundleData.bundle)).toBe(true);
    expect(bundleData.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundleData.tx).toBeDefined();
    expect(bundleData.tx.data).toBeDefined();
    expect(bundleData.tx.to).toBeDefined();
    expect(bundleData.tx.from).toBeDefined();
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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();
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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();
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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();

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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();
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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();
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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();

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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();
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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();
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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();

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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();
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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(2);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();

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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();

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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();

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
    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();


  });
  describe("Custom Deposit Function Call", () => {
    const client = new EnsoClient({
      apiKey: "56b3d1f4-5c59-4fc1-8998-16d001e277bc",
    });
    const USDT: Address = "0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb";

    const STAKED_HYPE: Address = "0xffaa4a3d97fe9107cef8a3f48c069f577ff76cc1";
    const HYPE_DEPOSITOR: Address =
      "0x6e358dd1204c3fb1D24e569DF0899f48faBE5337";
    const LOOPED_HYPE: Address = "0x5748ae796AE46A4F1348a1693de4b50560485562";

    const SENDER: Address = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
    const ENSO_SHORTCUTS: Address =
      "0x4Fe93ebC4Ce6Ae4f81601cC7Ce7139023919E003";

    const USDT_AMOUNT = "100000000";

    describe("Smart Wallet", () => {
      it("Smart Wallet deposits to LOOPED_HYPE with custom community code and dynamic token amount", async () => {
        const bundle = await client.getBundleData(
          {
            chainId: 999,
            fromAddress: SENDER,
            routingStrategy: "delegate",
            receiver: SENDER,
          },
          [
            {
              protocol: "enso",
              action: "route",
              args: {
                tokenIn: USDT,
                tokenOut: STAKED_HYPE,
                amountIn: USDT_AMOUNT,
              },
            },
            // without `route` we must manually approve the spender of tokens - the HypeDepositor contract
            {
              protocol: "erc20",
              action: "approve",
              args: {
                amount: { useOutputOfCallAt: 0 },
                spender: HYPE_DEPOSITOR,
                token: STAKED_HYPE,
              },
            },
            {
              protocol: "enso",
              action: "call",
              args: {
                address: HYPE_DEPOSITOR,
                args: [
                  STAKED_HYPE,
                  { useOutputOfCallAt: 0 },
                  0,
                  SENDER,
                  "0x1234",
                ],
                method: "deposit",
                abi: "function deposit(address depositAsset, uint256 depositAmount, uint256 minimumMint, address to, bytes communityCode) external returns (uint256 shares)",
              },
            },
          ],
        );
        expect(bundle).toBeDefined();
        expect(bundle.bundle).toBeDefined();
        expect(Array.isArray(bundle.bundle)).toBe(true);
        expect(bundle.bundle).toHaveLength(3);

        // Transaction validation
        expect(bundle.tx).toBeDefined();
        expect(bundle.tx.data).toBeDefined();
        expect(bundle.tx.to).toBeDefined();
        expect(bundle.tx.from).toBeDefined();
      });

      it("Smart Wallet routes to LOOPED_HYPE", async () => {
        const bundle = await client.getBundleData(
          {
            chainId: 999,
            fromAddress: SENDER,
            routingStrategy: "delegate",
            receiver: SENDER,
          },
          [
            {
              protocol: "enso",
              action: "route",
              args: {
                tokenIn: USDT,
                tokenOut: LOOPED_HYPE,
                amountIn: USDT_AMOUNT,
                receiver: SENDER,
              },
            },
          ],
        );
        expect(bundle).toBeDefined();
        expect(bundle.bundle).toBeDefined();
        expect(Array.isArray(bundle.bundle)).toBe(true);
        expect(bundle.bundle).toHaveLength(1);

        // Transaction validation
        expect(bundle.tx).toBeDefined();
        expect(bundle.tx.data).toBeDefined();
        expect(bundle.tx.to).toBeDefined();
        expect(bundle.tx.from).toBeDefined();
      });
    });

    describe("EOA", () => {
      it("EOA deposits to LOOPED_HYPE with custom community code and dynamic token amount", async () => {
        // Approve Enso router to use USDT
        const approval = await client.getApprovalData({
          amount: USDT_AMOUNT,
          chainId: 999,
          fromAddress: SENDER,
          tokenAddress: USDT,
        });

        const bundle = await client.getBundleData(
          {
            chainId: 999,
            fromAddress: SENDER,
            routingStrategy: "router",
            receiver: SENDER,
          },
          [
            {
              protocol: "enso",
              action: "route",
              args: {
                tokenIn: USDT,
                tokenOut: STAKED_HYPE,
                amountIn: USDT_AMOUNT,
              },
            },
            {
              protocol: "erc20",
              action: "approve",
              args: {
                amount: { useOutputOfCallAt: 0 },
                spender: HYPE_DEPOSITOR,
                token: STAKED_HYPE,
              },
            },
            {
              protocol: "enso",
              action: "call",
              args: {
                address: HYPE_DEPOSITOR,
                args: [
                  STAKED_HYPE,
                  { useOutputOfCallAt: 0 },
                  0,
                  SENDER,
                  "0x1234",
                ],
                method: "deposit",
                abi: "function deposit(address depositAsset, uint256 depositAmount, uint256 minimumMint, address to, bytes communityCode) external returns (uint256 shares)",
              },
            },
          ],
        );
      });
    });
  });
});
