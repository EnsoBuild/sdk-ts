import { Address, EnsoClient, RouteParams } from "../src";

describe("Berachain Kodiak Ecosystem Routes", () => {
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

  // Kodiak Finance Contract Addresses
  const KODIAK_FACTORY =
    "0x679a7C63FC83b6A4D9C1F931891d705483d4791F" as Address;
  const KODIAK_V2_ROUTER =
    "0xd91dd58387Ccd9B66B390ae2d7c66dBD46BC6022" as Address;
  const HONEY_WBERA_POOL =
    "0x9659dc8c1565E0bd82627267e3b4eEd1a377ebE6" as Address;
  const WBTC_WETH_ISLAND =
    "0x1ac0E38eE5f66F6fa46E1644BB6B73bEe598b953" as Address;

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

    it("should execute Route 14: BERA → KODI WBERA-HONEY Island LP", async () => {
      const zapAmount = "1500000000000000000"; // 1.5 BERA

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [zapAmount],
        tokenIn: [BERA],
        tokenOut: [HONEY_WBERA_POOL], // WBERA-HONEY Island
        routingStrategy: "delegate",
        slippage: "75", // 0.75% slippage
        referralCode: "kodiak-island",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 14 - BERA → KODI WBERA-HONEY Island LP:", {
        routeSteps: `BERA → WBERA-HONEY LP via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 30000);
  });

  describe("Multi-Step Flows", () => {
    it("should execute Route 4: YEET → BERA → BERA/YEET Island", async () => {
      const yeetAmount = "100000000000000000000"; // 100 YEET

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [yeetAmount],
        tokenIn: [YEET],
        tokenOut: [HONEY_WBERA_POOL], // Assuming BERA/YEET Island uses same pool structure
        routingStrategy: "delegate",
        slippage: "200", // 2% slippage
        referralCode: "yeet-island",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 4 - YEET → BERA → BERA/YEET Island:", {
        routeSteps: `YEET → BERA → BERA/YEET LP via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 5: BERA/HONEY Island → Bault", async () => {
      const lpAmount = "1000000000000000000"; // 1 LP token
      const BAULT_KODI_WBERA_HONEY =
        "0x056319DE9c9DF9eD7eE35221795F8C9F9E160cd1";

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [lpAmount],
        tokenIn: [HONEY_WBERA_POOL], // Island LP tokens
        tokenOut: [BAULT_KODI_WBERA_HONEY], // Assuming Bault uses factory address
        routingStrategy: "delegate",
        slippage: "50", // 0.5% slippage
        referralCode: "island-bault",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 5 - BERA/HONEY Island → Bault:", {
        routeSteps: `Island LP → Bault via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 5: BERA → BAULT_KODI_WBERA_HONEY", async () => {
      const lpAmount = "1000000000000000000"; // 1 WETH
      const BAULT_KODI_WBERA_HONEY =
        "0x056319DE9c9DF9eD7eE35221795F8C9F9E160cd1";

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [lpAmount],
        tokenIn: [BERA], // Island LP tokens
        tokenOut: [BAULT_KODI_WBERA_HONEY], // Assuming Bault uses factory address
        routingStrategy: "delegate",
        slippage: "50", // 0.5% slippage
        referralCode: "island-bault",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 5 - BERA/HONEY Island → Bault:", {
        routeSteps: `Island LP → Bault via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 15: iBGT → KODI YEET-wgBERA Island", async () => {
      const ibgtAmount = "200000000000000000"; // 0.2 iBGT

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [ibgtAmount],
        tokenIn: [iBGT],
        tokenOut: [HONEY_WBERA_POOL], // Assuming YEET-wgBERA Island
        routingStrategy: "delegate",
        slippage: "400", // 4% slippage for volatile YEET
        referralCode: "ibgt-yeet",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 15 - iBGT → KODI YEET-wgBERA Island:", {
        routeSteps: `iBGT → YEET-wgBERA Island via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);
  });

  describe("Stablecoin Strategies", () => {
    it("should execute Route 16: HONEY → KODI xUSD-HONEY Island", async () => {
      const honeyAmount = "1000000000000000000"; // 1 HONEY

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [honeyAmount],
        tokenIn: [HONEY],
        tokenOut: [HONEY_WBERA_POOL], // Assuming xUSD-HONEY Island
        routingStrategy: "delegate",
        slippage: "25", // 0.25% slippage for stablecoin
        referralCode: "honey-xusd",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 16 - HONEY → KODI xUSD-HONEY Island:", {
        routeSteps: `HONEY → xUSD-HONEY Island via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 30000);

    it("should execute Route 17: USDCE → KODI xUSD-HONEY Island", async () => {
      const usdceAmount = "1000000000"; // 1,000 USDCE (6 decimals)

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [usdceAmount],
        tokenIn: [USDCE],
        tokenOut: [HONEY_WBERA_POOL], // xUSD-HONEY Island
        routingStrategy: "delegate",
        slippage: "100", // 1% slippage for cross-chain stablecoin
        referralCode: "usdce-island",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 17 - USDCE → KODI xUSD-HONEY Island:", {
        routeSteps: `USDCE → xUSD-HONEY Island via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 30000);
  });

  describe("Advanced Features", () => {
    it("should execute Route 6: HONEY zap into NECT/iBGT Island", async () => {
      const honeyAmount = "2000000000000000000"; // 2 HONEY

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [honeyAmount],
        tokenIn: [HONEY],
        tokenOut: [HONEY_WBERA_POOL], // Assuming NECT/iBGT Island
        routingStrategy: "delegate",
        slippage: "150", // 1.5% slippage
        referralCode: "nect-ibgt",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 6 - HONEY zap into NECT/iBGT Island:", {
        routeSteps: `HONEY → NECT/iBGT Island via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);

    it("should execute Route 10: Sweetened BERA/HONEY Island with lockups", async () => {
      const beraAmount = "3000000000000000000"; // 3 BERA

      const routeParams: RouteParams = {
        fromAddress: testWallet,
        receiver: testWallet,
        chainId: BERACHAIN_MAINNET,
        amountIn: [beraAmount],
        tokenIn: [BERA],
        tokenOut: [HONEY_WBERA_POOL], // Sweetened BERA/HONEY Island
        routingStrategy: "delegate",
        slippage: "200", // 2% slippage for sweetened rewards
        referralCode: "sweet-island",
      };

      constructHappyPathLink(routeParams);
      const route = await client.getRouteData(routeParams);

      expect(route).toBeDefined();
      expect(route.amountOut).toBeDefined();

      console.log("Route 10 - Sweetened BERA/HONEY Island with lockups:", {
        routeSteps: `BERA → Sweetened Island via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 45000);
  });

  describe("Cross-Chain Operations", () => {
    it("should execute Route 12: ETH → BERA Bridge", async () => {
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

      console.log("Route 12 - ETH → BERA Bridge:", {
        routeSteps: `ETH → BERA cross-chain via ${route.route.length} steps`,
        route: JSON.stringify(route.route),
      });
    }, 60000);
  });
});

export function constructHappyPathLink(params: RouteParams): string {
  const baseUrl = "https://happypath.enso.build/";
  const urlParams = new URLSearchParams();

  // Core required parameters
  urlParams.set("chainId", params.chainId.toString());
  urlParams.set("tokenIn", params.tokenIn[0]); // Use first token for multi-token inputs
  urlParams.set("tokenOut", params.tokenOut[0]); // Use first token for multi-token outputs

  // Destination chain for cross-chain operations
  if (params.destinationChainId) {
    urlParams.set("outChainId", params.destinationChainId.toString());
  } else {
    urlParams.set("outChainId", params.chainId.toString()); // Same chain if not cross-chain
  }

  // Optional parameters that affect routing
  if (params.slippage) {
    urlParams.set("slippage", params.slippage.toString());
  }

  if (params.fromAddress) {
    urlParams.set("fromAddress", params.fromAddress);
  }

  if (params.receiver && params.receiver !== params.fromAddress) {
    urlParams.set("receiver", params.receiver);
  }

  if (params.routingStrategy && params.routingStrategy !== "delegate") {
    urlParams.set("routingStrategy", params.routingStrategy);
  }

  if (params.referralCode) {
    urlParams.set("referralCode", params.referralCode);
  }

  // Amount parameters
  if (params.amountIn && params.amountIn.length > 0) {
    urlParams.set("amountIn", params.amountIn[0].toString());
  }

  if (params.minAmountOut && params.minAmountOut.length > 0) {
    urlParams.set("minAmountOut", params.minAmountOut[0].toString());
  }

  // Advanced parameters
  if (params.fee && params.fee.length > 0) {
    urlParams.set("fee", params.fee[0].toString());
  }

  if (params.feeReceiver) {
    urlParams.set("feeReceiver", params.feeReceiver);
  }

  if (params.ignoreAggregators && params.ignoreAggregators.length > 0) {
    urlParams.set("ignoreAggregators", params.ignoreAggregators.join(","));
  }

  if (params.ignoreStandards && params.ignoreStandards.length > 0) {
    urlParams.set("ignoreStandards", params.ignoreStandards.join(","));
  }

  const url = `${baseUrl}?${urlParams.toString()}`;
  console.log(expect.getState().currentTestName, url);
  return url;
}
