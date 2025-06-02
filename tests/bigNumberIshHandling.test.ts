import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { EnsoClient } from "../src";
import { Address, ApproveData, ApproveParams, Transaction } from "../src/types/types";

describe("BigNumberIsh Handling", () => {
  let client: EnsoClient;
  let mock: MockAdapter;

  // Mock response data
  const mockApproveData: ApproveData = {
    amount: "1000000000000000000",
    gas: "50000",
    spender: "0xSpenderAddress" as Address,
    token: "0xTokenAddress" as Address,
    tx: {
      data: "0xapprove",
      to: "0xTokenAddress" as Address,
      from: "0xFrom" as Address,
      value: "0",
    } as Transaction,
  };

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

  it("should handle string numeric values", async () => {
    mock.onGet("/wallet/approve").reply(200, mockApproveData);

    const approveParams: ApproveParams = {
      fromAddress: "0xFrom" as Address,
      tokenAddress: "0xToken" as Address,
      chainId: 1,
      amount: "1000000000000000000000000", // Very large string number
      // routingStrategy: "router",
    };

    await client.getApprovalData(approveParams);

    expect(mock.history.get[0].params.amount).toBe("1000000000000000000000000");
  });

  it("should handle number values within safe integer range", async () => {
    mock.onGet("/wallet/approve").reply(200, mockApproveData);

    const safeNumber = 123456789;
    const approveParams: ApproveParams = {
      fromAddress: "0xFrom" as Address,
      tokenAddress: "0xToken" as Address,
      chainId: 1,
      amount: safeNumber,
      // routingStrategy: "router",
    };

    await client.getApprovalData(approveParams);

    expect(mock.history.get[0].params.amount).toBe(safeNumber);
  });

  it("should handle values exceeding JavaScript number precision", async () => {
    mock.onGet("/wallet/approve").reply(200, mockApproveData);

    // This exceeds Number.MAX_SAFE_INTEGER
    const largeNumber = "9007199254740993"; // 2^53 + 1
    const approveParams: ApproveParams = {
      fromAddress: "0xFrom" as Address,
      tokenAddress: "0xToken" as Address,
      chainId: 1,
      amount: largeNumber,
    };

    await client.getApprovalData(approveParams);

    expect(mock.history.get[0].params.amount).toBe(largeNumber);
  });

  it("should handle all BigNumberIsh formats in the same test", async () => {
    mock.onGet("/wallet/approve").reply((config) => {
      // Return the amount that was sent in the request
      return [
        200,
        {
          ...mockApproveData,
          amount: config.params.amount.toString(),
        },
      ];
    });

    // Test with string
    const result1 = await client.getApprovalData({
      fromAddress: "0xFrom" as Address,
      tokenAddress: "0xToken" as Address,
      chainId: 1,
      amount: "1000000000000000000", // String format
    });

    // Test with number
    const result2 = await client.getApprovalData({
      fromAddress: "0xFrom" as Address,
      tokenAddress: "0xToken" as Address,
      chainId: 1,
      amount: 1000000000, // Number format
    });

    // Verify all request results
    expect(result1.amount).toBe("1000000000000000000");
    expect(result2.amount).toBe("1000000000");
    expect(mock.history.get.length).toBe(2);
  });

  it("should handle all BigNumberIsh formats in RouteParams", async () => {
    const mockRouteData = {
      route: [
        {
          action: "swap",
          protocol: "uniswap-v2",
          tokenIn: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"],
          tokenOut: ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"],
          primary: "0xPrimary" as Address,
          internalRoutes: [],
          args: {},
        },
      ],
      gas: "150000",
      amountOut: "1000000000000000000",
      priceImpact: "10",
      createdAt: 123456,
      tx: {
        data: "0x123456",
        to: "0xAddress" as Address,
        from: "0xFrom" as Address,
        value: "0",
      },
      feeAmount: ["1000000"],
    };

    mock.onGet("/shortcuts/route").reply(200, mockRouteData);

    // Test with string in amountIn array
    await client.getRouteData({
      fromAddress: "0xFrom" as Address,
      chainId: 1,
      amountIn: ["1000000000000000000"],
      tokenIn: ["0xToken1"] as Address[],
      tokenOut: ["0xToken2"] as Address[],
      routingStrategy: "router",
      slippage: "50", // String slippage
    });

    // Test with number in amountIn and slippage
    await client.getRouteData({
      fromAddress: "0xFrom" as Address,
      chainId: 1,
      amountIn: [1000000000],
      tokenIn: ["0xToken1"] as Address[],
      tokenOut: ["0xToken2"] as Address[],
      routingStrategy: "router",
      slippage: 50, // Number slippage
    });

    expect(mock.history.get.length).toBe(2);
  });

  it("should handle mixed BigNumberIsh formats in complex parameters", async () => {
    const mockBundleData = {
      bundle: [],
      gas: "300000",
      createdAt: 123456,
      tx: {
        data: "0xbundledata",
        to: "0xTo" as Address,
        from: "0xFrom" as Address,
        value: "0",
      },
      amountsOut: {},
    };

    mock.onPost("/shortcuts/bundle").reply(200, mockBundleData);

    await client.getBundleData(
      {
        chainId: 1,
        fromAddress: "0xFrom" as Address,
        routingStrategy: "router",
      },
      [
        {
          protocol: "enso",
          action: "route",
          args: {
            tokenIn: "0xTokenIn" as Address,
            tokenOut: "0xTokenOut" as Address,
            amountIn: "1000000", // String
            slippage: 50, // Number
          },
        },
        {
          protocol: "enso",
          action: "route",
          args: {
            tokenIn: "0xTokenIn" as Address,
            tokenOut: "0xTokenOut" as Address,
            amountIn: "1000000", // String
            slippage: "50", // Number
          },
        },
      ],
    );

    expect(mock.history.post.length).toBe(1);
    // Verify the actions were properly serialized in the request
    const requestBody = JSON.parse(mock.history.post[0].data);
    expect(requestBody.length).toBe(2);
    expect(requestBody[0].args.amountIn).toBe("1000000");
    expect(requestBody[0].args.slippage).toBe(50);
  });

  it("should validate BigNumberIsh handling across all endpoints", async () => {
    // Setup mocks for different endpoints
    mock.onGet("/wallet/approve").reply(200, mockApproveData);
    mock.onGet("/shortcuts/route").reply(200, {
      route: [],
      gas: "150000",
      amountOut: "1000000000000000000",
      priceImpact: null,
      createdAt: 123456,
      tx: {
        data: "0x123",
        to: "0xTo" as Address,
        from: "0xFrom" as Address,
        value: "0",
      },
      feeAmount: [],
    });

    // Test with string amounts
    await client.getApprovalData({
      fromAddress: "0xFrom" as Address,
      tokenAddress: "0xToken" as Address,
      chainId: 1,
      amount: "1000000000000000000",
    });

    // Test with number amounts
    await client.getRouteData({
      fromAddress: "0xFrom" as Address,
      chainId: 1,
      amountIn: [500000000],
      tokenIn: ["0xToken1"] as Address[],
      tokenOut: ["0xToken2"] as Address[],
      routingStrategy: "router",
      slippage: 50,
    });

    expect(mock.history.get.length).toBe(2);
  });
});
