import { Address, BundleAction, EnsoClient, RouteParams } from "../src";

describe("docs route tests", () => {
  const client = new EnsoClient({
    apiKey: "56b3d1f4-5c59-4fc1-8998-16d001e277bc",
  });
  beforeAll(() => {});

  const ETHEREUM_MAINNET = 1;
  const PLUME_MAINNET = 98866;

  // Token addresses
  const USDC_MAINNET = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as Address;
  const USDC_E_PLUME = "0x78adD880A697070c1e765Ac44D65323a0DcCE913" as Address; // USDC.e on Plume
  const MYPUSD_PLUME = "0xAf5aEAb2248415716569Be5d24FbE10b16590D6c" as Address; // Mystic vault myPUSD

  const testWallet = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045" as Address;

  it("routes tokens crosschain", async () => {
    const route = await client.getRouteData({
      fromAddress: testWallet,
      receiver: testWallet,
      spender: testWallet,
      chainId: ETHEREUM_MAINNET,
      destinationChainId: PLUME_MAINNET,
      amountIn: ["1000000000"], // 1,000 USDC (6 decimals)
      tokenIn: [USDC_MAINNET],
      tokenOut: [USDC_E_PLUME],
      routingStrategy: "delegate",
      slippage: "300", // 3% slippage for cross-chain
      referralCode: "cross-chain-test",
    });

    expect(route).toBeDefined();

    expect(route.gas).toBeDefined();
    expect(route.amountOut).toBeDefined();
    expect(route.tx).toBeDefined();
    expect(route.tx.data).toBeDefined();
    expect(route.tx.to).toBeDefined();
    expect(route.tx.from).toBe(testWallet);

    const amountOutNum = parseFloat(route.amountOut.toString());
    expect(amountOutNum).toBeGreaterThan(0);

    // Cross-chain should have some fee/slippage but not excessive
    expect(amountOutNum).toBeGreaterThan(900000000); // At least 900 USDC out

    console.log(route);
  });

  it.skip("routes tokens crosschain and outputs the route", async () => {
    const route = await client.getRouteData({
      fromAddress: testWallet,
      receiver: testWallet,
      spender: testWallet,
      chainId: ETHEREUM_MAINNET,
      destinationChainId: PLUME_MAINNET,
      amountIn: ["1000000000"], // 1,000 USDC (6 decimals)
      tokenIn: [USDC_MAINNET],
      tokenOut: [USDC_E_PLUME],
      routingStrategy: "delegate",
      slippage: "300", // 3% slippage for cross-chain
      referralCode: "cross-chain-test",
    });

    // Validate cross-chain specific properties
    expect(route.route).toBeDefined();
    expect(route.route.length).toBeGreaterThan(0);
    console.log(route);
  });

  it("should route USDC from Ethereum mainnet and zap into Plume Mystic vault (myPUSD)", async () => {
    const routeParams: RouteParams = {
      fromAddress: testWallet,
      receiver: testWallet,
      spender: testWallet,
      chainId: ETHEREUM_MAINNET,
      destinationChainId: PLUME_MAINNET,
      amountIn: ["2000000000"], // 2,000 USDC (6 decimals)
      tokenIn: [USDC_MAINNET],
      tokenOut: [MYPUSD_PLUME], // Mystic vault myPUSD
      routingStrategy: "delegate",
      slippage: "500", // 5% slippage for complex cross-chain + vault operation
      referralCode: "vault-zap-test",
    };

    const route = await client.getRouteData(routeParams);

    // Validate the response structure
    expect(route).toBeDefined();
    expect(route.route).toBeDefined();
    expect(route.gas).toBeDefined();
    expect(route.amountOut).toBeDefined();
    expect(route.tx).toBeDefined();

    // This should be a complex route with multiple steps
    expect(route.route.length).toBeGreaterThan(0);

    console.log(route);
    // Log detailed route information
    console.log(
      "Cross-chain vault zap route:",
      JSON.stringify(
        {
          routeSteps: route.route.length,
          firstAction: route.route[0]?.action,
          lastAction: route.route[route.route.length - 1]?.action,
          amountOut: route.amountOut,
          gas: route.gas,
          priceImpact: route.priceImpact,
          feeAmount: route.feeAmount,
        },
        null,
        2,
      ),
    );

    // Validate gas estimates are reasonable for complex operation
    const gasNum = parseFloat(route.gas.toString());
    expect(gasNum).toBeGreaterThan(300000); // Complex operation needs more gas

    // Validate we get some vault tokens back
    const amountOutNum = parseFloat(route.amountOut.toString());
    expect(amountOutNum).toBeGreaterThan(0);
  }, 45000); // 45 second timeout for complex route
});
