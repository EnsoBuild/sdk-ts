import { Address, PriceData, RouteData } from "../src";

const address = "0x0000000000000000000000000000000000000001" as Address;

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
});
