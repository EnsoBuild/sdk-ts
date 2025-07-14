import { Address, EnsoClient, RouteParams } from "../src";
import { constructHappyPathLink } from "./utils";

describe("YEARN Protocol Integration Routes", () => {
  const client = new EnsoClient({
    apiKey: "56b3d1f4-5c59-4fc1-8998-16d001e277bc",
  });

  const ETHEREUM_MAINNET = 1;
  const testWallet = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045" as Address;

  // Core Tokens
  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as Address;
  const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as Address;
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F" as Address;
  const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" as Address;
  const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7" as Address;
  const LUSD = "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0" as Address;

  // Yearn V3 Vault Addresses
  const yvUSDC = "0xa354F35829Ae975e850e23e9615b11Da1B3dC4DE" as Address;
  const yvWETH = "0xa258C4606Ca8206D8aA700cE2143D7db854D168c" as Address;
  const yvDAI = "0xdA816459F1AB5631232FE5e97a05BBBb94970c95" as Address;
  const yvWBTC = "0xa696a63cc78dffa1a63e9e50587c197387ff6c7e" as Address;
  const yvUSDT = "0x7da96a3891add058ada2e826306d812c638d87a7" as Address;
  const yvLUSD = "0x378cb52b00F9D0921cb46dFc099CFf73b42419dC" as Address;

  // Yearn V2 Vault Addresses
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

  describe("Core Operations", () => {
    it("should execute Route 1: USDC → yvUSDC deposit", async () => {
      const inputAmount = "1000000000"; // 1,000 USDC

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: ETHEREUM_MAINNET,
        amountIn: [inputAmount],
        tokenIn: [USDC],
        tokenOut: [yvUSDC],
        routingStrategy: "delegate",
        slippage: "100", // 1% slippage
        referralCode: "yearn-deposit",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 1 - USDC → yvUSDC deposit:", {
        routeSteps: `USDC → yvUSDC via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 30000);

    it("should execute Route 2: yvUSDC → USDC withdrawal", async () => {
      const shareAmount = "1000000000"; // 1,000 yvUSDC shares

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

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 2 - yvUSDC → USDC withdrawal:", {
        routeSteps: `yvUSDC → USDC via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 30000);

    it("should execute Route 3: WETH → yvWETH deposit", async () => {
      const inputAmount = "1000000000000000000"; // 1 WETH

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: ETHEREUM_MAINNET,
        amountIn: [inputAmount],
        tokenIn: [WETH],
        tokenOut: [yvWETH],
        routingStrategy: "delegate",
        slippage: "100", // 1% slippage
        referralCode: "yearn-eth",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 3 - WETH → yvWETH deposit:", {
        routeSteps: `WETH → yvWETH via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 30000);

    it("should execute Route 4: DAI → yvDAI deposit", async () => {
      const inputAmount = "1000000000000000000000"; // 1,000 DAI

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: ETHEREUM_MAINNET,
        amountIn: [inputAmount],
        tokenIn: [DAI],
        tokenOut: [yvDAI],
        routingStrategy: "delegate",
        slippage: "100", // 1% slippage
        referralCode: "yearn-dai",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 4 - DAI → yvDAI deposit:", {
        routeSteps: `DAI → yvDAI via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 30000);
  });

  describe("Multi-Step Flows", () => {
    it("should execute Route 5: USDC → yvCurve_TriCryptoUSDC high-yield", async () => {
      const inputAmount = "2000000000"; // 2,000 USDC

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: ETHEREUM_MAINNET,
        amountIn: [inputAmount],
        tokenIn: [USDC],
        tokenOut: [yvCurve_TriCryptoUSDC],
        routingStrategy: "delegate",
        slippage: "300", // 3% slippage for complex strategy
        referralCode: "yearn-tricrypto",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 5 - USDC → yvCurve_TriCryptoUSDC high-yield:", {
        routeSteps: `USDC → TriCrypto Vault via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 6: WETH → yvCurve_stETH strategy", async () => {
      const inputAmount = "2000000000000000000"; // 2 WETH

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: ETHEREUM_MAINNET,
        amountIn: [inputAmount],
        tokenIn: [WETH],
        tokenOut: [yvCurve_stETH],
        routingStrategy: "delegate",
        slippage: "200", // 2% slippage
        referralCode: "yearn-steth",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 6 - WETH → yvCurve_stETH strategy:", {
        routeSteps: `WETH → stETH Curve Vault via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 7: USDT → yvCurve_USDT_crvUSD strategy", async () => {
      const inputAmount = "1000000000"; // 1,000 USDT

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: ETHEREUM_MAINNET,
        amountIn: [inputAmount],
        tokenIn: [USDT],
        tokenOut: [yvCurve_USDT_crvUSD],
        routingStrategy: "delegate",
        slippage: "150", // 1.5% slippage
        referralCode: "yearn-usdt-crv",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 7 - USDT → yvCurve_USDT_crvUSD strategy:", {
        routeSteps: `USDT → USDT/crvUSD Curve Vault via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 8: USDC → yvCurve_USDC_crvUSD strategy", async () => {
      const inputAmount = "1500000000"; // 1,500 USDC

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: ETHEREUM_MAINNET,
        amountIn: [inputAmount],
        tokenIn: [USDC],
        tokenOut: [yvCurve_USDC_crvUSD],
        routingStrategy: "delegate",
        slippage: "150", // 1.5% slippage
        referralCode: "yearn-usdc-crv",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 8 - USDC → yvCurve_USDC_crvUSD strategy:", {
        routeSteps: `USDC → USDC/crvUSD Curve Vault via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 9: WBTC → yvWBTC deposit", async () => {
      const inputAmount = "100000000"; // 1 WBTC

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: ETHEREUM_MAINNET,
        amountIn: [inputAmount],
        tokenIn: [WBTC],
        tokenOut: [yvWBTC],
        routingStrategy: "delegate",
        slippage: "200", // 2% slippage
        referralCode: "yearn-btc",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 9 - WBTC → yvWBTC deposit:", {
        routeSteps: `WBTC → yvWBTC via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);
  });

  describe("Yield Strategies", () => {
    it("should execute Route 10: LUSD → yvLUSD high-yield deposit", async () => {
      const inputAmount = "1000000000000000000000"; // 1,000 LUSD

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: ETHEREUM_MAINNET,
        amountIn: [inputAmount],
        tokenIn: [LUSD],
        tokenOut: [yvLUSD],
        routingStrategy: "delegate",
        slippage: "200", // 2% slippage
        referralCode: "yearn-lusd",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 10 - LUSD → yvLUSD high-yield deposit:", {
        routeSteps: `LUSD → yvLUSD via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 30000);

    it("should execute Route 11: USDC → yvLUSD cross-asset yield", async () => {
      const inputAmount = "1000000000"; // 1,000 USDC

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: ETHEREUM_MAINNET,
        amountIn: [inputAmount],
        tokenIn: [USDC],
        tokenOut: [yvLUSD],
        routingStrategy: "delegate",
        slippage: "250", // 2.5% slippage for cross-asset
        referralCode: "yearn-cross",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 11 - USDC → yvLUSD cross-asset yield:", {
        routeSteps: `USDC → yvLUSD via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 30000);
  });

  describe("Advanced Features", () => {
    it("should execute Route 13: USDC → yvCurve_sdYFIv2 ultra-high-yield", async () => {
      const inputAmount = "500000000"; // 500 USDC

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: ETHEREUM_MAINNET,
        amountIn: [inputAmount],
        tokenIn: [USDC],
        tokenOut: [yvCurve_sdYFIv2],
        routingStrategy: "delegate",
        slippage: "500", // 5% slippage for ultra-high-yield
        referralCode: "yearn-sdyfi",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 13 - USDC → yvCurve_sdYFIv2 ultra-high-yield:", {
        routeSteps: `USDC → sdYFI Vault via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 14: USDC → yvCurve_upYFI strategy", async () => {
      const inputAmount = "500000000"; // 500 USDC

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: ETHEREUM_MAINNET,
        amountIn: [inputAmount],
        tokenIn: [USDC],
        tokenOut: [yvCurve_upYFI],
        routingStrategy: "delegate",
        slippage: "500", // 5% slippage for high-yield strategy
        referralCode: "yearn-upyfi",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 14 - USDC → yvCurve_upYFI strategy:", {
        routeSteps: `USDC → upYFI Vault via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 15: USDT → yvCurve_3CryptoUSDT strategy", async () => {
      const inputAmount = "1000000000"; // 1,000 USDT

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: ETHEREUM_MAINNET,
        amountIn: [inputAmount],
        tokenIn: [USDT],
        tokenOut: [yvCurve_3CryptoUSDT],
        routingStrategy: "delegate",
        slippage: "400", // 4% slippage for 3crypto strategy
        referralCode: "yearn-3crypto",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 15 - USDT → yvCurve_3CryptoUSDT strategy:", {
        routeSteps: `USDT → 3Crypto Vault via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);
  });
});

describe("YEARN Berachain Routes", () => {
  const client = new EnsoClient({
    apiKey: "56b3d1f4-5c59-4fc1-8998-16d001e277bc",
  });

  const BERACHAIN_MAINNET = 80094;
  const testWallet = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045" as Address;

  // Token Addresses
  const BERA = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" as Address;
  const HONEY = "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590" as Address;
  const WBERA = "0x6969696969696969696969696969696969696969" as Address;
  const USDC = "0x779Ded0c9e1022225f8E0630b35a9b54bE713736" as Address;
  const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" as Address;
  const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as Address;
  const iBGT = "0xac03CABA51e17c86c921E1f6CBFBdC91F8BB2E6b" as Address;
  const ORIBGT = "0x69f1E971257419B1E9C405A553f252c64A29A30a" as Address;
  const YEET = "0x08A38Caa631DE329FF2DAD1656CE789F31AF3142" as Address;
  const USDCE = "0x549943e04f40284185054145c6E4e9568C1D3241" as Address;
  const xUSD = "0x6eAf19b2FC24552925dB245F9Ff613157a7dbb4C" as Address;
  const NECT = "0x1cE0a25D13CE4d52071aE7e02Cf1F6606F4C79d3" as Address;
  const ETH = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" as Address;

  // Bearn (Yearn) Token Addresses
  const yHONEY = "0xC82971BcFF09171e16Ac08AEE9f4EA3fB16C3BDC" as Address;
  const styHONEY = "0x99d6A0FB9420F3995fD07dCc36AC827a8E146cf9" as Address;
  const BERAMO = "0x0000000000000000000000000000000000000000" as Address; // Placeholder - needs actual address

  // Kodiak Finance Contract Addresses
  const KODIAK_FACTORY =
    "0x679a7C63FC83b6A4D9C1F931891d705483d4791F" as Address;
  const KODIAK_V2_ROUTER =
    "0xd91dd58387Ccd9B66B390ae2d7c66dBD46BC6022" as Address;
  const HONEY_WBERA_POOL =
    "0x9659dc8c1565E0bd82627267e3b4eEd1a377ebE6" as Address;
  const WBTC_WETH_ISLAND =
    "0x1ac0E38eE5f66F6fa46E1644BB6B73bEe598b953" as Address;

  // LP Token Addresses from the document
  const byAB_KODIAK_WBERA_BERAMO =
    "0xefC923B5F2162b83F0e05dC36148aD56615Bff70" as Address;
  const bcUSDCe_HONEY_STABLE =
    "0x52eC4C782244B797AeFf58d6285da70f606087eD" as Address;

  // Bault (Auto-compounding vault) Addresses
  const BAULT_KODI_WBERA_HONEY =
    "0x056319DE9c9DF9eD7eE35221795F8C9F9E160cd1" as Address;

  describe("Core Swaps & Zaps", () => {
    it("should execute Route 1: BERA → HONEY swap", async () => {
      const swapAmount = "1000000000000000000"; // 1 BERA

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [swapAmount],
        tokenIn: [BERA],
        tokenOut: [HONEY],
        routingStrategy: "delegate",
        slippage: "50", // 0.5% slippage
        referralCode: "kodiak-swap",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();
      expect(route.route).toBeDefined();

      console.log("Route 1 - BERA → HONEY swap:", {
        routeSteps: `BERA → HONEY via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 30000);

    it("should execute Route 2: BERA zap into BERA/HONEY Island", async () => {
      const zapAmount = "2000000000000000000"; // 2 BERA

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [zapAmount],
        tokenIn: [BERA],
        tokenOut: [HONEY_WBERA_POOL], // BERA/HONEY Island LP
        routingStrategy: "delegate",
        slippage: "100", // 1% slippage
        referralCode: "kodiak-zap",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 2 - BERA zap into BERA/HONEY Island:", {
        routeSteps: `BERA → BERA/HONEY LP via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 30000);

    it("should execute Route 3: HONEY → yHONEY deposit", async () => {
      const depositAmount = "1000000000000000000"; // 1 HONEY

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [depositAmount],
        tokenIn: [HONEY],
        tokenOut: [yHONEY],
        routingStrategy: "delegate",
        slippage: "50", // 0.5% slippage for stable yield
        referralCode: "bearn-deposit",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 3 - HONEY → yHONEY deposit:", {
        routeSteps: `HONEY → yHONEY via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 30000);

    it("should execute Route 4: BERA → yHONEY single-step zap", async () => {
      const zapAmount = "1500000000000000000"; // 1.5 BERA

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [zapAmount],
        tokenIn: [BERA],
        tokenOut: [yHONEY],
        routingStrategy: "delegate",
        slippage: "100", // 1% slippage
        referralCode: "bera-yhoney",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 4 - BERA → yHONEY single-step zap:", {
        routeSteps: `BERA → yHONEY via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 30000);
  });

  describe("Multi-Step Flows", () => {
    it("should execute Route 5: yHONEY → styHONEY staking", async () => {
      const stakeAmount = "1000000000000000000"; // 1 yHONEY

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [stakeAmount],
        tokenIn: [yHONEY],
        tokenOut: [styHONEY],
        routingStrategy: "delegate",
        slippage: "25", // 0.25% slippage for staking
        referralCode: "bearn-stake",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 5 - yHONEY → styHONEY staking:", {
        routeSteps: `yHONEY → styHONEY via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 6: BERA → styHONEY complete flow", async () => {
      const flowAmount = "2000000000000000000"; // 2 BERA

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [flowAmount],
        tokenIn: [BERA],
        tokenOut: [styHONEY],
        routingStrategy: "delegate",
        slippage: "150", // 1.5% slippage for multi-step
        referralCode: "bera-styhoney",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 6 - BERA → styHONEY complete flow:", {
        routeSteps: `BERA → styHONEY via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 7: USDCe → HONEY → yHONEY bridge flow", async () => {
      const bridgeAmount = "1000000000"; // 1,000 USDCe

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [bridgeAmount],
        tokenIn: [USDCE],
        tokenOut: [yHONEY],
        routingStrategy: "delegate",
        slippage: "200", // 2% slippage for bridge + swap
        referralCode: "bridge-yhoney",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 7 - USDCe → HONEY → yHONEY bridge flow:", {
        routeSteps: `USDCe → yHONEY via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 8: bcUSDCe-HONEY-STABLE → yHONEY unwrap", async () => {
      const lpAmount = "1000000000000000000"; // 1 LP token

      /**
       * https://happypath.enso.build/?chainId=80094&tokenIn=xC82971BcFF09171e16Ac08AEE9f4EA3fB16C3BDC&tokenOut=0x52eC4C782244B797AeFf58d6285da70f606087eD&outChainId=80094&slippage=100&fromAddress=0xd8da6bf26964af9d7eed9e03e53415d37aa96045&referralCode=lp-unwrap&amountIn=1000000000000000000
       */
      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [lpAmount],
        tokenIn: [bcUSDCe_HONEY_STABLE],
        tokenOut: [yHONEY],
        routingStrategy: "delegate",
        slippage: "100", // 1% slippage for LP unwrap
        referralCode: "lp-unwrap",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 8 - bcUSDCe-HONEY-STABLE → yHONEY unwrap:", {
        routeSteps: `Stable LP → yHONEY via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 9: byAB-KODIAK-WBERA-BERAMO → BERA/HONEY Island", async () => {
      const rebalanceAmount = "1000000000000000000"; // 1 LP token

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [rebalanceAmount],
        tokenIn: [byAB_KODIAK_WBERA_BERAMO],
        tokenOut: [HONEY_WBERA_POOL],
        routingStrategy: "delegate",
        slippage: "400", // 4% slippage for volatile rebalance
        referralCode: "rebal-island",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 9 - byAB-KODIAK-WBERA-BERAMO → BERA/HONEY Island:", {
        routeSteps: `Volatile LP → Stable Island via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);
  });

  describe("Yield Strategies", () => {
    it("should execute Route 10: HONEY → Kodiak Island → Bault auto-compound", async () => {
      const compoundAmount = "2000000000000000000"; // 2 HONEY

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [compoundAmount],
        tokenIn: [HONEY],
        tokenOut: [BAULT_KODI_WBERA_HONEY],
        routingStrategy: "delegate",
        slippage: "150", // 1.5% slippage for yield strategy
        referralCode: "honey-bault",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 10 - HONEY → Kodiak Island → Bault auto-compound:", {
        routeSteps: `HONEY → Bault via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 30000);

    it("should execute Route 11: yHONEY → Kodiak Island pairing", async () => {
      const pairAmount = "1500000000000000000"; // 1.5 yHONEY

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [pairAmount],
        tokenIn: [yHONEY],
        tokenOut: [HONEY_WBERA_POOL],
        routingStrategy: "delegate",
        slippage: "200", // 2% slippage for yield token pairing
        referralCode: "yhoney-island",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 11 - yHONEY → Kodiak Island pairing:", {
        routeSteps: `yHONEY → Kodiak Island via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 30000);

    it("should execute Route 12: styHONEY → BERA redemption cycle", async () => {
      const redeemAmount = "1000000000000000000"; // 1 styHONEY

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [redeemAmount],
        tokenIn: [styHONEY],
        tokenOut: [BERA],
        routingStrategy: "delegate",
        slippage: "300", // 3% slippage for redemption
        referralCode: "styhoney-bera",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 12 - styHONEY → BERA redemption cycle:", {
        routeSteps: `styHONEY → BERA via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 30000);
  });

  describe("Advanced Features", () => {
    it("should execute Route 13: BERA → yHONEY → Kodiak Island compound", async () => {
      const advancedAmount = "3000000000000000000"; // 3 BERA

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [advancedAmount],
        tokenIn: [BERA],
        tokenOut: [BAULT_KODI_WBERA_HONEY],
        routingStrategy: "delegate",
        slippage: "250", // 2.5% slippage for advanced strategy
        referralCode: "bera-compound",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 13 - BERA → yHONEY → Kodiak Island compound:", {
        routeSteps: `BERA → Auto-compound Bault via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 14: iBGT → yHONEY governance yield", async () => {
      const govAmount = "500000000000000000"; // 0.5 iBGT

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [govAmount],
        tokenIn: [iBGT],
        tokenOut: [yHONEY],
        routingStrategy: "delegate",
        slippage: "400", // 4% slippage for governance token
        referralCode: "ibgt-yield",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 14 - iBGT → yHONEY governance yield:", {
        routeSteps: `iBGT → yHONEY via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 15: YEET → styHONEY meme to yield", async () => {
      const memeAmount = "100000000000000000000"; // 100 YEET

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [memeAmount],
        tokenIn: [YEET],
        tokenOut: [styHONEY],
        routingStrategy: "delegate",
        slippage: "500", // 5% slippage for volatile meme token
        referralCode: "yeet-styhoney",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 15 - YEET → styHONEY meme to yield:", {
        routeSteps: `YEET → styHONEY via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);
  });

  describe("Cross-Chain Operations", () => {
    it("should execute Route 16: ETH → BERA Bridge", async () => {
      const ethAmount = "100000000000000000"; // 0.1 ETH

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: 1, // Start from Ethereum
        destinationChainId: BERACHAIN_MAINNET,
        amountIn: [ethAmount],
        tokenIn: [ETH],
        tokenOut: [BERA],
        routingStrategy: "delegate",
        slippage: "300", // 3% slippage for bridge
        referralCode: "eth-bridge",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 16 - ETH → BERA Bridge:", {
        routeSteps: `ETH → BERA cross-chain via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 60000);

    it("should execute Route 17: ETH → styHONEY cross-chain yield", async () => {
      const crossYieldAmount = "200000000000000000"; // 0.2 ETH

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: 1, // Start from Ethereum
        destinationChainId: BERACHAIN_MAINNET,
        amountIn: [crossYieldAmount],
        tokenIn: [ETH],
        tokenOut: [styHONEY],
        routingStrategy: "delegate",
        slippage: "400", // 4% slippage for complex cross-chain
        referralCode: "eth-styhoney",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 17 - ETH → styHONEY cross-chain yield:", {
        routeSteps: `ETH → styHONEY cross-chain via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 60000);
  });
});

describe("Yearn Katana Routes", () => {
  const client = new EnsoClient({
    apiKey: "56b3d1f4-5c59-4fc1-8998-16d001e277bc",
  });

  const KATANA_MAINNET = 747474;
  const testWallet = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045" as Address;

  // Core Base Tokens
  const ETH = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" as Address;
  const WETH = "0x815955d051C6262C16c720b19D735426254Bec5B" as Address;
  const AUSD = "0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a" as Address;
  const USDC_BASE = "0xfd415D011FfaA8e6f17fa753CdB080d1dE266784" as Address;
  const USDS_BASE = "0x2134866886ce784fE2E0DE819118E4D32b4Be32C" as Address;
  const USDT_BASE = "0xf44e3BCB7A2461CC08185E127B324f2486a74E20" as Address;
  const WBTC_BASE = "0xB33e43A3F276e8e75792b941bccC996EcB2c0bBD" as Address;
  const WOOFY = "0x0eF68c1aB3C83CF11f9546FaBA385E8a1bd38d74" as Address;

  // Vault Bridge Wrapped Tokens
  const wETH_VB = "0xEE7D8BCFb72bC1880D0Cf19822eB0A2e6577aB62" as Address;
  const USDC_VB = "0x203A662b0BD271A6ed5a60EdFbd04bFce608FD36" as Address;
  const USDS_VB = "0x62D6A123E8D19d06d68cf0d2294F9A3A0362c6b3" as Address;
  const USDT_VB = "0x2DCa96907fde857dd3D816880A0df407eeB2D2F2" as Address;
  const WBTC_VB = "0x0913DA6Da4b42f538B445599b46Bb4622342Cf52" as Address;
  const WBETH = "0xEE7D8BCFb72bC1880D0Cf19822eB0A2e6577aB62" as Address;

  // Yearn v3 Vault Tokens (from provided addresses)
  const yvAUSD = "0x93Fec6639717b6215A48E5a72a162C50DCC40d68" as Address;
  const yvWOOFY = "0x639bCcF37CC0415812A6f110CFCa33127a81c0e9" as Address;
  const yvvbETH = "0xE007CA01894c863d7898045ed5A3B4Abf0b18f37" as Address;
  const yvvbUSDC = "0x80c34BD3A3569E126e7055831036aa7b212cB159" as Address;
  const yvvbUSDS = "0x8Fb1c10Ad4417EcA341a1D903Ff437d25ff87a4e" as Address;
  const yvvbUSDT = "0x9A6bd7B6Fd5C4F87eb66356441502fc7dCdd185B" as Address;
  const yvvbWBTC = "0xAa0362eCC584B985056E47812931270b99C91f9d" as Address;

  // Morpho Blue Vault Tokens
  const bbqAUSD = "0xdE6a4F28Acfe431DD1CfA2D9c7A3d8301624a841" as Address;
  const bbqUSDC = "0x1445A01a57D7B7663CfD7B4EE0a8Ec03B379aabD" as Address;
  const steakAUSD = "0x82c4C641CCc38719ae1f0FBd16A64808d838fDfD" as Address;
  const steakUSDC = "0x61D4F9D3797BA4dA152238c53a6f93Fb665C3c1d" as Address;

  // BitVault Tokens
  const bvUSD = "0x876aac7648D79f87245E73316eB2D100e75F3Df1" as Address;
  const sbvUSD = "0x24E2aE2f4c59b8b7a03772142d439fDF13AAF15b" as Address;

  // SushiSwap LP
  const SLP_USDC_ETH = "0xf9B1AE5F1929F9A4De548e98e0393ae1A9d1D0f8" as Address;

  // Ecosystem Tokens
  const KAT = "0x7F1f4b4b29f5058fA32CC7a97141b8D7e5ABDC2d" as Address;
  const LBTC = "0xecAc9C5F704e954931349Da37F60E39f515c11c1" as Address;
  const weETH = "0x9893989433e7a383Cb313953e4c2365107dc19a7" as Address;
  const MORPHO = "0x1e5eFCA3D0dB2c6d5C67a4491845c43253eB9e4e" as Address;
  const YFI = "0x476eaCd417cD65421bD34fca054377658BB5E02b" as Address;
  const JitoSOL = "0x6C16E26013f2431e8B2e1Ba7067ECCcad0Db6C52" as Address;
  const uSOL = "0x9B8Df6E244526ab5F6e6400d331DB28C8fdDdb55" as Address;
  const uSUI = "0xb0505e5a99abd03d94a1169e638B78EDfEd26ea4" as Address;
  const uXRP = "0x2615a94df961278DcbC41Fb0a54fEc5f10a693aE" as Address;
  const BTCK = "0xB0F70C0bD6FD87dbEb7C10dC692a2a6106817072" as Address;
  const wstETH = "0x7Fb4D0f51544F24F385a421Db6e7D4fC71Ad8e5C" as Address;
  const POL = "0xb24e3035d1FCBC0E43CF3143C3Fd92E53df2009b" as Address;
  const SUSHI = "0x17BFF452dae47e07CeA877Ff0E1aba17eB62b0aB" as Address;

  describe("Multi-Step Flows", () => {
    it("should execute Route 4: AUSD → yvAUSD → bbqAUSD Morpho stacking", async () => {
      const stackAmount = "1000000000"; // 1,000 AUSD

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: KATANA_MAINNET,
        amountIn: [stackAmount],
        tokenIn: [AUSD],
        tokenOut: [bbqAUSD],
        routingStrategy: "delegate",
        slippage: "150", // 1.5% slippage for multi-step
        referralCode: "ausd-morpho",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 4 - AUSD → yvAUSD → bbqAUSD Morpho stacking:", {
        routeSteps: `AUSD → bbqAUSD via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 5: vbUSDC → yvvbUSDC → SushiSwap LP", async () => {
      const lpAmount = "1000000000"; // 1,000 vbUSDC

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: KATANA_MAINNET,
        amountIn: [lpAmount],
        tokenIn: [USDC_VB],
        tokenOut: [SLP_USDC_ETH],
        routingStrategy: "delegate",
        slippage: "200", // 2% slippage for LP creation
        referralCode: "vbusdc-sushi",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 5 - vbUSDC → yvvbUSDC → SushiSwap LP:", {
        routeSteps: `vbUSDC → USDC/ETH SLP via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 50000);

    it("should execute Route 6: vbETH → yvvbETH → weETH liquid staking", async () => {
      const stakingAmount = "1000000000000000000"; // 1 vbETH

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: KATANA_MAINNET,
        amountIn: [stakingAmount],
        tokenIn: [wETH_VB],
        tokenOut: [weETH],
        routingStrategy: "delegate",
        slippage: "250", // 2.5% slippage for liquid staking
        referralCode: "vbeth-weeth",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 6 - vbETH → yvvbETH → weETH liquid staking:", {
        routeSteps: `vbETH → weETH via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 7: WBETH → yvvbWBTC → Morpho borrow loop", async () => {
      const loopAmount = "1000000000000000000"; // 1 WBTC

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: KATANA_MAINNET,
        amountIn: [loopAmount],
        tokenIn: [WBETH],
        tokenOut: [yvvbUSDT],
        routingStrategy: "delegate",
        slippage: "400", // 4% slippage for complex loop
        referralCode: "wbtc-loop",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 7 - WBTC → yvvbWBTC → Morpho borrow loop:", {
        routeSteps: `WBTC → yvvbUSDT loop via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 8: USDC → yvvbUSDS → steakUSDC prime vault", async () => {
      const primeAmount = "1000000000"; // 1,000 USDS

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: KATANA_MAINNET,
        amountIn: [primeAmount],
        tokenIn: [USDC_VB],
        tokenOut: [steakUSDC],
        routingStrategy: "delegate",
        slippage: "150", // 1.5% slippage for prime vault
        referralCode: "usds-prime",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 8 - USDS → yvvbUSDS → steakUSDC prime vault:", {
        routeSteps: `USDS → steakUSDC via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);
  });

  describe("Yield Strategies", () => {
    
    it("should execute Route 10: JitoSOL → uSOL → ETH → yvvbETH cross-chain yield", async () => {
      const crossAmount = "10000000000000000000"; // 1 JitoSOL

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: KATANA_MAINNET,
        amountIn: [crossAmount],
        tokenIn: [JitoSOL],
        tokenOut: [yvvbETH],
        routingStrategy: "delegate",
        slippage: "300", // 3% slippage for cross-chain
        referralCode: "jitosol-eth",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log(
        "Route 10 - JitoSOL → uSOL → ETH → yvvbETH cross-chain yield:",
        {
          routeSteps: `JitoSOL → yvvbETH via ${route.route.length} steps`,
          route: JSON.stringify(route.route),
        },
      );
    }, 30000);

    it("should execute Route 11: LBTC → WBTC → yvvbWBTC Bitcoin yield", async () => {
      const btcAmount = "100000000"; // 1 LBTC

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: KATANA_MAINNET,
        amountIn: [btcAmount],
        tokenIn: [LBTC],
        tokenOut: [yvvbWBTC],
        routingStrategy: "delegate",
        slippage: "200", // 2% slippage for BTC yield
        referralCode: "lbtc-yield",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 11 - LBTC → WBTC → yvvbWBTC Bitcoin yield:", {
        routeSteps: `LBTC → yvvbWBTC via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 30000);
  });

  describe("Advanced Features", () => {
    it("should execute Route 12: steakAUSD → borrow ETH → yvvbETH yield loop", async () => {
      const loopAmount = "2000000000000000000000"; // 2,000 steakAUSD

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: KATANA_MAINNET,
        amountIn: [loopAmount],
        tokenIn: [steakAUSD],
        tokenOut: [yvvbETH],
        routingStrategy: "delegate",
        slippage: "350", // 3.5% slippage for complex loop
        referralCode: "steak-loop",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 12 - steakAUSD → borrow ETH → yvvbETH yield loop:", {
        routeSteps: `steakAUSD → yvvbETH loop via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 13: YFI → WOOFY → yvWOOFY governance yield", async () => {
      const govAmount = "1000000000000000000"; // 1 YFI

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: KATANA_MAINNET,
        amountIn: [govAmount],
        tokenIn: [YFI],
        tokenOut: [yvWOOFY],
        routingStrategy: "delegate",
        slippage: "400", // 4% slippage for governance token
        referralCode: "yfi-woofy",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 13 - YFI → WOOFY → yvWOOFY governance yield:", {
        routeSteps: `YFI → yvWOOFY via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 14: MORPHO → AUSD → bbqAUSD protocol synergy", async () => {
      const synergyAmount = "1000000000000000000000"; // 1,000 MORPHO

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: KATANA_MAINNET,
        amountIn: [synergyAmount],
        tokenIn: [MORPHO],
        tokenOut: [bbqAUSD],
        routingStrategy: "delegate",
        slippage: "300", // 3% slippage for protocol synergy
        referralCode: "morpho-bbq",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 14 - MORPHO → AUSD → bbqAUSD protocol synergy:", {
        routeSteps: `MORPHO → bbqAUSD via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 15: KAT rewards → yvvbUSDC compound strategy", async () => {
      const rewardAmount = "10000000000000000000000"; // 10000 KAT

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: KATANA_MAINNET,
        amountIn: [rewardAmount],
        tokenIn: [KAT],
        tokenOut: [yvvbUSDC],
        routingStrategy: "delegate",
        slippage: "500", // 5% slippage for native token
        referralCode: "kat-compound",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.tx).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 15 - KAT rewards → yvvbUSDC compound strategy:", {
        routeSteps: `KAT → yvvbUSDC via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);
  });
});
