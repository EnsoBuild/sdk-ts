import {
  Address,
  BridgeStatusData,
  BundleData,
  EnsoClient,
  NonTokenizedRouteData,
  PriceData,
  RouteData,
  UserOperation,
} from "../src";

const address = "0x0000000000000000000000000000000000000001" as Address;

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

// fixtures are trimmed live api responses
describe("response types", () => {
  it("types detailedRoute as route segments", () => {
    const detailedRoute = [
      {
        tokensIn: [address],
        weights: [["1000000000000000000"]],
        paths: [
          [
            {
              action: "encodedswap",
              protocol: "bebop",
              primaryAddress: address,
              tokenIn: [address],
              tokenOut: [address],
              args: { to: address, pointers: ["0", "32"], sources: ["🦙"] },
            },
          ],
        ],
      },
    ] satisfies RouteData["detailedRoute"];

    expect(detailedRoute[0].paths[0][0].protocol).toBe("bebop");
  });

  it("types price data without confidence", () => {
    const price = {
      decimals: 18,
      symbol: "WETH",
      price: 2240.9992802074316,
      timestamp: 1794049771066,
      chainId: 1,
      address,
      name: "WETH",
    } satisfies PriceData;

    expect(price.name).toBe("WETH");
  });

  it("types /protocols entries with projectId", () => {
    const protocols = [
      {
        slug: "aave-v4",
        projectId: "aave",
        url: "https://app.aave.com/",
        logosUri: ["https://icons.llamao.fi/icons/protocols/aave-v4"],
        description: "",
        name: "Aave V4",
        chains: [
          { id: 1, name: "mainnet", displayName: "Ethereum" },
          { id: 5042, name: "arc", displayName: null },
        ],
      },
    ] satisfies Awaited<ReturnType<EnsoClient["getProtocolData"]>>;

    expect(protocols[0].projectId).toBe("aave");
  });

  it("types arbitrum-native retryable ticket fields", () => {
    const status = {
      sourceChainId: 1,
      sourceTxHash:
        "0x1c9b58d69e3659de7bc939f623bb23dd3f1d091733e13cdaeee4378c8ce811c7",
      status: "inflight",
      destinationChainId: 42161,
      retryableTicketId:
        "0xe45dd652dcb73158df64ba755fa08d44117d36b9ad6e418223febffe53acfc67",
    } satisfies BridgeStatusData;

    expect(status.retryableTicketId).toBeDefined();
  });

  it("types userOp as an optional UserOperation", () => {
    const checks = [
      true satisfies Equal<BundleData["userOp"], UserOperation | undefined>,
      true satisfies Equal<RouteData["userOp"], UserOperation | undefined>,
      true satisfies Equal<
        NonTokenizedRouteData["userOp"],
        UserOperation | undefined
      >,
    ];

    expect(checks).toEqual([true, true, true]);
  });
});
