import { Address, BundleAction, EnsoClient } from "../src";

describe("bundles", () => {
  const userAddress = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045" as Address;

  // Token addresses (Ethereum mainnet)
  const ETH = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" as Address;
  const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as Address;
  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as Address;
  const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7" as Address;
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F" as Address;

  // LST tokens
  const stETH = "0xae7ab96520de3a18e5e111b5eaab095312d7fe84" as Address;
  const rETH = "0xae78736cd615f374d3085123a210448e74fc6393" as Address;
  const cbETH = "0xbe9895146f7af43049ca1c1ae358b0541ea49704" as Address;
  const wstETH = "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0" as Address;

  // Aave tokens
  const aWETH = "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8" as Address;
  const aUSDC = "0xbcca60bb61934080951369a648fb03df4f96263c" as Address;

  // Compound tokens
  const cETH = "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5" as Address;

  // LP tokens
  const CURVE_3POOL_LP =
    "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490" as Address;
  const stETH_ETH_CURVE_LP =
    "0x06325440D014e39736583c165C2963BA99fAf14E" as Address;
  const BAL_WETH_LP = "0x5c6Ee304399DBdB9C8Ef030aB642B10820DB8F56" as Address;

  // Protocol addresses
  const AAVE_V3_POOL = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2" as Address;
  const CURVE_3POOL = "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7" as Address;
  const CURVE_3POOL_GAUGE =
    "0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A" as Address;
  const CURVE_STETH_ETH_POOL =
    "0xDC24316b9AE028F1497c275EB9192a3Ea0f67022" as Address;
  const CURVE_STETH_GAUGE =
    "0x182B723a58739a9c974cFDB385ceaDb237453c28" as Address;
  const COMPOUND_V2_CETH =
    "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5" as Address;

  const client = new EnsoClient({
    apiKey: "56b3d1f4-5c59-4fc1-8998-16d001e277bc",
  });

  it("loops", async () => {
    const initialETHAmount = "1000000000000000000"; // 1 ETH
    const borrowAmount = "1500000000"; // 1500 USDC (conservative 75% LTV)

    const actions: BundleAction[] = [
      // Step 1: Deposit ETH as collateral in AAVE
      {
        protocol: "aave-v3",
        action: "deposit",
        args: {
          tokenIn: ETH,
          tokenOut: aWETH,
          amountIn: initialETHAmount,
          primaryAddress: AAVE_V3_POOL,
          receiver: userAddress,
        },
      },

      // Step 2: Borrow USDC against ETH collateral
      {
        protocol: "aave-v3",
        action: "borrow",
        args: {
          collateral: WETH,
          tokenOut: USDC,
          amountOut: borrowAmount,
          primaryAddress: AAVE_V3_POOL,
        },
      },

      // Step 3: Swap borrowed USDC back to ETH
      {
        protocol: "enso",
        action: "route",
        args: {
          tokenIn: USDC,
          tokenOut: ETH,
          amountIn: { useOutputOfCallAt: 1 }, // Use borrowed USDC amount
          slippage: "300", // 3% slippage
          receiver: userAddress,
        },
      },

      // Step 4: Deposit the swapped ETH back to AAVE (completing the loop)
      {
        protocol: "aave-v3",
        action: "deposit",
        args: {
          tokenIn: ETH,
          tokenOut: aWETH,
          amountIn: { useOutputOfCallAt: 2 }, // Use ETH from swap
          primaryAddress: AAVE_V3_POOL,
          receiver: userAddress,
        },
      },

      // Step 5: Add slippage protection for final position
      {
        protocol: "enso",
        action: "slippage",
        args: {
          bps: "200", // 2% slippage tolerance
          amountOut: { useOutputOfCallAt: 3 }, // Check final aWETH amount
        },
      },
    ];

    const bundle = await client.getBundleData(
      {
        chainId: 1, // Ethereum mainnet
        fromAddress: userAddress,
        routingStrategy: "delegate",
        referralCode: "looping",
      },
      actions,
    );

    console.log("AAVE Looping Bundle Created:");
    console.log(`Gas estimate: ${bundle.gas}`);
    console.log(`Transaction data: ${bundle.tx.data}`);
    console.log(`To address: ${bundle.tx.to}`);
    console.log(`Total actions: ${bundle.bundle.length}`);
  });

  it("multi-position entry - split 1 ETH across LST tokens", async () => {
    const actions: BundleAction[] = [
      // Convert 1/3 ETH to stETH
      {
        protocol: "enso",
        action: "route",
        args: {
          tokenIn: ETH,
          tokenOut: stETH,
          amountIn: "333000000000000000", // 0.333 ETH
          slippage: "100", // 1%
        },
      },
      // Convert 1/3 ETH to rETH
      {
        protocol: "enso",
        action: "route",
        args: {
          tokenIn: ETH,
          tokenOut: rETH,
          amountIn: "333000000000000000", // 0.333 ETH
          slippage: "100", // 1%
        },
      },
      // Convert remaining ETH to cbETH
      {
        protocol: "enso",
        action: "route",
        args: {
          tokenIn: ETH,
          tokenOut: cbETH,
          amountIn: "334000000000000000", // 0.334 ETH
          slippage: "100", // 1%
        },
      },
    ];

    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: userAddress,
        routingStrategy: "delegate",
      },
      actions,
    );

    expect(bundle.bundle.length).toBe(3);
    expect(bundle.gas).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
  });

  it("staking pipeline - ETH to staked Curve 3pool", async () => {
    const actions: BundleAction[] = [
      // Step 1: Swap 1 ETH to USDC
      {
        protocol: "enso",
        action: "route",
        args: {
          tokenIn: ETH,
          tokenOut: USDC,
          amountIn: "1000000000000000000", // 1 ETH
          slippage: "300", // 3%
        },
      },
      // Step 2: Deposit USDC into Curve 3pool
      {
        protocol: "curve",
        action: "deposit",
        args: {
          tokenIn: USDC,
          tokenOut: CURVE_3POOL_LP,
          amountIn: { useOutputOfCallAt: 0 },
          primaryAddress: CURVE_3POOL,
        },
      },
      // Step 3: Stake 3pool LP tokens in gauge
      {
        protocol: "curve-gauge",
        action: "deposit",
        args: {
          tokenIn: CURVE_3POOL_LP,
          tokenOut: CURVE_3POOL_GAUGE,
          amountIn: { useOutputOfCallAt: 1 },
          primaryAddress: CURVE_3POOL_GAUGE,
        },
      },
    ];

    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: userAddress,
        routingStrategy: "delegate",
      },
      actions,
    );

    expect(bundle.bundle.length).toBe(3);
    expect(bundle.gas).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
  });

  it("portfolio rebalancing - 70/30 to 50/50 ETH/USDC on Aave", async () => {
    const actions: BundleAction[] = [
      // Step 1: Convert 0.2 WETH to USDC
      {
        protocol: "enso",
        action: "route",
        args: {
          tokenIn: WETH,
          tokenOut: USDC,
          amountIn: "200000000000000000", // 0.2 WETH
          slippage: "100", // 1%
        },
      },
      // Step 2: Deposit 0.4 WETH into Aave
      {
        protocol: "aave-v3",
        action: "deposit",
        args: {
          tokenIn: WETH,
          tokenOut: aWETH,
          amountIn: "400000000000000000", // 0.4 WETH
          primaryAddress: AAVE_V3_POOL,
        },
      },
      // Step 3: Deposit USDC into Aave
      {
        protocol: "aave-v3",
        action: "deposit",
        args: {
          tokenIn: USDC,
          tokenOut: aUSDC,
          amountIn: { useOutputOfCallAt: 0 },
          primaryAddress: AAVE_V3_POOL,
        },
      },
    ];

    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: userAddress,
        routingStrategy: "delegate",
      },
      actions,
    );

    expect(bundle.bundle.length).toBe(3);
    expect(bundle.gas).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
  });

  it("position migration - Aave to Compound", async () => {
    const actions: BundleAction[] = [
      // Step 1: Withdraw WETH from Aave
      {
        protocol: "aave-v3",
        action: "redeem",
        args: {
          tokenIn: aWETH,
          tokenOut: WETH,
          amountIn: "1000000000000000000", // 1 aWETH
          primaryAddress: AAVE_V3_POOL,
        },
      },
      // Step 2: Unwrap WETH to ETH
      {
        protocol: "wrapped-native",
        action: "redeem",
        args: {
          tokenIn: WETH,
          tokenOut: ETH,
          amountIn: { useOutputOfCallAt: 0 },
          primaryAddress: WETH,
        },
      },
      // Step 3: Deposit ETH into Compound
      {
        protocol: "compound-v2",
        action: "deposit",
        args: {
          tokenIn: ETH,
          tokenOut: cETH,
          amountIn: { useOutputOfCallAt: 1 },
          primaryAddress: COMPOUND_V2_CETH,
        },
      },
    ];

    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: userAddress,
        routingStrategy: "delegate",
      },
      actions,
    );

    expect(bundle.bundle.length).toBe(3);
    expect(bundle.gas).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
  });

  it("leveraged positions - 2x ETH using Aave", async () => {
    const actions: BundleAction[] = [
      // Step 1: Deposit 1 WETH as collateral
      {
        protocol: "aave-v3",
        action: "deposit",
        args: {
          tokenIn: WETH,
          tokenOut: aWETH,
          amountIn: "1000000000000000000", // 1 WETH
          primaryAddress: AAVE_V3_POOL,
        },
      },
      // Step 2: Borrow USDC against collateral
      {
        protocol: "aave-v3",
        action: "borrow",
        args: {
          collateral: WETH,
          tokenOut: USDC,
          amountOut: "1000000000", // 1000 USDC
          primaryAddress: AAVE_V3_POOL,
        },
      },
      // Step 3: Swap USDC back to WETH
      {
        protocol: "enso",
        action: "route",
        args: {
          tokenIn: USDC,
          tokenOut: WETH,
          amountIn: { useOutputOfCallAt: 1 },
          slippage: "100", // 1%
        },
      },
      // Step 4: Deposit additional WETH as collateral
      {
        protocol: "aave-v3",
        action: "deposit",
        args: {
          tokenIn: WETH,
          tokenOut: aWETH,
          amountIn: { useOutputOfCallAt: 2 },
          primaryAddress: AAVE_V3_POOL,
        },
      },
    ];

    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: userAddress,
        routingStrategy: "delegate",
      },
      actions,
    );

    expect(bundle.bundle.length).toBe(4);
    expect(bundle.gas).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
  });

  it("zap into multiple LPs - diversified LP positions", async () => {
    const actions: BundleAction[] = [
      // Step 1: Convert 0.5 ETH to stETH/ETH Curve LP
      {
        protocol: "enso",
        action: "route",
        args: {
          tokenIn: ETH,
          tokenOut: stETH_ETH_CURVE_LP,
          amountIn: "500000000000000000", // 0.5 ETH
          slippage: "300", // 3%
        },
      },
      // Step 2: Convert 0.5 ETH to BAL/WETH Balancer LP
      {
        protocol: "enso",
        action: "route",
        args: {
          tokenIn: ETH,
          tokenOut: BAL_WETH_LP,
          amountIn: "500000000000000000", // 0.5 ETH
          slippage: "300", // 3%
        },
      },
    ];

    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: userAddress,
        routingStrategy: "delegate",
      },
      actions,
    );

    expect(bundle.bundle.length).toBe(2);
    expect(bundle.gas).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
  });

  it("yield compounding flow - Curve gauge rewards", async () => {
    const actions: BundleAction[] = [
      // Step 1: Harvest wstETH rewards from gauge
      {
        protocol: "curve-gauge",
        action: "harvest",
        args: {
          token: wstETH,
          primaryAddress: CURVE_STETH_GAUGE,
        },
      },
      // Step 2: Convert wstETH to stETH
      {
        protocol: "enso",
        action: "route",
        args: {
          tokenIn: wstETH,
          tokenOut: stETH,
          amountIn: { useOutputOfCallAt: 0 },
          slippage: "300", // 3%
        },
      },
      // Step 3: Deposit stETH back into Curve pool
      {
        protocol: "curve",
        action: "deposit",
        args: {
          tokenIn: stETH,
          tokenOut: stETH_ETH_CURVE_LP,
          amountIn: { useOutputOfCallAt: 1 },
          primaryAddress: CURVE_STETH_ETH_POOL,
        },
      },
    ];

    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: userAddress,
        routingStrategy: "delegate",
        receiver: userAddress,
      },
      actions,
    );

    expect(bundle.bundle.length).toBe(3);
    expect(bundle.gas).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
  });

  it("liquid staking derivative looping - wstETH on Aave", async () => {
    const actions: BundleAction[] = [
      // Step 1: Deposit 10 wstETH as collateral
      {
        protocol: "aave-v3",
        action: "deposit",
        args: {
          tokenIn: wstETH,
          tokenOut: "0x0B925eD163218f6662a35E0F0371Ac234F9E9371" as Address, // awstETH
          amountIn: "10000000000000000000", // 10 wstETH
          primaryAddress: AAVE_V3_POOL,
        },
      },
      // Step 2: Borrow 5.4 wstETH
      {
        protocol: "aave-v3",
        action: "borrow",
        args: {
          collateral: wstETH,
          tokenOut: wstETH,
          amountOut: "5400000000000000000", // 5.4 wstETH
          primaryAddress: AAVE_V3_POOL,
        },
      },
      // Step 3: Deposit borrowed wstETH
      {
        protocol: "aave-v3",
        action: "deposit",
        args: {
          tokenIn: wstETH,
          tokenOut: "0x0B925eD163218f6662a35E0F0371Ac234F9E9371" as Address,
          amountIn: "5400000000000000000",
          primaryAddress: AAVE_V3_POOL,
        },
      },
      // Step 4: Borrow more wstETH
      {
        protocol: "aave-v3",
        action: "borrow",
        args: {
          collateral: wstETH,
          tokenOut: wstETH,
          amountOut: "2916000000000000000", // 2.916 wstETH
          primaryAddress: AAVE_V3_POOL,
        },
      },
      // Step 5: Final deposit
      {
        protocol: "aave-v3",
        action: "deposit",
        args: {
          tokenIn: wstETH,
          tokenOut: "0x0B925eD163218f6662a35E0F0371Ac234F9E9371" as Address,
          amountIn: "2916000000000000000",
          primaryAddress: AAVE_V3_POOL,
        },
      },
    ];

    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: userAddress,
        routingStrategy: "delegate",
      },
      actions,
    );

    expect(bundle.bundle.length).toBe(5);
    expect(bundle.gas).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
  });

  it("validates bundle response structure", async () => {
    const actions: BundleAction[] = [
      {
        protocol: "enso",
        action: "route",
        args: {
          tokenIn: ETH,
          tokenOut: USDC,
          amountIn: "1000000000000000000",
          slippage: "100",
        },
      },
    ];

    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress: userAddress,
        routingStrategy: "delegate",
      },
      actions,
    );

    // Validate response structure
    expect(bundle).toHaveProperty("bundle");
    expect(bundle).toHaveProperty("gas");
    expect(bundle).toHaveProperty("tx");
    expect(bundle).toHaveProperty("createdAt");

    expect(bundle.tx).toHaveProperty("data");
    expect(bundle.tx).toHaveProperty("to");
    expect(bundle.tx).toHaveProperty("from");
    expect(bundle.tx).toHaveProperty("value");

    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle.length).toBeGreaterThan(0);

    // Validate gas is a string number
    expect(typeof bundle.gas).toBe("string");
    expect(parseInt(bundle.gas + "")).toBeGreaterThan(0);
  });
});
