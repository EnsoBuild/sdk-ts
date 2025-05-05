import { EnsoClient } from "../src";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { Address, BundleAction } from "../src/types";

// Mock server for integration tests
const server = setupServer(
  // Route endpoints
  http.get("https://api.enso.finance/api/v1/shortcuts/route", ({ request }) => {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);

    // Validate required params
    if (!params.fromAddress || !params.tokenIn || !params.tokenOut) {
      return new HttpResponse(null, { status: 400 });
    }

    return HttpResponse.json({
      route: [],
      gas: "150000",
      amountOut: "1000000000000000000",
      priceImpact: null,
      createdAt: 123456,
      tx: {
        data: "0x123",
        to: "0xTo",
        from: params.fromAddress,
        value: "0",
      },
      feeAmount: [],
    });
  }),

  // Approval endpoint
  http.get("https://api.enso.finance/api/v1/wallet/approve", ({ request }) => {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);

    if (!params.fromAddress || !params.tokenAddress || !params.amount) {
      return new HttpResponse(null, { status: 400 });
    }

    return HttpResponse.json({
      amount: params.amount,
      gas: "50000",
      spender: "0xSpender",
      token: params.tokenAddress,
      tx: {
        data: "0xapprove",
        to: params.tokenAddress,
        from: params.fromAddress,
        value: "0",
      },
    });
  }),

  // Bundle endpoint
  http.post(
    "https://api.enso.finance/api/v1/shortcuts/bundle",
    async ({ request }) => {
      const url = new URL(request.url);
      const params = Object.fromEntries(url.searchParams);
      const body = await request.json();

      if (!params.fromAddress || !body || !Array.isArray(body)) {
        return new HttpResponse(null, { status: 400 });
      }

      return HttpResponse.json({
        bundle: body,
        gas: "300000",
        createdAt: 123456,
        tx: {
          data: "0xbundle",
          to: "0xBundleAddress",
          from: params.fromAddress,
          value: "0",
        },
      });
    },
  ),
);

describe("EnsoClient Integration Tests", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("should execute a complete swap workflow", async () => {
    const client = new EnsoClient({
      apiKey: "test-key",
      baseURL: "https://api.enso.finance/api/v1",
    });

    const fromAddress = "0x123456789abcdef123456789abcdef1234567890";
    const tokenIn = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
    const tokenOut = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // WETH
    const amount = "1000000000"; // 1000 USDC

    // Step 1: Get approval
    const approval = await client.getApprovalData({
      fromAddress,
      tokenAddress: tokenIn,
      chainId: 1,
      amount,
    });

    expect(approval.spender).toBeDefined();
    expect(approval.tx.data).toBeDefined();

    // Step 2: Get route
    const route = await client.getRouteData({
      fromAddress,
      receiver: fromAddress,
      spender: approval.spender,
      chainId: 1,
      amountIn: [amount],
      tokenIn: [tokenIn],
      tokenOut: [tokenOut],
      slippage: 300, // 3%
    });

    expect(route.amountOut).toBeDefined();
    expect(route.tx.data).toBeDefined();
    expect(parseFloat(route.amountOut)).toBeGreaterThan(0);
  });

  it("should handle bundle transactions correctly", async () => {
    const client = new EnsoClient({
      apiKey: "test-key",
      baseURL: "https://api.enso.finance/api/v1",
    });

    const fromAddress = "0x123456789abcdef123456789abcdef1234567890";

    const actions: BundleAction[] = [
      {
        protocol: "uniswap-v2",
        action: "swap",
        args: {
          tokenIn: "0xToken1" as Address,
          tokenOut: "0xToken2" as Address,
          primaryAddress: "0xPrimary" as Address,
          amountIn: "1000000",
          slippage: "300",
        },
      },
      {
        protocol: "aave-v2",
        action: "deposit",
        args: {
          tokenIn: "0xToken2" as Address,
          tokenOut: "0xAToken2" as Address,
          amountIn: { useOutputOfCallAt: 0 },
          primaryAddress: "0xAavePool" as Address,
        },
      },
    ];

    const bundle = await client.getBundleData(
      {
        chainId: 1,
        fromAddress,
        routingStrategy: "delegate",
      },
      actions,
    );

    expect(bundle.bundle).toEqual(actions);
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.gas).toBeDefined();
  });

  it("should handle API errors gracefully", async () => {
    const client = new EnsoClient({
      apiKey: "test-key",
      baseURL: "https://api.enso.finance/api/v1",
    });

    // Create a temporary handler that returns 500
    server.use(
      http.get("https://api.enso.finance/api/v1/wallet/approve", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    await expect(
      client.getApprovalData({
        fromAddress: "0x123",
        tokenAddress: "0x456",
        chainId: 1,
        amount: "1000",
      }),
    ).rejects.toThrow("API Request failed");
  });
});
