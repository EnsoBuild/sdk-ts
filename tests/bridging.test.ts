import { EnsoClient } from "../src";

import { parseUnits } from "viem";

describe("docs samples integration tests - bridging", () => {
  it("mintErUsdCrossChainFromBerachain", async () => {
    // Chain IDs
    const BERACHAIN_ID = 80094;
    const ETHEREUM_ID = 1;

    // Common addresses
    const WALLET_ADDRESS = "0x93621DCA56fE26Cdee86e4F6B18E116e9758Ff11"; // User wallet

    // Token addresses
    const USDC_BERACHAIN = "0x549943e04f40284185054145c6E4e9568C1D3241";
    const USDC_ETHEREUM = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const E_RUSD_ETHEREUM = "0x09D4214C03D01F49544C0448DBE3A27f768F2b34";

    // Protocol addresses
    const RESERVOIR_MINTING_CONTRACT =
      "0x4809010926aec940b550D34a46A52739f996D75D";
    const STARGATE_USDC_BRIDGE = "0xAF54BE5B6eEc24d6BFACf1cce4eaF680A8239398";
    const STARGATE_E_RUSD_BRIDGE = "0xf0e9f6d9ba5d1b3f76e0f82f9dcdb9ebeef4b4da";

    const client = new EnsoClient({
      apiKey: "56b3d1f4-5c59-4fc1-8998-16d001e277bc",
    });

    const bundle = await client.getBundleData(
      {
        chainId: BERACHAIN_ID,
        fromAddress: WALLET_ADDRESS,
        spender: WALLET_ADDRESS,
        routingStrategy: "router",
      },
      [
        {
          protocol: "stargate",
          action: "bridge",
          args: {
            primaryAddress: STARGATE_USDC_BRIDGE,
            destinationChainId: ETHEREUM_ID,
            tokenIn: USDC_BERACHAIN,
            amountIn: parseUnits("1000", 6).toString(), // 1000 USDC
            receiver: WALLET_ADDRESS,
            callback: [
              // Step 1: Check USDC balance on Ethereum after bridge
              {
                protocol: "enso",
                action: "balance",
                args: {
                  token: USDC_ETHEREUM,
                },
              },
              // Step 2: Mint e-rUSD using bridged USDC
              {
                protocol: "reservoir",
                action: "deposit",
                args: {
                  primaryAddress: RESERVOIR_MINTING_CONTRACT,
                  tokenIn: USDC_ETHEREUM,
                  tokenOut: E_RUSD_ETHEREUM,
                  amountIn: { useOutputOfCallAt: 0 }, // Use USDC from balance check
                  receiver: WALLET_ADDRESS,
                },
              },
              // Step 3: Bridge newly minted e-rUSD back to Berachain
              {
                protocol: "stargate",
                action: "bridge",
                args: {
                  primaryAddress: STARGATE_E_RUSD_BRIDGE,
                  destinationChainId: BERACHAIN_ID,
                  tokenIn: E_RUSD_ETHEREUM,
                  amountIn: { useOutputOfCallAt: 1 }, // Use e-rUSD from minting
                  receiver: WALLET_ADDRESS,
                },
              },
            ],
          },
        },
      ],
    );

    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();

    // Gas validation
    expect(bundle.gas).toBeDefined();
    const gasEstimate = parseInt(bundle.gas.toString());
    expect(gasEstimate).toBeGreaterThan(100000); // Swap needs reasonable gas

    // Validate bundle action structure
    const action = bundle.bundle[0];
    expect(action.args).toBeDefined();
  });

  it("mintrUsdAndDepositToEulerCrossChain", async () => {
    const BERACHAIN_ID = 80094;
    const ETHEREUM_ID = 1;

    // Common addresses
    const WALLET_ADDRESS = "0x93621DCA56fE26Cdee86e4F6B18E116e9758Ff11"; // User wallet

    // Token addresses
    const USDC_BERACHAIN = "0x549943e04f40284185054145c6E4e9568C1D3241";
    const USDC_ETHEREUM = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const RUSD_ETHEREUM = "0x09D4214C03D01F49544C0448DBE3A27f768F2b34";
    const RUSD_BERACHAIN = "0x09D4214C03D01F49544C0448DBE3A27f768F2b34";

    // Protocol addresses
    const RESERVOIR_MINTING_CONTRACT =
      "0x4809010926aec940b550D34a46A52739f996D75D";
    const STARGATE_USDC_BRIDGE = "0xAF54BE5B6eEc24d6BFACf1cce4eaF680A8239398";
    const STARGATE_E_RUSD_BRIDGE = "0xf0e9f6d9ba5d1b3f76e0f82f9dcdb9ebeef4b4da";

    // Euler addresses on Berachain
    const EULER_VAULT_E_RUSD_BERACHAIN =
      "0x109D6D1799f62216B4a7b0c6e245844AbD4DD281"; // Euler vault for e-rUSD on Berachain (need actual address)

    const client = new EnsoClient({
      apiKey: "56b3d1f4-5c59-4fc1-8998-16d001e277bc",
    });

    const bundle = await client.getBundleData(
      {
        chainId: BERACHAIN_ID,
        fromAddress: WALLET_ADDRESS,
        spender: WALLET_ADDRESS,
        routingStrategy: "router",
      },
      [
        {
          protocol: "stargate",
          action: "bridge",
          args: {
            primaryAddress: STARGATE_USDC_BRIDGE,
            destinationChainId: ETHEREUM_ID,
            tokenIn: USDC_BERACHAIN,
            amountIn: parseUnits("1000", 6).toString(), // 1000 USDC
            receiver: WALLET_ADDRESS,
            callback: [
              // Step 1: Check USDC balance on Ethereum after bridge
              {
                protocol: "enso",
                action: "balance",
                args: {
                  token: USDC_ETHEREUM,
                },
              },
              // Step 2: Mint e-rUSD using bridged USDC on Ethereum
              {
                protocol: "reservoir",
                action: "deposit",
                args: {
                  primaryAddress: RESERVOIR_MINTING_CONTRACT,
                  tokenIn: USDC_ETHEREUM,
                  tokenOut: RUSD_ETHEREUM,
                  amountIn: { useOutputOfCallAt: 0 }, // Use USDC from balance check
                  receiver: WALLET_ADDRESS,
                },
              },
              // Step 3: Bridge newly minted e-rUSD back to Berachain
              {
                protocol: "stargate",
                action: "bridge",
                args: {
                  primaryAddress: STARGATE_E_RUSD_BRIDGE,
                  destinationChainId: BERACHAIN_ID,
                  tokenIn: RUSD_ETHEREUM,
                  amountIn: { useOutputOfCallAt: 1 }, // Use e-rUSD from minting
                  receiver: WALLET_ADDRESS,
                  // Callback executes on Berachain after e-rUSD arrives
                  callback: [
                    // Step 4: Check e-rUSD balance on Berachain
                    {
                      protocol: "enso",
                      action: "balance",
                      args: {
                        token: RUSD_BERACHAIN,
                      },
                    },
                    // Step 5: Deposit e-rUSD into Euler vault on Berachain
                    {
                      protocol: "euler-v2",
                      action: "deposit",
                      args: {
                        primaryAddress: EULER_VAULT_E_RUSD_BERACHAIN,
                        tokenIn: RUSD_BERACHAIN,
                        tokenOut: EULER_VAULT_E_RUSD_BERACHAIN, // ERC4626 vault token
                        amountIn: { useOutputOfCallAt: 0 }, // Use e-rUSD from balance check
                        receiver: WALLET_ADDRESS,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    );

    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();
  });

  it("mintrUsdAndDepositToDolomiteCrossChain", async () => {
    const BERACHAIN_ID = 80094;
    const ETHEREUM_ID = 1;

    // Common addresses
    const WALLET_ADDRESS = "0x93621DCA56fE26Cdee86e4F6B18E116e9758Ff11"; // User wallet

    // Token addresses
    const USDC_BERACHAIN = "0x549943e04f40284185054145c6E4e9568C1D3241";
    const USDC_ETHEREUM = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const RUSD_ETHEREUM = "0x09D4214C03D01F49544C0448DBE3A27f768F2b34";
    const RUSD_BERACHAIN = "0x09D4214C03D01F49544C0448DBE3A27f768F2b34";

    // Protocol addresses
    const RESERVOIR_MINTING_CONTRACT =
      "0x4809010926aec940b550D34a46A52739f996D75D";
    const STARGATE_USDC_BRIDGE = "0xAF54BE5B6eEc24d6BFACf1cce4eaF680A8239398";
    const STARGATE_E_RUSD_BRIDGE = "0xf0e9f6d9ba5d1b3f76e0f82f9dcdb9ebeef4b4da";

    const DOLOMITE_DRUSD_BERACHAIN =
      "0x3000c6bf0aaeb813e252b584c4d9a82f99e7a71d"; // Euler vault for e-rUSD on Berachain (need actual address)

    const client = new EnsoClient({
      apiKey: "56b3d1f4-5c59-4fc1-8998-16d001e277bc",
    });

    const bundle = await client.getBundleData(
      {
        chainId: BERACHAIN_ID,
        fromAddress: WALLET_ADDRESS,
        spender: WALLET_ADDRESS,
        routingStrategy: "router",
      },
      [
        {
          protocol: "stargate",
          action: "bridge",
          args: {
            primaryAddress: STARGATE_USDC_BRIDGE,
            destinationChainId: ETHEREUM_ID,
            tokenIn: USDC_BERACHAIN,
            amountIn: parseUnits("1000", 6).toString(), // 1000 USDC
            receiver: WALLET_ADDRESS,
            callback: [
              // Step 1: Check USDC balance on Ethereum after bridge
              {
                protocol: "enso",
                action: "balance",
                args: {
                  token: USDC_ETHEREUM,
                },
              },
              // Step 2: Mint e-rUSD using bridged USDC on Ethereum
              {
                protocol: "reservoir",
                action: "deposit",
                args: {
                  primaryAddress: RESERVOIR_MINTING_CONTRACT,
                  tokenIn: USDC_ETHEREUM,
                  tokenOut: RUSD_ETHEREUM,
                  amountIn: { useOutputOfCallAt: 0 }, // Use USDC from balance check
                  receiver: WALLET_ADDRESS,
                },
              },
              // Step 3: Bridge newly minted e-rUSD back to Berachain
              {
                protocol: "stargate",
                action: "bridge",
                args: {
                  primaryAddress: STARGATE_E_RUSD_BRIDGE,
                  destinationChainId: BERACHAIN_ID,
                  tokenIn: RUSD_ETHEREUM,
                  amountIn: { useOutputOfCallAt: 1 }, // Use e-rUSD from minting
                  receiver: WALLET_ADDRESS,
                  // Callback executes on Berachain after e-rUSD arrives
                  callback: [
                    // Step 4: Check e-rUSD balance on Berachain
                    {
                      protocol: "enso",
                      action: "balance",
                      args: {
                        token: RUSD_BERACHAIN,
                      },
                    },
                    // Step 5: Deposit e-rUSD into Euler vault on Berachain
                    {
                      protocol: "dolomite-erc4626",
                      action: "deposit",
                      args: {
                        primaryAddress: DOLOMITE_DRUSD_BERACHAIN,
                        tokenIn: RUSD_BERACHAIN,
                        tokenOut: DOLOMITE_DRUSD_BERACHAIN, // ERC4626 vault token
                        // amountIn: { useOutputOfCallAt: 0 }, // Use e-rUSD from balance check
                        amountIn: "10000000000000000000",
                        receiver: WALLET_ADDRESS,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    );

    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(Array.isArray(bundle.bundle)).toBe(true);
    expect(bundle.bundle).toHaveLength(1);
    
    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();
    expect(bundle.tx.to).toBeDefined();
    expect(bundle.tx.from).toBeDefined();
  });
});
