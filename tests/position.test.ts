import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { EnsoClient } from "../src/client";
import type { PositionRouteRequest } from "../src/types/types";
test("position mutations preserve an empty asset result and decimal NFT ids", async () => {
  const mock = new MockAdapter(axios);
  const client = new EnsoClient({ apiKey: "local-fixture" });
  const body: PositionRouteRequest = {
    chainId: 1,
    fromAddress: "0x1111111111111111111111111111111111111111",
    routingStrategy: "router",
    action: "depositclmm",
    position: {
      protocol: "uniswap-v3",
      collection: "0x2222222222222222222222222222222222222222",
      tokenId: "9007199254740993000",
    },
    assetsIn: [
      { address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", amount: "1" },
      {
        address: "0x2222222222222222222222222222222222222222",
        tokenId: "9007199254740993000",
      },
    ],
  };
  const response = {
    assetsOut: [],
    positions: [
      {
        chainId: 1,
        protocol: "uniswap-v3",
        asset: {
          type: "erc721",
          address: body.position.collection,
          tokenId: body.position.tokenId,
        },
        owner: { before: body.fromAddress, after: body.fromAddress },
        liquidity: { before: "100", after: "135", delta: "35" },
      },
    ],
  };
  mock.onPost("/shortcuts/route/position").reply(200, response);
  expect(await client.getPositionRoute(body)).toEqual(response);
  expect(JSON.parse(mock.history.post[0].data)).toEqual(body);
  mock.restore();
});
