import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { EnsoClient } from "../src/index";
import {
  ActionData,
  Address,
  ApproveParams,
  BundleAction,
  BundleParams,
  IporShortcutData,
  IporShortcutInputData,
  Network,
  NetworkParams,
  NonTokenizedParams,
  PaginatedNonTokenizedPositionData,
  Project,
  ProtocolData,
  RouteData,
  RouteNonTokenizedParams,
  RouteParams,
  StandardData,
  TokenParams,
} from "../src/types/types";

// Mock data fixtures
const mockRouteData = {
  route: [
    {
      action: "swap",
      protocol: "uniswap-v2",
      tokenIn: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"],
      tokenOut: ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"],
    },
  ],
  gas: "150000",
  amountOut: "1000000000000000000",
  priceImpact: "10",
  createdAt: 123456,
  tx: {
    data: "0x123456",
    to: "0xAddress",
    from: "0xFrom",
    value: "0",
  },
  feeAmount: ["1000000"],
};

const mockApproveData = {
  amount: "1000000000000000000",
  gas: "50000",
  spender: "0xSpenderAddress",
  token: "0xTokenAddress",
  tx: {
    data: "0xapprove",
    to: "0xTokenAddress",
    from: "0xFrom",
  },
};

describe("EnsoClient", () => {
  let client: EnsoClient;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  beforeEach(() => {
    mock.reset();
    client = new EnsoClient({
      apiKey: "test-api-key",
      baseURL: "https://api.enso.finance/api/v1",
    });
  });

  afterAll(() => {
    mock.restore();
  });

  describe("Constructor", () => {
    it("should initialize with custom baseURL", () => {
      const customClient = new EnsoClient({
        apiKey: "test-key",
        baseURL: "https://custom.api.com",
      });
      expect(customClient).toBeInstanceOf(EnsoClient);
    });

    it("should initialize with default baseURL", () => {
      const defaultClient = new EnsoClient({
        apiKey: "test-key",
      });
      expect(defaultClient).toBeInstanceOf(EnsoClient);
    });
  });

  describe("getApprovalData", () => {
    const approveParams: ApproveParams = {
      fromAddress: "0xFrom" as Address,
      tokenAddress: "0xToken" as Address,
      chainId: 1,
      amount: 1000000,
    };

    it("should call the correct endpoint with correct params", async () => {
      mock.onGet("/wallet/approve").reply(200, mockApproveData);

      const result = await client.getApprovalData(approveParams);

      expect(mock.history.get[0].url).toBe("/wallet/approve");
      expect(mock.history.get[0].params).toEqual({
        ...approveParams,
        routingStrategy: "router",
      });
      expect(result).toEqual(mockApproveData);
    });

    it("should use provided routingStrategy", async () => {
      mock.onGet("/wallet/approve").reply(200, mockApproveData);

      await client.getApprovalData({
        ...approveParams,
      });

      expect(mock.history.get[0].params.routingStrategy).toBe("router");
    });

    it("should handle API errors gracefully", async () => {
      mock.onGet("/wallet/approve").reply(500, { error: "Server Error" });

      await expect(client.getApprovalData(approveParams)).rejects.toThrow(
        "API Error: Request failed with status code 500",
      );
    });
  });

  describe("getRouteData", () => {
    const routeParams: RouteParams = {
      fromAddress: "0xFrom" as Address,
      receiver: "0xReceiver" as Address,
      spender: "0xSpender" as Address,
      chainId: 1,
      amountIn: ["1000000"],
      tokenIn: ["0xTokenIn"] as Address[],
      tokenOut: ["0xTokenOut"] as Address[],
      routingStrategy: "router",
    };

    it("should get route data successfully", async () => {
      mock.onGet("/shortcuts/route").reply(200, mockRouteData);

      const result = await client.getRouteData(routeParams);

      expect(result).toEqual(mockRouteData);
      expect(mock.history.get[0].params).toMatchObject(routeParams);
    });

    it("should handle slippage parameter", async () => {
      mock.onGet("/shortcuts/route").reply(200, mockRouteData);

      await client.getRouteData({
        ...routeParams,
        slippage: 300,
      });

      expect(mock.history.get[0].params.slippage).toBe(300);
    });

    it("should not include minAmountOut when slippage is provided", async () => {
      mock.onGet("/shortcuts/route").reply(200, mockRouteData);

      await client.getRouteData({
        ...routeParams,
        slippage: 300,
        minAmountOut: ["1000000"],
      });

      expect(mock.history.get[0].params.slippage).toBe(300);
    });
  });

  describe("getBalances", () => {
    const balanceParams = {
      chainId: 1,
      eoaAddress: "0xEOA" as Address,
    };

    const mockBalances = [
      {
        amount: "1000000",
        decimals: 18,
        token: "0xToken1",
        price: "3600",
      },
      {
        amount: "2000000",
        decimals: 6,
        token: "0xToken2",
        price: "1",
      },
    ];

    it("should fetch balances with default useEoa", async () => {
      mock.onGet("/wallet/balances").reply(200, mockBalances);

      const result = await client.getBalances(balanceParams);

      expect(result).toEqual(mockBalances);
      expect(mock.history.get[0].params.useEoa).toBe(true);
    });

    it("should respect provided useEoa value", async () => {
      mock.onGet("/wallet/balances").reply(200, mockBalances);

      await client.getBalances({
        ...balanceParams,
        useEoa: false,
      });

      expect(mock.history.get[0].params.useEoa).toBe(false);
    });
  });

  describe("Token Data Methods", () => {
    it("should get token data correctly", async () => {
      const mockTokenResponse = {
        data: [
          {
            address: "0xToken",
            chainId: 1,
            type: "base",
            decimals: 18,
          },
        ],
      };

      mock.onGet("/tokens").reply(200, mockTokenResponse);

      const result = await client.getTokenData({ chainId: 1 });

      expect(result).toEqual(mockTokenResponse);
      expect(mock.history.get[0].params.page).toBe(1);
    });

    it("should get price data correctly", async () => {
      const mockPriceData = {
        price: "3600",
        decimals: 18,
        symbol: "WETH",
        timestamp: 1699999999,
        confidence: 0.99,
        chainId: 1,
      };

      mock.onGet("/prices/1/0xToken").reply(200, mockPriceData);

      const result = await client.getPriceData({
        chainId: 1,
        address: "0xToken",
      });

      expect(result).toEqual(mockPriceData);
    });
  });

  describe("Bundle Methods", () => {
    const bundleParams: BundleParams = {
      chainId: 1,
      fromAddress: "0xFrom" as Address,
      routingStrategy: "router",
    };

    const bundleActions: BundleAction[] = [
      {
        protocol: "enso",
        action: "route",
        args: {
          tokenIn: "0xTokenIn" as Address,
          tokenOut: "0xTokenOut" as Address,
          amountIn: "1000000",
        },
      },
    ];

    const mockBundleData = {
      bundle: bundleActions,
      gas: "300000",
      createdAt: 123456,
      tx: {
        data: "0xbundledata",
        to: "0xTo" as Address,
        from: "0xFrom" as Address,
        value: "0",
      },
    };

    it("should create bundle correctly", async () => {
      mock.onPost("/shortcuts/bundle").reply(200, mockBundleData);

      const result = await client.getBundleData(bundleParams, bundleActions);

      expect(result).toEqual(mockBundleData);
      expect(mock.history.post[0].data).toBe(JSON.stringify(bundleActions));
    });
  });

  describe("Complex Integration Tests", () => {
    it("should handle multi-step workflow correctly", async () => {
      // 1. Get approval
      mock.onGet("/wallet/approve").reply(200, mockApproveData);

      // 2. Get route
      mock.onGet("/shortcuts/route").reply(200, mockRouteData);

      // 3. Get balances
      mock.onGet("/wallet/balances").reply(200, []);

      // Simulate a workflow
      const approval = await client.getApprovalData({
        fromAddress: "0xFrom",
        tokenAddress: "0xToken",
        chainId: 1,
        amount: 1000000,
      });

      const route = await client.getRouteData({
        fromAddress: "0xFrom",
        receiver: "0xReceiver",
        spender: "0xSpender",
        chainId: 1,
        amountIn: ["1000000"],
        tokenIn: ["0xToken"],
        tokenOut: ["0xTokenOut"],
        routingStrategy: "router",
      });

      const balances = await client.getBalances({
        chainId: 1,
        eoaAddress: "0xFrom",
      });

      expect(approval).toBeDefined();
      expect(route).toBeDefined();
      expect(balances).toBeDefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors", async () => {
      mock.onGet("/wallet/approve").networkError();

      await expect(
        client.getApprovalData({
          fromAddress: "0xFrom",
          tokenAddress: "0xToken",
          chainId: 1,
          amount: 1000000,
        }),
      ).rejects.toThrow();
    });

    it("should handle timeout errors", async () => {
      mock.onGet("/wallet/approve").timeout();

      await expect(
        client.getApprovalData({
          fromAddress: "0xFrom",
          tokenAddress: "0xToken",
          chainId: 1,
          amount: 1000000,
        }),
      ).rejects.toThrow();
    });
  });

  describe("Edge Cases", () => {
    it("should handle large numbers correctly", async () => {
      const largeAmount = 1000000000000000000000000;
      const approveParams: ApproveParams = {
        fromAddress: "0xFrom" as Address,
        tokenAddress: "0xToken" as Address,
        chainId: 1,
        amount: largeAmount,
      };

      mock.onGet("/wallet/approve").reply(200, mockApproveData);

      await client.getApprovalData(approveParams);

      expect(mock.history.get[0].params.amount).toBe(largeAmount);
    });

    it("should handle multiple tokenIn/tokenOut arrays", async () => {
      const multiTokenParams: RouteParams = {
        fromAddress: "0xFrom" as Address,
        receiver: "0xReceiver" as Address,
        spender: "0xSpender" as Address,
        chainId: 1,
        amountIn: ["1000000", "2000000"],
        tokenIn: ["0xToken1" as Address, "0xToken2" as Address],
        tokenOut: ["0xTokenOut1" as Address, "0xTokenOut2" as Address],
        routingStrategy: "router",
      };

      mock.onGet("/shortcuts/route").reply(200, mockRouteData);

      await client.getRouteData(multiTokenParams);

      expect(mock.history.get[0].params.tokenIn).toEqual([
        "0xToken1",
        "0xToken2",
      ]);
    });
  });

  describe("getRouteNonTokenized", () => {
    const params: RouteNonTokenizedParams = {
      fromAddress: "0xFrom" as Address,
      tokenIn: ["0xTokenIn"] as Address[],
      positionOut: "0xPositionOut" as Address,
      amountIn: ["1000000"],
      receiver: "0xReceiver" as Address,
      routingStrategy: "delegate",
      chainId: 1,
    };

    it("should get route for non-tokenized position with default strategy", async () => {
      mock.onGet("/shortcuts/route/nontokenized").reply(200, mockRouteData);

      const result = await client.getRouteNonTokenized(params);

      expect(result).toEqual(mockRouteData);
      expect(mock.history.get[0].params.routingStrategy).toBe("delegate");
    });

    it("should use provided routing strategy", async () => {
      mock.onGet("/shortcuts/route/nontokenized").reply(200, mockRouteData);

      await client.getRouteNonTokenized({
        ...params,
        routingStrategy: "delegate",
      });

      expect(mock.history.get[0].params.routingStrategy).toBe("delegate");
    });
  });

  describe("getIporShortcut", () => {
    const params = {
      fromAddress: "0xFrom",
      chainId: 1,
    };

    const mockIporData: IporShortcutData = {
      createdAt: 123456,
      tx: {
        data: "0xipor",
        to: "0xTo" as Address,
        from: "0xFrom" as Address,
        value: "0",
      },
      logs: ["log1", "log2"],
      simulationURL: "https://tenderly.co/simulation",
    };

    const inputData: IporShortcutInputData = {
      amountIn: "1000000",
      tokenIn: "0xTokenIn",
      tokenBToBuy: "0xTokenB",
      percentageForTokenB: "5000", // 50%
      slippage: "100", // 1%
      simulate: true,
    };

    it("should get IPOR shortcut transaction", async () => {
      mock.onPost("/shortcuts/static/ipor").reply(200, mockIporData);

      const result = await client.getIporShortcut(params, inputData);

      expect(result).toEqual(mockIporData);
      expect(mock.history.post[0].data).toBe(JSON.stringify(inputData));
    });

    it("should handle optional chainId", async () => {
      mock.onPost("/shortcuts/static/ipor").reply(200, mockIporData);

      await client.getIporShortcut({ fromAddress: "0xFrom" }, inputData);

      expect(mock.history.post[0].params).toEqual({ fromAddress: "0xFrom" });
    });
  });

  describe("getStandards", () => {
    const mockStandards: StandardData[] = [
      {
        protocol: { slug: "protocol1", url: "https://protocol1.com" },
        forks: [],
        actions: [
          {
            action: "swap",
            name: "Swap",
            functionNames: ["swap"],
            supportedChains: [{ id: 1, name: "Ethereum" }],
            inputs: ["tokenIn", "tokenOut"],
          },
        ],
      },
    ];

    it("should get all standards", async () => {
      mock.onGet("/standards").reply(200, mockStandards);

      const result = await client.getStandards();

      expect(result).toEqual(mockStandards);
    });
  });

  describe("getStandardBySlug", () => {
    const mockStandardBySlug: StandardData[] = [
      {
        protocol: { slug: "uniswap", url: "https://uniswap.org" },
        forks: [],
        actions: [
          {
            action: "swap",
            name: "Swap",
            functionNames: ["swap"],
            supportedChains: [{ id: 1, name: "Ethereum" }],
            inputs: ["tokenIn", "tokenOut"],
          },
        ],
      },
    ];

    it("should get standard by slug", async () => {
      mock.onGet("/standards/uniswap").reply(200, mockStandardBySlug);

      const result = await client.getStandardBySlug("uniswap");

      expect(result).toEqual(mockStandardBySlug);
    });
  });

  describe("getActions", () => {
    const mockActions: ActionData[] = [
      {
        action: "swap",
        inputs: {
          tokenIn: {
            type: "AddressArg",
            description: "Address of token to send",
          },
          tokenOut: {
            type: "AddressArg",
            description: "Address of token to receive",
          },
          amountIn: {
            type: "NumberArg",
            description: "The amount to deposit",
          },
          primaryAddress: {
            type: "AccountArg",
            optional: true,
            description: "The receiver account",
          },
          receiver: {
            type: "AddressArg",
            description: "Address of smart contract to interact with",
          },
          slippage: {
            type: "Static<NumberArg>",
            optional: true,
            description: "Amount of slippage in BPS",
          },
        },
      },
    ];

    it("should get all actions", async () => {
      mock.onGet("/actions").reply(200, mockActions);

      const result = await client.getActions();

      expect(result).toEqual(mockActions);
    });
  });

  describe("getActionsBySlug", () => {
    const mockProtocolActions: ActionData[] = [
      {
        action: "route",
        inputs: {
          tokenIn: {
            type: "AddressArg",
            description: "Address of token to send",
          },
          tokenOut: {
            type: "AddressArg",
            description: "Address of token to receive",
          },
          amountIn: {
            type: "NumberArg",
            description: "The amount to deposit",
          },
          primaryAddress: {
            type: "AccountArg",
            optional: true,
            description: "The receiver account",
          },
          receiver: {
            type: "AddressArg",
            description: "Address of smart contract to interact with",
          },
          slippage: {
            type: "Static<NumberArg>",
            optional: true,
            description: "Amount of slippage in BPS",
          },
        },
      },
    ];

    it("should get actions by protocol slug", async () => {
      mock.onGet("/actions/uniswap").reply(200, mockProtocolActions);

      const result = await client.getActionsBySlug("uniswap");

      expect(result).toEqual(mockProtocolActions);
    });
  });

  describe("getNonTokenizedPositions", () => {
    const mockNonTokenizedPositions: PaginatedNonTokenizedPositionData = {
      data: [
        {
          chainId: 1,
          protocol: "aave",
          address: "0xPosition",
          primaryAddress: "0xPrimary",
          underlyingTokens: null,
        },
      ],
      meta: {
        total: 1,
        lastPage: 1,
        currentPage: 1,
        perPage: 1000,
        prev: null,
        next: null,
        cursor: 0,
      },
    };

    it("should get non-tokenized positions without params", async () => {
      mock.onGet("/nontokenized").reply(200, mockNonTokenizedPositions);

      const result = await client.getNonTokenizedPositions();

      expect(result).toEqual(mockNonTokenizedPositions);
    });

    it("should get non-tokenized positions with params", async () => {
      mock.onGet("/nontokenized").reply(200, mockNonTokenizedPositions);

      const params: NonTokenizedParams = {
        chainId: 1,
        page: 1,
        project: "aave",
        protocolSlug: "aave-v3",
      };

      await client.getNonTokenizedPositions(params);

      expect(mock.history.get[0].params).toEqual(params);
    });
  });

  describe("getProjects", () => {
    const mockProjects: Project[] = [
      {
        id: "bex",
        chains: [80094],
        protocols: ["bex", "bex-vaults"],
      },
      {
        id: "aave",
        chains: [1, 137, 42161, 10, 56, 8453, 43114, 324, 146, 100],
        protocols: ["aave-v3", "aave-static-atokens", "aave-v2"],
      },
    ];

    it("should get all projects", async () => {
      mock.onGet("/projects").reply(200, mockProjects);

      const result = await client.getProjects();

      expect(result).toEqual(mockProjects);
    });
  });

  describe("getProtocolsByProject", () => {
    const mockProtocolsByProject: ProtocolData[] = [
      {
        project: "aave",
        slug: "aave-v3",
        name: "Aave v3",
        description: "",
        url: "https://www.aave.org/",
        logosUri: ["https://icons.llama.fi/aave-v3.png"],
        chains: [
          { id: 1, name: "mainnet" },
          { id: 137, name: "polygon" },
          { id: 42161, name: "arbitrum" },
          { id: 10, name: "optimism" },
          { id: 56, name: "binance" },
          { id: 8453, name: "base" },
          { id: 43114, name: "avalanche" },
          { id: 324, name: "zksync" },
          { id: 146, name: "sonic" },
        ],
      },
      {
        project: "aave",
        slug: "aave-static-atokens",
        name: "Aave Static Atokens",
        description: "",
        url: "https://www.aave.org/",
        logosUri: ["https://icons.llama.fi/aave-v2.png"],
        chains: [
          { id: 1, name: "mainnet" },
          { id: 137, name: "polygon" },
          { id: 42161, name: "arbitrum" },
          { id: 10, name: "optimism" },
          { id: 56, name: "binance" },
          { id: 8453, name: "base" },
          { id: 43114, name: "avalanche" },
          { id: 100, name: "gnosis" },
          { id: 324, name: "zksync" },
        ],
      },
      {
        project: "aave",
        slug: "aave-v2",
        name: "Aave v2",
        description: "",
        url: "https://www.aave.org/",
        logosUri: ["https://icons.llama.fi/aave-v2.png"],
        chains: [
          { id: 1, name: "mainnet" },
          { id: 137, name: "polygon" },
        ],
      },
    ];

    it("should get protocols by project", async () => {
      mock.onGet("/projects/aave/protocols").reply(200, mockProtocolsByProject);

      const result = await client.getProtocolsByProject("aave");

      expect(result).toEqual(mockProtocolsByProject);
    });
  });

  describe("getNetworks", () => {
    const mockNetworks: Network[] = [
      {
        id: 1,
        name: "Ethereum",
      },
    ];

    it("should get networks without params", async () => {
      mock.onGet("/networks").reply(200, mockNetworks);

      const result = await client.getNetworks();

      expect(result).toEqual(mockNetworks);
    });

    it("should get networks with params", async () => {
      mock.onGet("/networks").reply(200, mockNetworks);

      const params: NetworkParams = {
        chainId: "1",
        name: "Ethereum",
      };

      await client.getNetworks(params);

      expect(mock.history.get[0].params).toEqual(params);
    });
  });

  describe("getAggregators", () => {
    const mockAggregators = ["uniswap", "sushiswap", "pancakeswap"];

    it("should get all aggregators", async () => {
      mock.onGet("/aggregators").reply(200, mockAggregators);

      const result = await client.getAggregators();

      expect(result).toEqual(mockAggregators);
    });
  });

  describe("getVolume", () => {
    const mockVolume = {
      totalUsdVolume: "1000000",
      totalTransactions: 5000,
    };

    it("should get volume for specific chain", async () => {
      mock.onGet("/volume/1").reply(200, mockVolume);

      const result = await client.getVolume(1);

      expect(result).toEqual(mockVolume);
    });
  });

  describe("Error Handling - Additional Methods", () => {
    it("should handle error in getStandards", async () => {
      mock.onGet("/standards").reply(500, { error: "Server Error" });

      await expect(client.getStandards()).rejects.toThrow(
        "API Error: Request failed with status code 500",
      );
    });

    it("should handle error in getStandardBySlug", async () => {
      mock.onGet("/standards/uniswap").reply(404, { error: "Not Found" });

      await expect(client.getStandardBySlug("uniswap")).rejects.toThrow(
        "API Error: Request failed with status code 404",
      );
    });

    it("should handle error in getActions", async () => {
      mock.onGet("/actions").reply(500, { error: "Server Error" });

      await expect(client.getActions()).rejects.toThrow(
        "API Error: Request failed with status code 500",
      );
    });

    it("should handle error in getNonTokenizedPositions", async () => {
      mock.onGet("/nontokenized").reply(500, { error: "Server Error" });

      await expect(client.getNonTokenizedPositions()).rejects.toThrow(
        "API Error: Request failed with status code 500",
      );
    });

    it("should handle error in getIporShortcut", async () => {
      mock
        .onPost("/shortcuts/static/ipor")
        .reply(400, { error: "Bad Request" });

      await expect(
        client.getIporShortcut(
          { fromAddress: "0xFrom" },
          {
            amountIn: "1000000",
            tokenIn: "0xToken",
            tokenBToBuy: "0xTokenB",
            percentageForTokenB: "5000",
          },
        ),
      ).rejects.toThrow("API Error: Request failed with status code 400");
    });
  });

  describe("Integration Tests - Complex Workflows", () => {
    it("should handle token to non-tokenized position workflow", async () => {
      // 1. Get token data
      mock.onGet("/tokens").reply(200, {
        data: [{ address: "0xToken", chainId: 1, type: "base", decimals: 18 }],
        meta: {
          total: 1,
          lastPage: 1,
          currentPage: 1,
          perPage: 1000,
          prev: null,
          next: null,
          cursor: 0,
        },
      });

      // 2. Get price data
      mock.onGet("/prices/1/0xToken").reply(200, {
        price: "3600",
        decimals: 18,
        symbol: "WETH",
        timestamp: 1699999999,
        confidence: 0.99,
        chainId: 1,
      });

      // 3. Get non-tokenized route
      mock.onGet("/shortcuts/route/nontokenized").reply(200, mockRouteData);

      // Execute workflow
      const tokens = await client.getTokenData({ chainId: 1 });
      const price = await client.getPriceData({
        chainId: 1,
        address: "0xToken",
      });
      const route = await client.getRouteNonTokenized({
        fromAddress: "0xFrom",
        tokenIn: ["0xToken"],
        positionOut: "0xPositionOut",
        amountIn: ["1000000"],
        receiver: "0xReceiver",
        chainId: 1,
        routingStrategy: "delegate",
      });

      expect(tokens).toBeDefined();
      expect(price).toBeDefined();
      expect(route).toBeDefined();
    });
  });
});
