import { Address, BundleAction } from "../src";

const address = "0x0000000000000000000000000000000000000001" as Address;
const positionId =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as const;

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
        protocol: "stargate",
        action: "bridge",
        args: {
          tokenIn: address,
          amountIn: "100",
          primaryAddress: address,
          destinationChainId: 8453,
          receiver: address,
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
        protocol: "cctp",
        action: "bridge",
        args: {
          tokenIn: address,
          amountIn: "100",
          primaryAddress: address,
          destinationChainId: 8453,
          receiver: address,
          protocolArgs: {
            transferType: "standard",
            forwardFee: "med",
          },
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
        protocol: "aave-v3",
        action: "repay",
        args: {
          tokenIn: address,
          amountIn: "100",
          primaryAddress: address,
          onBehalfOf: address,
          positionId,
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
          positionId,
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
          abi: "function balanceOf(address) view returns (uint256)",
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
        protocol: "math",
        action: "add",
        args: {
          amountA: "1",
          amountB: { useOutputOfCallAt: 2 },
        },
      },
      {
        protocol: "helpers",
        action: "isequalorlessthan",
        args: {
          amountA: "1",
          amountB: "2",
        },
      },
      {
        protocol: "helpers",
        action: "not",
        args: {
          condition: { useOutputOfCallAt: 4 },
        },
      },
      {
        protocol: "helpers",
        action: "check",
        args: {
          condition: true,
        },
      },
      {
        protocol: "helpers",
        action: "toggle",
        args: {
          condition: { useOutputOfCallAt: 0 },
          amountA: "1",
          amountB: "0",
        },
      },
    ] satisfies BundleAction[];

    expect(actions).toHaveLength(30);
  });

  it("rejects invalid route and helper action shapes", () => {
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

    // @ts-expect-error math actions require the math protocol.
    const mathWithEnsoProtocol: BundleAction = {
      protocol: "enso",
      action: "add",
      args: { amountA: "1", amountB: "2" },
    };

    // @ts-expect-error comparison actions require the helpers protocol.
    const comparisonWithEnsoProtocol: BundleAction = {
      protocol: "enso",
      action: "isequal",
      args: { amountA: "1", amountB: "2" },
    };

    void routeWithoutReceiver;
    void mathWithEnsoProtocol;
    void comparisonWithEnsoProtocol;
    expect(true).toBe(true);
  });
});
