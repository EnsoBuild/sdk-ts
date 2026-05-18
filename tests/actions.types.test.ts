import { Address, BundleAction } from "../src";

const address = "0x0000000000000000000000000000000000000001" as Address;

describe("BundleAction types", () => {
  it("accepts representative standards and Enso action families", () => {
    const actions = [
      {
        protocol: "erc20",
        action: "approve",
        args: {
          token: address,
          spender: address,
          amount: "100",
        },
      },
      {
        protocol: "aave-v3",
        action: "borrow",
        args: {
          tokenOut: address,
          amountOut: "100",
          primaryAddress: address,
          receiver: address,
          onBehalfOf: address,
          args: { market: "stable" },
        },
      },
      {
        protocol: "erc721-lending",
        action: "nftborrow",
        args: {
          tokenOut: address,
          amountOut: { useOutputOfCallAt: 1 },
          primaryAddress: address,
          tokenId: "1",
        },
      },
      {
        protocol: "stargate",
        action: "bridge",
        args: {
          tokenIn: address,
          amountIn: "100",
          primaryAddress: address,
          destinationChainId: 8453,
          receiver: address,
          callbackValue: "100",
          callback: [
            {
              protocol: "enso",
              action: "balance",
              args: { token: address },
            },
          ],
        },
      },
      {
        protocol: "vault",
        action: "singledeposit",
        args: {
          tokenIn: address,
          tokenOut: address,
          amountIn: "100",
          primaryAddress: address,
          receiver: address,
          onBehalfOf: address,
          args: { referral: "enso" },
        },
      },
      {
        protocol: "uniswap-v3",
        action: "depositclmm",
        args: {
          tokenIn: [address, address],
          tokenOut: address,
          amountIn: ["100", { useOutputOfCallAt: 0 }],
          ticks: ["-887220", "887220"],
          tickSpacing: "60",
          hook: address,
        },
      },
      {
        protocol: "erc721-vault",
        action: "nftdeposit",
        args: {
          tokenIn: address,
          amountIn: "1",
          primaryAddress: address,
          tokenId: "1",
        },
      },
      {
        protocol: "uniswap-v3",
        action: "swap",
        args: {
          tokenIn: address,
          tokenOut: address,
          amountIn: "100",
          primaryAddress: address,
          receiver: address,
          tickSpacing: "60",
          hooks: address,
          path: [address],
        },
      },
      {
        protocol: "rewards",
        action: "harvest",
        args: {
          token: address,
          primaryAddress: address,
        },
      },
      {
        protocol: "permit2",
        action: "permittransferfrom",
        args: {
          token: [address, address],
          amount: ["100", "200"],
          sender: address,
          receiver: address,
          nonce: "1",
          deadline: "9999999999",
          signature:
            "0x0000000000000000000000000000000000000000000000000000000000000000",
        },
      },
      {
        protocol: "vault",
        action: "singleredeem",
        args: {
          tokenIn: address,
          tokenOut: address,
          amountIn: "100",
          primaryAddress: address,
          receiver: address,
          onBehalfOf: address,
        },
      },
      {
        protocol: "uniswap-v3",
        action: "redeemclmm",
        args: {
          tokenIn: address,
          tokenOut: [address, address],
          tokenId: "1",
          liquidity: "100",
        },
      },
      {
        protocol: "erc721-vault",
        action: "nftredeem",
        args: {
          tokenIn: address,
          tokenOut: address,
          amountIn: "1",
          primaryAddress: address,
          tokenId: "1",
        },
      },
      {
        protocol: "aave-v3",
        action: "repaywithpositionid",
        args: {
          tokenIn: address,
          amountIn: "100",
          primaryAddress: address,
          onBehalfOf: address,
          positionId:
            "0x0000000000000000000000000000000000000000000000000000000000000000",
        },
      },
      {
        protocol: "erc721-lending",
        action: "nftrepay",
        args: {
          tokenIn: address,
          amountIn: "100",
          primaryAddress: address,
          tokenId: "1",
        },
      },
      {
        protocol: "erc20",
        action: "transfer",
        args: {
          token: address,
          amount: "100",
          receiver: address,
        },
      },
      {
        protocol: "erc20",
        action: "transferfrom",
        args: {
          token: address,
          amount: "100",
          sender: address,
          receiver: address,
        },
      },
      {
        protocol: "aave-v3",
        action: "flashloan",
        args: {
          flashloanToken: address,
          flashloanAmount: "100",
          tokenOut: address,
          callback: [
            {
              protocol: "enso",
              action: "balance",
              args: { token: address, estimate: "100", account: address },
            },
          ],
        },
      },
      {
        protocol: "morpho-markets-v1",
        action: "singlewithdrawwithpositionid",
        args: {
          tokenOut: address,
          amountOut: "100",
          primaryAddress: address,
          positionId:
            "0x0000000000000000000000000000000000000000000000000000000000000000",
        },
      },
      {
        protocol: "morpho-markets-v1",
        action: "multiwithdraw",
        args: {
          tokenOut: [address, address],
          amountOut: ["100", "200"],
          primaryAddress: address,
        },
      },
      {
        protocol: "enso",
        action: "route",
        args: {
          tokenIn: address,
          tokenOut: address,
          amountIn: "100",
          destinationChainId: 8453,
          receiver: address,
          refundReceiver: address,
          ignoreBridges: ["stargate"],
        },
      },
      {
        protocol: "enso",
        action: "call",
        args: {
          address,
          method: "balanceOf",
          args: [address],
        },
      },
      {
        protocol: "enso",
        action: "split",
        args: {
          tokenIn: address,
          tokenOut: [address, address],
          amountIn: "100",
          receiver: address,
        },
      },
      {
        protocol: "enso",
        action: "merge",
        args: {
          tokenIn: [address, address],
          tokenOut: address,
          amountIn: ["50", "50"],
        },
      },
      {
        protocol: "enso",
        action: "minamountout",
        args: {
          amountOut: { useOutputOfCallAt: 3 },
          minAmountOut: "95",
        },
      },
      {
        protocol: "enso",
        action: "slippage",
        args: {
          amountOut: { useOutputOfCallAt: 3 },
          bps: "50",
        },
      },
      {
        protocol: "enso",
        action: "fee",
        args: {
          token: address,
          amount: "100",
          bps: "10",
          receiver: address,
        },
      },
      {
        protocol: "enso",
        action: "ensofee",
        args: {
          token: address,
          amount: "100",
          bps: "10",
        },
      },
      {
        protocol: "enso",
        action: "add",
        args: {
          amountA: "1",
          amountB: { useOutputOfCallAt: 2 },
        },
      },
      {
        protocol: "enso",
        action: "isequalorlessthan",
        args: {
          amountA: "1",
          amountB: "2",
        },
      },
      {
        protocol: "enso",
        action: "not",
        args: {
          condition: { useOutputOfCallAt: 4 },
        },
      },
      {
        protocol: "enso",
        action: "check",
        args: {
          condition: true,
        },
      },
      {
        protocol: "enso",
        action: "toggle",
        args: {
          condition: { useOutputOfCallAt: 0 },
          amountA: "1",
          amountB: "0",
        },
      },
    ] satisfies BundleAction[];

    expect(actions).toHaveLength(33);
  });

  it("rejects invalid cross-chain route and bridge action shapes", () => {
    const routeWithoutReceiver: BundleAction = {
      protocol: "enso",
      action: "route",
      // @ts-expect-error cross-chain route actions require receiver.
      args: {
        tokenIn: address,
        tokenOut: address,
        amountIn: "100",
        destinationChainId: 8453,
      },
    };

    // @ts-expect-error bridge actions only accept supported bridge protocols.
    const bridgeWithUnsupportedProtocol: BundleAction = {
      protocol: "unknown-bridge",
      action: "bridge",
      args: {
        tokenIn: address,
        amountIn: "100",
        primaryAddress: address,
        destinationChainId: 8453,
        receiver: address,
      },
    };

    void routeWithoutReceiver;
    void bridgeWithUnsupportedProtocol;
    expect(true).toBe(true);
  });
});
