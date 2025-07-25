import { Address, EnsoClient } from "../src";

describe("Custom Deposit Function Call", () => {
  const client = new EnsoClient({
    apiKey: "56b3d1f4-5c59-4fc1-8998-16d001e277bc",
  });
  beforeAll(() => {});
  it("should route and do custom deposit call", async () => {
    const USDT = "0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb";
    const STAKED_HYPE = "0xffaa4a3d97fe9107cef8a3f48c069f577ff76cc1";
    const HYPE_DEPOSITOR = "0x6e358dd1204c3fb1D24e569DF0899f48faBE5337";
    const SENDER = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";

    const bundle = await client.getBundleData(
      {
        chainId: 999,
        fromAddress: SENDER,
        routingStrategy: "router",
        receiver: SENDER,
      },
      [
        {
          protocol: "enso",
          action: "route",
          args: {
            tokenIn: USDT,
            tokenOut: STAKED_HYPE,
            amountIn: "100000000",
          },
        },
        {
          protocol: "enso",
          action: "call",
          args: {
            address: HYPE_DEPOSITOR,
            args: [
              STAKED_HYPE,
              { useOutputOfCallAt: 0 },
              "100000",
              SENDER,
              "0x",
            ],
            method: "deposit",
            abi: "function deposit(address depositAsset, uint256 depositAmount, uint256 minimumMint, address to, bytes communityCode) external returns (uint256 shares)",
          },
        },
      ],
    );
    console.log(JSON.stringify(bundle, null, 2));
  });
});
