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

  it("ccipBridgeWithCallback - Bridge SolvBTC from BNB to Base and swap to ETH", async () => {
    // Chain IDs
    const BNB_CHAIN_ID = 56;
    const BASE_CHAIN_ID = 8453;

    // Common addresses
    const WALLET_ADDRESS = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";

    // Token addresses
    const SOLVBTC_BNB = "0x4aae823a6a0b376De6A78e74eCC5b079d38cBCf7";
    const SOLVBTC_BASE = "0x3B86Ad95859b6AB773f55f8d94B4b9d443EE931f";
    const NATIVE_TOKEN = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

    const client = new EnsoClient({
      apiKey: "56b3d1f4-5c59-4fc1-8998-16d001e277bc",
    });

    // Get CCIP Router address for the source chain
    const ccipRouter = await client.getCcipRouter({
      chainId: BNB_CHAIN_ID,
    });

    expect(ccipRouter).toBeDefined();
    expect(ccipRouter.router).toBeDefined();

    const bundle = await client.getBundleData(
      {
        chainId: BNB_CHAIN_ID,
        fromAddress: WALLET_ADDRESS,
        routingStrategy: "router",
      },
      [
        {
          protocol: "ccip",
          action: "bridge",
          args: {
            primaryAddress: ccipRouter.router,
            destinationChainId: BASE_CHAIN_ID,
            tokenIn: SOLVBTC_BNB,
            amountIn: "100000000000000", // 0.0001 SolvBTC
            receiver: WALLET_ADDRESS,
            callback: [
              // Step 1: Check SolvBTC balance on Base after bridge
              {
                protocol: "enso",
                action: "balance",
                args: {
                  token: SOLVBTC_BASE,
                },
              },
              // Step 2: Swap SolvBTC to native ETH on Base
              {
                protocol: "enso",
                action: "route",
                args: {
                  slippage: "100", // 1%
                  tokenIn: SOLVBTC_BASE,
                  tokenOut: NATIVE_TOKEN,
                  amountIn: { useOutputOfCallAt: 0 },
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

    // Validate CCIP protocol is used
    const action = bundle.bundle[0];
    expect(action.protocol).toBe("ccip");
    expect(action.action).toBe("bridge");
  });

  it("ccipBridgeSimple - Bridge SolvBTC from BNB to Base without callback", async () => {
    // Chain IDs
    const BNB_CHAIN_ID = 56;
    const BASE_CHAIN_ID = 8453;

    // Common addresses
    const WALLET_ADDRESS = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";

    // Token addresses
    const SOLVBTC_BNB = "0x4aae823a6a0b376De6A78e74eCC5b079d38cBCf7";

    const client = new EnsoClient({
      apiKey: "56b3d1f4-5c59-4fc1-8998-16d001e277bc",
    });

    // Get CCIP Router address for the source chain
    const ccipRouter = await client.getCcipRouter({
      chainId: BNB_CHAIN_ID,
    });

    const bundle = await client.getBundleData(
      {
        chainId: BNB_CHAIN_ID,
        fromAddress: WALLET_ADDRESS,
        routingStrategy: "router",
        receiver: WALLET_ADDRESS,
      },
      [
        {
          protocol: "ccip",
          action: "bridge",
          args: {
            primaryAddress: ccipRouter.router,
            destinationChainId: BASE_CHAIN_ID,
            tokenIn: SOLVBTC_BNB,
            amountIn: "100000000000000",
            receiver: WALLET_ADDRESS,
            // No callback - simple transfer
          },
        },
      ],
    );

    expect(bundle).toBeDefined();
    expect(bundle.bundle).toBeDefined();
    expect(bundle.tx).toBeDefined();
  });

  it("relayBridgeWithCallback - Bridge ETH from Ethereum to Arbitrum and wrap to WETH", async () => {
    // Chain IDs
    const ETHEREUM_ID = 1;
    const ARBITRUM_ID = 42161;

    // Common addresses
    const WALLET_ADDRESS = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";

    // Token addresses
    const USDC_ETHEREUM = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
    const WETH_ARBITRUM = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
    const NATIVE_TOKEN = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

    const client = new EnsoClient({
      apiKey: "56b3d1f4-5c59-4fc1-8998-16d001e277bc",
    });

    const bundle = await client.getBundleData(
      {
        chainId: ETHEREUM_ID,
        fromAddress: WALLET_ADDRESS,
        routingStrategy: "router",
      },
      [
        // Step 1: Swap USDC to ETH on Ethereum
        {
          protocol: "enso",
          action: "route",
          args: {
            tokenIn: USDC_ETHEREUM,
            tokenOut: NATIVE_TOKEN,
            amountIn: "10000000", // 10 USDC
          },
        },
        // Step 2: Bridge ETH to Arbitrum via Relay
        {
          protocol: "relay",
          action: "bridge",
          args: {
            primaryAddress: "0xa5f565650890fba1824ee0f21ebbbf660a179934",
            destinationChainId: ARBITRUM_ID,
            tokenIn: NATIVE_TOKEN, // Relay supports native tokens
            amountIn: { useOutputOfCallAt: 0 },
            receiver: WALLET_ADDRESS,
            callback: [
              // Step 3: Check ETH balance on Arbitrum
              {
                protocol: "enso",
                action: "balance",
                args: {
                  token: NATIVE_TOKEN,
                },
              },
              // Step 4: Wrap ETH to WETH on Arbitrum
              {
                protocol: "wrapped-native",
                action: "deposit",
                args: {
                  primaryAddress: WETH_ARBITRUM,
                  tokenIn: NATIVE_TOKEN,
                  tokenOut: WETH_ARBITRUM,
                  amountIn: { useOutputOfCallAt: 0 },
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
    expect(bundle.bundle).toHaveLength(2);

    // Transaction validation
    expect(bundle.tx).toBeDefined();
    expect(bundle.tx.data).toBeDefined();

    // Validate Relay protocol is used for the bridge action
    const bridgeAction = bundle.bundle[1];
    expect(bridgeAction.protocol).toBe("relay");
    expect(bridgeAction.action).toBe("bridge");
  });

  it("stargateDoubleBridge - Bridge and return via Stargate", async () => {
    // Chain IDs
    const HYPERLIQUID_ID = 999;
    const PLASMA_ID = 9745;

    // Common addresses
    const WALLET_ADDRESS = "0x826e0BB2276271eFdF2a500597f37b94f6c153bA";

    // Token addresses
    const chUSD_HYPE = "0x2222227d90046F1483B3Fb37990DEA31FCaBea02";
    const chUSD_PLASMA = "0x22222215d4EdC5510d23D0886133E7ece7F5fdC1";
    const schUSD_PLASMA = "0x888888bAb58A7bd3068110749BC7B63B62CE874d";

    // Pool addresses
    const chUSD_POOL_HYPE_TO_PLASMA =
      "0x2222227d90046F1483B3Fb37990DEA31FCaBea02";
    const schUSD_POOL_PLASMA_TO_HYPE =
      "0x8888883ACA65976e98E16931b46308E4C588D533";

    const client = new EnsoClient({
      apiKey: "56b3d1f4-5c59-4fc1-8998-16d001e277bc",
    });

    const bundle = await client.getBundleData(
      {
        chainId: HYPERLIQUID_ID,
        fromAddress: WALLET_ADDRESS,
        routingStrategy: "router",
      },
      [
        {
          protocol: "stargate",
          action: "bridge",
          args: {
            primaryAddress: chUSD_POOL_HYPE_TO_PLASMA,
            destinationChainId: PLASMA_ID,
            tokenIn: chUSD_HYPE,
            amountIn: parseUnits("1", 18).toString(),
            receiver: WALLET_ADDRESS,
            callback: [
              // Step 1: Check chUSD balance on Plasma
              {
                protocol: "enso",
                action: "balance",
                args: {
                  token: chUSD_PLASMA,
                },
              },
              // Step 2: Swap chUSD to schUSD on Plasma
              {
                protocol: "enso",
                action: "route",
                args: {
                  slippage: "50",
                  tokenIn: chUSD_PLASMA,
                  tokenOut: schUSD_PLASMA,
                  amountIn: { useOutputOfCallAt: 0 },
                },
              },
              // Step 3: Bridge schUSD back to Hyperliquid
              {
                protocol: "stargate",
                action: "bridge",
                args: {
                  primaryAddress: schUSD_POOL_PLASMA_TO_HYPE,
                  destinationChainId: HYPERLIQUID_ID,
                  tokenIn: schUSD_PLASMA,
                  amountIn: { useOutputOfCallAt: 1 },
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
  });

  it("mixedBridgeStargateCcip - Bridge USDT0 via Stargate, swap to syrupUSDT, bridge back via CCIP, deposit to AAVE", async () => {
    // Chain IDs
    const PLASMA_ID = 9745;
    const ETHEREUM_ID = 1;

    // Common addresses
    const WALLET_ADDRESS = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";

    // Token addresses - Plasma
    const USDT0_PLASMA = "0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb";
    const SYRUP_USDT_PLASMA = "0xc4374775489cb9c56003bf2c9b12495fc64f0771";
    const A_SYRUP_USDT_PLASMA = "0xD4eE376C40EdC83832aAaFc18fC0272660F5e90b";

    // Token addresses - Ethereum
    const USDT_ETHEREUM = "0xdac17f958d2ee523a2206206994597c13d831ec7";
    const SYRUP_USDT_ETHEREUM = "0x356b8d89c1e1239cbbb9de4815c39a1474d5ba7d";

    // Protocol addresses
    const STARGATE_USDT0_POOL_PLASMA =
      "0x02ca37966753bdddf11216b73b16c1de756a7cf9";
    const CCIP_ROUTER_ETHEREUM = "0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D";
    const AAVE_V3_PLASMA_POOL = "0x925a2A7214Ed92428B5b1B090F80b25700095e12";

    const client = new EnsoClient({
      apiKey: "56b3d1f4-5c59-4fc1-8998-16d001e277bc",
    });

    const bundle = await client.getBundleData(
      {
        chainId: PLASMA_ID,
        fromAddress: WALLET_ADDRESS,
        routingStrategy: "router",
        receiver: WALLET_ADDRESS,
      },
      [
        {
          // Step 1: Bridge USDT0 from Plasma to Ethereum via Stargate
          protocol: "stargate",
          action: "bridge",
          args: {
            primaryAddress: STARGATE_USDT0_POOL_PLASMA,
            destinationChainId: ETHEREUM_ID,
            tokenIn: USDT0_PLASMA,
            amountIn: "1000000000", // 1000 USDT0
            receiver: WALLET_ADDRESS,
            callback: [
              // Step 2: Check USDT balance on Ethereum
              {
                protocol: "enso",
                action: "balance",
                args: {
                  token: USDT_ETHEREUM,
                },
              },
              // Step 3: Swap USDT to syrupUSDT on Ethereum
              {
                protocol: "enso",
                action: "route",
                args: {
                  tokenIn: USDT_ETHEREUM,
                  tokenOut: SYRUP_USDT_ETHEREUM,
                  amountIn: { useOutputOfCallAt: 0 },
                },
              },
              // Step 4: Bridge syrupUSDT back to Plasma via CCIP
              {
                protocol: "ccip",
                action: "bridge",
                args: {
                  primaryAddress: CCIP_ROUTER_ETHEREUM,
                  destinationChainId: PLASMA_ID,
                  tokenIn: SYRUP_USDT_ETHEREUM,
                  amountIn: { useOutputOfCallAt: 1 },
                  receiver: WALLET_ADDRESS,
                  callback: [
                    // Step 5: Check syrupUSDT balance on Plasma
                    {
                      protocol: "enso",
                      action: "balance",
                      args: {
                        token: SYRUP_USDT_PLASMA,
                      },
                    },
                    // Step 6: Deposit syrupUSDT to AAVE V3 on Plasma
                    {
                      protocol: "aave-v3",
                      action: "deposit",
                      args: {
                        primaryAddress: AAVE_V3_PLASMA_POOL,
                        tokenIn: SYRUP_USDT_PLASMA,
                        tokenOut: A_SYRUP_USDT_PLASMA,
                        amountIn: { useOutputOfCallAt: 0 },
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

    // Validate Stargate protocol is used for the initial bridge
    const action = bundle.bundle[0];
    expect(action.protocol).toBe("stargate");
    expect(action.action).toBe("bridge");
  });
});
