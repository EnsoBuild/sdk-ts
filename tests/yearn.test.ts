import { Address, BundleAction, EnsoClient, RouteParams } from "../src";

describe("YEARN Protocol Integration Routes", () => {
  const client = new EnsoClient({
    apiKey: "56b3d1f4-5c59-4fc1-8998-16d001e277bc",
  });

  const ETHEREUM_MAINNET = 1;
  const testWallet = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045" as Address;

  // Base Token Addresses
  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as Address;
  const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as Address;
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F" as Address;
  const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" as Address;
  const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7" as Address;

  // Yearn V3 Vault Addresses
  const yvUSDC = "0xa354F35829Ae975e850e23e9615b11Da1B3dC4DE" as Address;
  const yvWETH = "0xa258C4606Ca8206D8aA700cE2143D7db854D168c" as Address;
  const yvDAI = "0xdA816459F1AB5631232FE5e97a05BBBb94970c95" as Address;
  const yvWBTC = "0xa696a63cc78dffa1a63e9e50587c197387ff6c7e" as Address;
  const yvUSDT = "0x7da96a3891add058ada2e826306d812c638d87a7" as Address;
  const yvLUSD = "0x378cb52b00F9D0921cb46dFc099CFf73b42419dC" as Address;

  // Yearn V2 Vault Addresses (for migration testing)
  const yvCurve_stETH = "0x5B8C556B8b2a78696F0B9B830B3d67623122E270" as Address;
  const yvCurve_3CryptoUSDT =
    "0x7845Ebf66c9575Fc5f5A0dBb9a34a706Ad997a3f" as Address;
  const yvCurve_USDC_crvUSD =
    "0x7cA00559B978CFde81297849be6151d3ccB408A9" as Address;

  // High-Yield Vault Addresses
  const yvCurve_TriCryptoUSDC =
    "0xaA379c2aA72529d5ec0da8A41e2F41ED7Fe4b48C" as Address;
  const yvCurve_USDT_crvUSD =
    "0x241AdD131B9aaa7527132b752252b99420937ADc" as Address;
  const yvCurve_sdYFIv2 =
    "0x93cF0b02D0A2B61551d107378AFf60CEAe40c342" as Address;
  const yvCurve_upYFI = "0xFCa9Ab2996e7b010516adCC575eB63de4f4fa47A" as Address;
  const yvCurve_dYFI_ETH =
    "0xf70B3F1eA3BFc659FFb8b27E84FAE7Ef38b5bD3b" as Address;

  describe("Basic Operations", () => {
    it("should deposit USDC into Yearn vault and handle allowances", async () => {
      // Test basic vault deposit with allowance management
      const depositAmount = "1000000000"; // 1,000 USDC (6 decimals)

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: ETHEREUM_MAINNET,
        amountIn: [depositAmount],
        tokenIn: [USDC],
        tokenOut: [yvUSDC],
        routingStrategy: "delegate",
        slippage: "100", // 1% slippage
        referralCode: "yearn-deposit",
      };

      const route = await client.getRouteData(routeParams);

      // Validate route response
      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.gas).toBeDefined();
      expect(route.amountOut).toBeDefined();
      expect(route.route).toBeDefined();
      expect(route.route.length).toBeGreaterThan(0);

      // Validate transaction structure
      expect(route.tx.to).toBeDefined();
      expect(route.tx.from).toBe(testWallet);
      expect(route.tx.data).toBeDefined();

      // Validate we receive vault shares
      const amountOutNum = parseFloat(route.amountOut.toString());
      expect(amountOutNum).toBeGreaterThan(0);

      // Gas should be reasonable for vault deposit
      const gasNum = parseFloat(route.gas.toString());
      expect(gasNum).toBeGreaterThan(100000);
      expect(gasNum).toBeLessThan(500000);

      console.log("USDC → yvUSDC deposit route:", {
        amountOut: route.amountOut,
        gas: route.gas,
        routeSteps: route.route.length,
      });
    }, 30000);

    it("should withdraw vault shares back to underlying assets", async () => {
      // Test vault share redemption
      const shareAmount = "1000000000"; // Assuming we have vault shares

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: ETHEREUM_MAINNET,
        amountIn: [shareAmount],
        tokenIn: [yvUSDC],
        tokenOut: [USDC],
        routingStrategy: "delegate",
        slippage: "100", // 1% slippage
        referralCode: "yearn-withdraw",
      };

      const route = await client.getRouteData(routeParams);

      // Validate withdrawal route
      expect(route).toBeDefined();
      expect(route.amountOut).toBeDefined();
      expect(route.route.length).toBeGreaterThan(0);

      // Should receive underlying USDC back
      const amountOutNum = parseFloat(route.amountOut.toString());
      expect(amountOutNum).toBeGreaterThan(0);

      console.log("yvUSDC → USDC withdrawal route:", {
        amountOut: route.amountOut,
        gas: route.gas,
      });
    }, 30000);

    it("should query vault position and balances", async () => {
      // Test balance checking for vault positions
      const balances = await client.getBalances({
        chainId: ETHEREUM_MAINNET,
        eoaAddress: testWallet,
        useEoa: true,
      });

      expect(balances).toBeDefined();
      expect(Array.isArray(balances)).toBe(true);

      // Look for Yearn vault tokens in balance
      const vaultBalances = balances.filter((balance) =>
        [yvUSDC, yvWETH, yvDAI, yvWBTC, yvUSDT].includes(balance.token),
      );

      console.log("Vault balances found:", vaultBalances.length);
      console.log("Sample vault balance:", vaultBalances[0]);
    }, 30000);
  });

  describe("Intermediate Operations", () => {
    it("should rebalance portfolio across multiple Yearn vaults", async () => {
      // Test multi-vault portfolio optimization
      const actions: BundleAction[] = [
        // First, route USDC to multiple vault types for diversification
        {
          protocol: "enso",
          action: "route",
          args: {
            tokenIn: USDC,
            tokenOut: yvDAI,
            amountIn: "500000000", // 500 USDC to DAI vault
            slippage: "150",
          },
        },
        {
          protocol: "enso",
          action: "route",
          args: {
            tokenIn: USDC,
            tokenOut: yvWETH,
            amountIn: "500000000", // 500 USDC to WETH vault
            slippage: "150",
          },
        },
        {
          protocol: "enso",
          action: "route",
          args: {
            tokenIn: USDC,
            tokenOut: yvLUSD,
            amountIn: "300000000", // 300 USDC to LUSD vault (higher yield)
            slippage: "200",
          },
        },
      ];

      const bundle = await client.getBundleData(
        {
          chainId: ETHEREUM_MAINNET,
          fromAddress: testWallet,
          routingStrategy: "delegate",
          referralCode: "yearn-port-rebal",
        },
        actions,
      );

      // Validate bundle response
      expect(bundle).toBeDefined();
      expect(bundle.bundle).toBeDefined();
      expect(bundle.bundle.length).toBe(3);
      expect(bundle.gas).toBeDefined();
      expect(bundle.tx).toBeDefined();

      // Should have reasonable gas for multi-vault operations
      const gasNum = parseFloat(bundle.gas.toString());
      expect(gasNum).toBeGreaterThan(300000);

      console.log("Multi-vault rebalancing bundle:", {
        actions: bundle.bundle.length,
        gas: bundle.gas,
        amountsOut: Object.keys(bundle.amountsOut).length,
      });
    }, 45000);

    it("should optimize yield strategy across different vault types", async () => {
      // Test yield optimization by moving between vault types
      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: ETHEREUM_MAINNET,
        amountIn: ["2000000000"], // 2,000 USDC
        tokenIn: [USDC],
        tokenOut: [yvCurve_TriCryptoUSDC], // Higher yield Curve vault
        routingStrategy: "delegate",
        slippage: "300", // 3% slippage for complex strategy
        referralCode: "yearn-yield-opti",
      };

      const route = await client.getRouteData(routeParams);

      // Validate complex yield strategy route
      expect(route).toBeDefined();
      expect(route.route.length).toBeGreaterThan(1); // Should involve multiple steps
      expect(route.amountOut).toBeDefined();

      // Higher gas expected for complex strategy
      const gasNum = parseFloat(route.gas.toString());
      expect(gasNum).toBeGreaterThan(200000);

      console.log("Yield optimization route:", {
        routeSteps: route.route.length,
        gas: route.gas,
        priceImpact: route.priceImpact,
      });
    }, 45000);
  });

  describe("Intermediate Operations", () => {
    it("should rebalance portfolio across multiple Yearn vaults", async () => {
      // Test REAL portfolio rebalancing: withdraw from low-yield, deposit to high-yield
      const actions: BundleAction[] = [
        // Step 1: Withdraw from lower-yield vault (yvDAI ~2.98% APY)
        {
          protocol: "enso",
          action: "route",
          args: {
            tokenIn: yvDAI,
            tokenOut: USDC, // Convert back to base asset
            amountIn: "1000000000000000000", // 1 yvDAI token
            slippage: "100",
          },
        },
        // Step 2: Withdraw from another vault (yvUSDC ~2.80% APY)
        {
          protocol: "enso",
          action: "route",
          args: {
            tokenIn: yvUSDC,
            tokenOut: USDC, // Convert back to USDC
            amountIn: "1000000000", // 1,000 yvUSDC shares
            slippage: "100",
          },
        },
        // Step 3: Rebalance into higher-yield vault (yvLUSD ~6.43% APY)
        {
          protocol: "enso",
          action: "route",
          args: {
            tokenIn: USDC,
            tokenOut: yvLUSD,
            amountIn: { useOutputOfCallAt: 0 }, // Use output from first withdrawal
            slippage: "200",
          },
        },
        // Step 4: Rebalance remaining into high-yield Curve vault
        {
          protocol: "enso",
          action: "route",
          args: {
            tokenIn: USDC,
            tokenOut: yvCurve_TriCryptoUSDC, // ~7.30% APY
            amountIn: { useOutputOfCallAt: 1 }, // Use output from second withdrawal
            slippage: "300",
          },
        },
      ];

      const bundle = await client.getBundleData(
        {
          chainId: ETHEREUM_MAINNET,
          fromAddress: testWallet,
          routingStrategy: "delegate",
          referralCode: "yearn-rebalance",
        },
        actions,
      );

      expect(bundle).toBeDefined();
      expect(bundle.bundle.length).toBe(4); // 2 withdrawals + 2 deposits
      expect(bundle.gas).toBeDefined();

      console.log("Portfolio rebalancing:", {
        actions: bundle.bundle.length,
        strategy: "Low-yield → High-yield reallocation",
        gas: bundle.gas,
      });
    }, 45000);

    it("should optimize yield strategy across different vault types", async () => {
      // Test moving between vault categories: Stablecoin → Multi-asset → Leveraged
      const actions: BundleAction[] = [
        // Step 1: Start with stablecoin vault position
        {
          protocol: "enso",
          action: "route",
          args: {
            tokenIn: USDC,
            tokenOut: yvUSDC, // Basic stablecoin vault (~2.80% APY)
            amountIn: "1000000000", // 1,000 USDC
            slippage: "100",
          },
        },
        // Step 2: Move to higher-yield stablecoin strategy
        {
          protocol: "enso",
          action: "route",
          args: {
            tokenIn: yvUSDC, // Use vault shares from step 1
            tokenOut: yvCurve_USDC_crvUSD, // Curve stablecoin vault (~7.31% APY)
            amountIn: { useOutputOfCallAt: 0 },
            slippage: "200",
          },
        },
        // Step 3: Optimize further into multi-asset crypto vault
        {
          protocol: "enso",
          action: "route",
          args: {
            tokenIn: yvCurve_USDC_crvUSD, // Use previous vault shares
            tokenOut: yvCurve_TriCryptoUSDC, // Multi-crypto vault (~7.30% APY)
            amountIn: { useOutputOfCallAt: 1 },
            slippage: "400", // Higher slippage for complex strategy
          },
        },
      ];

      const bundle = await client.getBundleData(
        {
          chainId: ETHEREUM_MAINNET,
          fromAddress: testWallet,
          routingStrategy: "delegate",
          referralCode: "yearn-yield-opti",
        },
        actions,
      );

      expect(bundle).toBeDefined();
      expect(bundle.bundle.length).toBe(3);

      console.log("Yield optimization ladder:", {
        progression: "Stablecoin → Curve Stable → Multi-Crypto",
        steps: bundle.bundle.length,
        gas: bundle.gas,
      });
    }, 45000);
  });

  describe("Advanced Operations", () => {
    it("should auto-compound high-yield vault rewards", async () => {
      // Test automated reward extraction and reinvestment
      const actions: BundleAction[] = [
        // Step 1: Check current vault position
        {
          protocol: "enso",
          action: "balance",
          args: {
            token: yvCurve_sdYFIv2, // High-yield vault position
          },
        },
        // Step 2: Redeem a portion to extract accumulated rewards
        {
          protocol: "enso",
          action: "route",
          args: {
            tokenIn: yvCurve_sdYFIv2,
            tokenOut: USDC, // Convert to base asset to see gains
            amountIn: "100000000000000000", // 0.1 vault tokens
            slippage: "500",
          },
        },
        // Step 3: Reinvest the gains back into the vault for compounding
        {
          protocol: "enso",
          action: "route",
          args: {
            tokenIn: USDC,
            tokenOut: yvCurve_sdYFIv2, // Reinvest back into same high-yield vault
            amountIn: { useOutputOfCallAt: 1 }, // Use redeemed amount
            slippage: "500",
          },
        },
        // Step 4: Also compound into a different high-yield strategy for diversification
        // {
        //   protocol: "enso",
        //   action: "route",
        //   args: {
        //     tokenIn: USDC,
        //     tokenOut: yvCurve_upYFI, // Different high-yield vault
        //     amountIn: "100000000", // Additional USDC
        //     slippage: "600", 
        //   },
        // },
      ];

      const bundle = await client.getBundleData(
        {
          chainId: ETHEREUM_MAINNET,
          fromAddress: testWallet,
          routingStrategy: "delegate",
          referralCode: "yearn-autocomp",
        },
        actions,
      );

      expect(bundle).toBeDefined();
      expect(bundle.bundle.length).toBe(4); // Balance + Redeem + 2 Reinvestments

      console.log("Auto-compound strategy:", {
        steps: "Balance → Redeem → Reinvest → Diversify",
        actions: bundle.bundle.length,
        targetVaults: ["yvCurve-sdYFIv2", "yvCurve-upYFI"],
        gas: bundle.gas,
      });
    }, 60000);
  });

  it("should auto-compound high-yield vault rewards", async () => {
      // Test automated reward extraction and reinvestment
      const actions: BundleAction[] = [
        // Step 4: Also compound into a different high-yield strategy for diversification
        // From "should auto-compound high-yield vault rewards" - WORKS on its own, doesn't work in a bundle
        {
          protocol: "enso",
          action: "route",
          args: {
            tokenIn: USDC,
            tokenOut: yvCurve_upYFI, // Different high-yield vault
            amountIn: "100000000", // Additional USDC
            slippage: "600", 
          },
        },
      ];

      const bundle = await client.getBundleData(
        {
          chainId: ETHEREUM_MAINNET,
          fromAddress: testWallet,
          routingStrategy: "delegate",
          referralCode: "yearn-autocomp",
        },
        actions,
      );

      expect(bundle).toBeDefined();
            console.log("Auto-compound strategy:", {
        steps: JSON.stringify(bundle),
        actions: bundle.bundle.length,
        targetVaults: ["yvCurve-sdYFIv2", "yvCurve-upYFI"],
        gas: bundle.gas,
      });
    }, 60000);
});
