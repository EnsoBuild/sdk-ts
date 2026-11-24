import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { EnsoClient } from "../src/client";
import { AssetOutputCategory } from "../src/types/v2";
import type {
  BundleDataV2,
  PositionReference,
  PositionRouteData,
  PositionRouteRequest,
} from "../src/types/v2";

const collection = "0x2222222222222222222222222222222222222222";
const owner = "0x1111111111111111111111111111111111111111";

describe("API v2", () => {
  let mock: MockAdapter;
  beforeEach(() => {
    mock = new MockAdapter(axios);
  });
  afterEach(() => mock.restore());

  test("position requests go to v2 with decimal NFT ids intact", async () => {
    const client = new EnsoClient({ apiKey: "local-fixture" });
    const body: PositionRouteRequest = {
      chainId: 1,
      fromAddress: owner,
      routingStrategy: "router",
      action: "depositclmm",
      position: {
        protocol: "uniswap-v3",
        collection,
        tokenId: "9007199254740993000",
      },
      assetsIn: [
        { address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", amount: "1" },
        { type: "erc721", address: collection, tokenId: "9007199254740993000" },
      ],
    };
    const response = {
      assetsOut: [],
      positions: [
        {
          chainId: 1,
          receipt: "erc721",
          protocol: "uniswap-v3",
          asset: {
            type: "erc721",
            address: collection,
            tokenId: "9007199254740993000",
          },
          owner: { before: owner, after: owner },
          measurements: [
            { metric: "liquidity", before: "100", after: "135", delta: "35" },
          ],
        },
      ],
    };
    mock
      .onPost("https://api.enso.build/api/v2/shortcuts/route/position")
      .reply(200, response);
    expect(await client.getPositionRouteV2(body)).toEqual(response);
    expect(JSON.parse(mock.history.post[0].data)).toEqual(body);
  });

  test("v2 bundles keep the v1 body and query beside a custom v1 base URL", async () => {
    const client = new EnsoClient({
      apiKey: "local-fixture",
      baseURL: "http://127.0.0.1:3000/api/v1",
    });
    const response = {
      assetsOut: [],
      positions: [],
    } as unknown as BundleDataV2;
    mock
      .onPost("http://127.0.0.1:3000/api/v2/shortcuts/bundle")
      .reply(200, response);
    const actions = [
      {
        protocol: "enso",
        action: "route",
        args: {
          tokenIn: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          tokenOut: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          amountIn: "1000000",
        },
      },
    ] as Parameters<EnsoClient["getBundleDataV2"]>[1];
    await client.getBundleDataV2(
      {
        chainId: 1,
        fromAddress: owner,
        routingStrategy: "delegate",
        includeActionOutputs: true,
      },
      actions,
    );
    expect(mock.history.post[0].params).toMatchObject({
      includeActionOutputs: true,
    });
    expect(JSON.parse(mock.history.post[0].data)).toEqual(actions);
  });

  test("a position is a listed market, a held NFT or a new range", () => {
    const valid: PositionReference[] = [
      { protocol: "morpho-markets-v1", positionId: "0xmarket" },
      { positionId: "0xmarket" },
      {
        protocol: "alchemix-vaults-v3",
        positionId: "0xalchemist",
        tokenId: "271",
      },
      { protocol: "uniswap-v3", collection, tokenId: "7" },
      { protocol: "uniswap-v3", collection, poolAddress: owner },
    ];
    const both = {
      protocol: "uniswap-v3",
      collection,
      tokenId: "7",
      poolAddress: owner,
    } as const;
    // @ts-expect-error a held id never sits beside a pool to create
    const heldWithPool: PositionReference = both;
    const bare = { protocol: "uniswap-v3" } as const;
    // @ts-expect-error a position needs a market or a collection
    const nothing: PositionReference = bare;
    expect([...valid, heldWithPool, nothing]).toHaveLength(7);
  });

  test("a redeem request sends its swap options and reads its claim and payout", async () => {
    const client = new EnsoClient({ apiKey: "local-fixture" });
    const queue = "0x3333333333333333333333333333333333333333";
    const body: PositionRouteRequest = {
      chainId: 1,
      fromAddress: owner,
      routingStrategy: "router",
      action: "requestredeem",
      position: { positionId: "0xteller" },
      assetsIn: [{ address: collection, amount: "1000" }],
      tokensOut: [owner],
      slippage: "30",
      referralCode: "ref",
      ignoreAggregators: ["paraswap"],
    };
    const response = {
      assetsOut: [
        {
          chainId: 1,
          type: "erc721",
          address: queue,
          tokenId: "12",
          recipient: owner,
          category: AssetOutputCategory.Claim,
        },
      ],
      positions: [],
      asyncRedeem: { estimatedAmountOut: "990" },
    };
    mock
      .onPost("https://api.enso.build/api/v2/shortcuts/route/position")
      .reply(200, response);
    const quote: PositionRouteData = await client.getPositionRouteV2(body);
    expect(JSON.parse(mock.history.post[0].data)).toEqual(body);
    expect(quote.assetsOut[0].category).toBe("claim");
    expect(quote.assetsOut[0].category === "claim").toBe(true);
    expect(quote.asyncRedeem).toEqual({ estimatedAmountOut: "990" });
  });

  test("custom non-/v1 baseURL requires explicit v2BaseURL for v2 calls", async () => {
    const gatewayClient = new EnsoClient({
      apiKey: "local-fixture",
      baseURL: "https://gw.example.com/enso",
    });
    await expect(
      gatewayClient.getBundleDataV2(
        { chainId: 1, fromAddress: owner, routingStrategy: "router" },
        [],
      ),
    ).rejects.toThrow(/v2BaseURL/);

    const explicitClient = new EnsoClient({
      apiKey: "local-fixture",
      baseURL: "https://gw.example.com/enso",
      v2BaseURL: "https://gw.example.com/enso-v2",
    });
    const response = {
      assetsOut: [],
      positions: [
        {
          chainId: 1,
          receipt: "erc721",
          coverage: { assetsIn: "notMeasured" },
        },
      ],
    } as unknown as BundleDataV2;
    mock
      .onPost("https://gw.example.com/enso-v2/shortcuts/bundle")
      .reply(200, response);
    const out = await explicitClient.getBundleDataV2(
      { chainId: 1, fromAddress: owner, routingStrategy: "router" },
      [
        {
          protocol: "uniswap-v3",
          action: "depositclmm",
          args: {
            tokenIn: [collection],
            tokenOut: collection,
            amountIn: ["100"],
            tokenId: "7",
          },
        },
        {
          protocol: "boring-vault",
          action: "requestredeem",
          args: {
            tokenIn: collection,
            tokenOut: owner,
            amountIn: "100",
            primaryAddress: collection,
          },
        },
      ],
    );
    expect(out.positions[0].coverage?.assetsIn === "notMeasured").toBe(true);
  });
});
