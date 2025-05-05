import { EnsoClient } from "../src";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { Address } from "../src/types";

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
    const approveParams = {
      fromAddress: "0xFrom" as Address,
      tokenAddress: "0xToken" as Address,
      chainId: 1,
      amount: "1000000",
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
        routingStrategy: "delegate",
      });

      expect(mock.history.get[0].params.routingStrategy).toBe("delegate");
    });

    it("should handle API errors gracefully", async () => {
      mock.onGet("/wallet/approve").reply(500, { error: "Server Error" });

      await expect(client.getApprovalData(approveParams)).rejects.toThrow(
        "API Request failed",
      );
    });
  });

  describe("getRouteData", () => {
    const routeParams = {
      fromAddress: "0xFrom" as Address,
      receiver: "0xReceiver" as Address,
      spender: "0xSpender" as Address,
      chainId: 1,
      amountIn: ["1000000"],
      tokenIn: ["0xTokenIn"] as Address[],
      tokenOut: ["0xTokenOut"] as Address[],
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
    const bundleParams = {
      chainId: 1,
      fromAddress: "0xFrom" as Address,
    };

    const bundleActions = [
      {
        protocol: "enso",
        action: "route",
        args: {
          tokenIn: "0xTokenIn",
          tokenOut: "0xTokenOut",
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

    it("should use default routing strategy for bundle", async () => {
      mock.onPost("/shortcuts/bundle").reply(200, mockBundleData);

      await client.getBundleData(bundleParams, bundleActions);

      expect(mock.history.post[0].params.routingStrategy).toBe("router");
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
        amount: "1000000",
      });

      const route = await client.getRouteData({
        fromAddress: "0xFrom",
        receiver: "0xReceiver",
        spender: "0xSpender",
        chainId: 1,
        amountIn: ["1000000"],
        tokenIn: ["0xToken"],
        tokenOut: ["0xTokenOut"],
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
          amount: "1000000",
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
          amount: "1000000",
        }),
      ).rejects.toThrow();
    });
  });

  describe("Edge Cases", () => {
    it("should handle large numbers correctly", async () => {
      const largeAmount = "1000000000000000000000000";
      const approveParams = {
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
      const multiTokenParams = {
        fromAddress: "0xFrom" as Address,
        receiver: "0xReceiver" as Address,
        spender: "0xSpender" as Address,
        chainId: 1,
        amountIn: ["1000000", "2000000"],
        tokenIn: ["0xToken1" as Address, "0xToken2" as Address],
        tokenOut: ["0xTokenOut1" as Address, "0xTokenOut2" as Address],
      };

      mock.onGet("/shortcuts/route").reply(200, mockRouteData);

      await client.getRouteData(multiTokenParams);

      expect(mock.history.get[0].params.tokenIn).toEqual([
        "0xToken1",
        "0xToken2",
      ]);
    });
  });
});
