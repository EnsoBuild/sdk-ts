import { Address, EnsoClient, RouteParams } from "../src";

type GetRouteParams = Parameters<EnsoClient["getRouteData"]>[0];

const address = "0x0000000000000000000000000000000000000001" as Address;

describe("route params types", () => {
  it("accepts Base58 receiver and mint for Solana destinations", () => {
    const params = {
      fromAddress: address,
      refundReceiver: address,
      chainId: 1,
      destinationChainId: 1861167595,
      amountIn: ["100000000"],
      tokenIn: [address],
      tokenOut: ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"],
      receiver: "7cVfgArCheMR6Cs4t6vz5rfnqd56vZq4ndaBrY5xkxXy",
      slippage: "100",
      routingStrategy: "router",
    } satisfies GetRouteParams;

    expect(params.destinationChainId).toBe(1861167595);
  });

  it("keeps 0x addresses required for EVM destinations", () => {
    const params: RouteParams = {
      fromAddress: address,
      chainId: 1,
      destinationChainId: 8453,
      amountIn: ["100000000"],
      tokenIn: [address],
      tokenOut: [address],
      // @ts-expect-error EVM routes take 0x receivers.
      receiver: "7cVfgArCheMR6Cs4t6vz5rfnqd56vZq4ndaBrY5xkxXy",
      routingStrategy: "router",
    };

    expect(params.chainId).toBe(1);
  });
});
