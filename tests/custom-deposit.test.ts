import { Address, EnsoClient } from "../src";

describe("Custom Deposit Function Call", () => {
  const client = new EnsoClient({
    apiKey: "56b3d1f4-5c59-4fc1-8998-16d001e277bc",
  });
  const USDT = "0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb";

  const STAKED_HYPE = "0xffaa4a3d97fe9107cef8a3f48c069f577ff76cc1";
  const HYPE_DEPOSITOR = "0x6e358dd1204c3fb1D24e569DF0899f48faBE5337";
  const LOOPED_HYPE = "0x5748ae796AE46A4F1348a1693de4b50560485562";

  const SENDER = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
  const ENSO_SHORTCUTS = "0x4Fe93ebC4Ce6Ae4f81601cC7Ce7139023919E003";

  describe("Smart Wallet", () => {
    it("Smart Wallet deposits to LOOPED_HYPE with custom community code and dynamic token amount", async () => {
      /*
          enso.route(USDT, STAKED_HYPE) | 
          enso.call(HYPE_DEPOSITOR.deposit(STAKED_HYPE, callAt(0), 0, SENDER, "0x1234"))
     */
      const bundle = await client.getBundleData(
        {
          chainId: 999,
          fromAddress: SENDER,
          routingStrategy: "delegate",
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
            protocol: "erc20",
            action: "approve",
            args: {
              amount: { useOutputOfCallAt: 0 },
              spender: HYPE_DEPOSITOR,
              token: STAKED_HYPE,
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
                0,
                SENDER,
                "0x1234",
              ],
              method: "deposit",
              abi: "function deposit(address depositAsset, uint256 depositAmount, uint256 minimumMint, address to, bytes communityCode) external returns (uint256 shares)",
            },
          },
        ],
      );
      console.log(JSON.stringify(bundle, null, 2));
    });

    it("Smart Wallet routes to LOOPED_HYPE", async () => {
      const bundle = await client.getBundleData(
        {
          chainId: 999,
          fromAddress: SENDER,
          routingStrategy: "delegate",
          receiver: SENDER,
        },
        [
          {
            protocol: "enso",
            action: "route",
            args: {
              tokenIn: USDT,
              tokenOut: LOOPED_HYPE,
              amountIn: "100000000",
              receiver: SENDER,
            },
          },
        ],
      );
      console.log(JSON.stringify(bundle, null, 2));
    });
  });

  describe("EOA", () => {
    it("EOA deposits to LOOPED_HYPE with custom community code and dynamic token amount", async () => {
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
            protocol: "erc20",
            action: "approve",
            args: {
              amount: { useOutputOfCallAt: 0 },
              spender: HYPE_DEPOSITOR,
              token: STAKED_HYPE,
            },
          },
          {
            protocol: "enso",
            action: "call",
            args: {
              tokenIn: STAKED_HYPE,
              tokenOut: LOOPED_HYPE,
              address: HYPE_DEPOSITOR,
              args: [
                STAKED_HYPE,
                { useOutputOfCallAt: 0 },
                0,
                SENDER,
                "0x1234",
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
});
