/**
 * @fileoverview Type definitions for the Enso Finance API SDK
 */

import { BundleAction } from "./types/actions";

/**
 * Represents the different routing strategies available for transactions.
 */
export type RoutingStrategy =
  | "router"
  | "delegate"
  | "router-legacy"
  | "delegate-legacy"
  | "ensowallet";

/**
 * Ethereum address format - must be a 42-character hexadecimal string starting with '0x'.
 * @example '0x123456789abcdef123456789abcdef1234567890'
 */
export type Address = `0x${string}`;

/**
 * Can be a single address or an array of addresses.
 */
export type MultiAddress = Address | Address[];

/**
 * Standard transaction object returned by the API.
 */
export type Transaction = {
  /** Raw transaction data in hexadecimal format */
  data: string;
  /** Recipient address */
  to: Address;
  /** Sender address */
  from: Address;
  /** Value to send in wei */
  value: string;
};

/**
 * Parameters for getting route data between two tokens.
 */
export type RouteParams = {
  /** Ethereum address of the wallet to send the transaction from */
  fromAddress: Address;
  /** Ethereum address of the receiver of the tokenOut */
  receiver: Address;
  /** Ethereum address of the spender of the tokenIn */
  spender: Address;
  /** Chain ID of the network to execute the transaction on */
  chainId: number;
  /** Amount of tokenIn to swap in wei */
  amountIn: string[];
  /** Slippage in basis points (1/10000). If specified, minAmountOut should not be specified */
  slippage?: number;
  /** Minimum amount out in wei. If specified, slippage should not be specified */
  minAmountOut?: string[];
  /** Ethereum address of the token to swap from. For ETH, use 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee */
  tokenIn: Address[];
  /** Ethereum address of the token to swap to. For ETH, use 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee */
  tokenOut: Address[];
  /** Routing strategy to use */
  routingStrategy?: RoutingStrategy;
  /** Fee in basis points (1/10000) for each amountIn value. Must be in range 0-100 */
  fee?: string[];
  /** The Ethereum address that will receive the collected fee. Required if fee is provided */
  feeReceiver?: Address;
  /** A list of swap aggregators to be ignored from consideration */
  ignoreAggregators?: string[];
  /** A list of standards to be ignored from consideration */
  ignoreStandards?: string[];
};

/**
 * Represents a segment in a routing path.
 */
export type RouteSegment = {
  /** Action to be performed */
  action: string;
  /** Protocol to use for this segment */
  protocol: string;
  /** Primary contract address for this segment */
  primary?: Address;
  /** Input tokens for this segment */
  tokenIn: Address[];
  /** Output tokens for this segment */
  tokenOut: Address[];
  /** Position IDs for input */
  positionInId?: string[];
  /** Position IDs for output */
  positionOutId?: string[];
  /** Nested internal routes for complex paths */
  internalRoutes?: RouteSegment[][];
};

/**
 * Represents a hop in the routing path.
 */
export type Hop = {
  /** Input tokens for this hop */
  tokenIn: string[];
  /** Output tokens for this hop */
  tokenOut: string[];
  /** Protocol used for this hop */
  protocol: string;
  /** Action performed in this hop */
  action: string;
  /** Primary contract address */
  primary: string;
  /** Internal routes used in this hop */
  internalRoutes: string[];
};

/**
 * Response data from route calculation.
 */
export type RouteData = {
  /** Array of segments representing the calculated route */
  route: RouteSegment[];
  /** Estimated gas used by the transaction. Increase by 50% as a buffer */
  gas: string;
  /** Estimated amount received */
  amountOut: string;
  /** Price impact in basis points, null if USD price not found */
  priceImpact: string | null;
  /** Block number the transaction was created on */
  createdAt: number;
  /** The tx object to use in ethers */
  tx: Transaction;
  /** Collected fee amounts for each amountIn input */
  feeAmount: string[];
};

/**
 * Parameters for getting approval data.
 */
export type ApproveParams = {
  /** Ethereum address of the wallet to send the transaction from */
  fromAddress: Address;
  /** ERC20 token address of the token to approve */
  tokenAddress: Address;
  /** Chain ID of the network to execute the transaction on */
  chainId: number;
  /** Amount of tokens to approve in wei */
  amount: string;
  /** Routing strategy to use. Use the same routing strategy you used to create the transaction */
  routingStrategy?: RoutingStrategy;
};

/**
 * Response data from approval request.
 */
export type ApproveData = {
  /** Amount of tokens approved in wei */
  amount: string;
  /** Gas estimate for the transaction */
  gas: string;
  /** Address that is allowed to spend the tokens */
  spender: Address;
  /** Token address that was approved */
  token: Address;
  /** Transaction data */
  tx: Transaction;
};

/**
 * Represents wallet balance information.
 */
export type WalletBalance = {
  /** The unformatted balance of the token */
  amount: string;
  /** The number of decimals the token uses */
  decimals: number;
  /** The address of the token */
  token: Address;
  /** Price of the token in USD */
  price: string;
};

/**
 * Parameters for getting wallet balances.
 */
export type BalanceParams = {
  /** Chain ID of the network to execute the transaction on */
  chainId: number;
  /** Address of the eoa with which to associate the ensoWallet for balances */
  eoaAddress: Address;
  /** If true returns balances for the provided eoaAddress, instead of the associated ensoWallet */
  useEoa?: boolean;
};

/**
 * Parameters for querying token data.
 */
export interface TokenParams {
  /** The overarching project or platform associated with the DeFi token */
  project?: string;
  /** The specific standard integration or version of the DeFi project */
  protocolSlug?: string;
  /** Underlying tokens of defi token */
  underlyingTokens?: MultiAddress;
  /** Exact composition of underlying tokens of defi token */
  underlyingTokensExact?: MultiAddress;
  /** Ethereum addresses for contract interaction of defi tokens */
  primaryAddress?: MultiAddress;
  /** Ethereum addresses of the tokens */
  address?: MultiAddress;
  /** Chain ID of the network of the token */
  chainId?: number;
  /** Type of token. If not provided, both types will be taken into account */
  type?: "defi" | "base";
  /** Only include tokens with APY over this value */
  apyFrom?: number;
  /** Only include tokens with APY below this value */
  apyTo?: number;
  /** Only include tokens with TVL over this value */
  tvlFrom?: number;
  /** Only include tokens with TVL below this value */
  tvlTo?: number;
  /** Pagination page number. Pages are of length 1000 */
  page?: number;
  /** Cursor for pagination. Pages are of length 1000 */
  cursor?: number;
  /** Whether to include token metadata (symbol, name and logos) */
  includeMetadata?: boolean;
}

/**
 * Represents an underlying token in a tokenized position.
 */
export interface UnderlyingToken {
  /** Ethereum address of the token */
  address: string;
  /** Chain ID of the network of the token */
  chainId: number;
  /** Type of token */
  type: string;
  /** Token decimals */
  decimals: number;
  /** Token symbol */
  symbol?: string;
  /** Token name */
  name?: string;
  /** A list of logos for the token */
  logosUri?: string[];
}

/**
 * Base token information.
 */
export interface Token {
  /** Ethereum address of the token */
  address: Address;
  /** Chain ID of the network of the token */
  chainId: number;
  /** Type of token */
  type: "defi" | "base";
  /** Token decimals */
  decimals: number;
  /** Token symbol */
  symbol?: string;
  /** Token name */
  name?: string;
  /** A list of logos for the token */
  logosUri?: string[];
  /** Underlying tokens of defi token */
  underlyingTokens?: UnderlyingToken[];
  /** The overarching project or platform associated with the DeFi token */
  project?: string;
  /** The specific standard integration or version of the DeFi project */
  protocolSlug?: string;
  /** The defi position APY */
  apy?: number | null;
  /** The defi position base APY */
  apyBase?: number | null;
  /** The defi position reward APY */
  apyReward?: number | null;
  /** The defi position TVL */
  tvl?: number | null;
  /** Ethereum address for contract interaction of defi token */
  primaryAddress?: string;
}

/**
 * Extended token data type.
 */
export type TokenData = Token & {
  /** The overarching project or platform associated with the DeFi token */
  project: string;
  /** The specific standard integration or version of the DeFi project */
  protocolSlug: string;
  /** Underlying tokens of defi token */
  underlyingTokens: Token[];
  /** Ethereum address for contract interaction of defi token */
  primaryAddress: Address;
  /** The defi position APY */
  apy: number | null;
  /** The defi position TVL */
  tvl: number | null;
};

/**
 * Parameters for getting token price data.
 */
export type PriceParams = {
  /** Chain ID of the network to search for */
  chainId: number;
  /** Address of the token to search for */
  address: Address;
};

/**
 * Token price data response.
 */
export type PriceData = {
  /** Token price in USD */
  price: string;
  /** Token decimals */
  decimals: number;
  /** Token symbol */
  symbol: string;
  /** Unix timestamp of the price */
  timestamp: number;
  /** Confidence level of the price (0-1) */
  confidence: number;
  /** Chain ID of the token */
  chainId: number;
};

/**
 * Parameters for querying protocol data.
 */
export type ProtocolParams = {
  /** Chain ID of the network to search for */
  chainId: number;
  /** Slug of the project to search for */
  slug?: string;
};

/**
 * Protocol information.
 */
export type ProtocolData = {
  /** Supported chains for this protocol */
  chains: { name: string; id: number }[];
  /** Protocol name */
  name: string | null;
  /** Protocol description */
  description: string | null;
  /** Protocol slug identifier */
  slug: string;
  /** Protocol website URL */
  url: string;
  /** Protocol logo URIs */
  logosUri: string[];
};

/**
 * Represents an amount input that can either be a fixed value or reference to another call's output.
 */
export type AmountInArgument =
  | string
  | {
      /** Index of the call whose output should be used */
      useOutputOfCallAt: number;
      /** Optional specific index within the output */
      index?: number;
    };

/**
 * Parameters for bundle creation.
 */
export type BundleParams = {
  /** Chain ID of the network to execute the transaction on */
  chainId: number;
  /** Ethereum address of the wallet to send the transaction from */
  fromAddress: Address;
  /** Routing strategy to use */
  routingStrategy?: RoutingStrategy;
  /** Ethereum address of the receiver of the tokenOut */
  receiver?: Address;
  /** Ethereum address of the spender of the tokenIn */
  spender?: Address;
};

/**
 * Bundle transaction data response.
 */
export type BundleData = {
  /** Array of actions in the bundle */
  bundle: BundleAction[];
  /** Gas estimate for the bundle */
  gas: string;
  /** Block number the transaction was created on */
  createdAt: number;
  /** The tx object to use in ethers */
  tx: Transaction;
};

/**
 * Network information.
 */
export interface Network {
  /** Network ID */
  id: number;
  /** Network name */
  name: string;
}

/**
 * Project information.
 */
export interface Project {
  /** Project identifier */
  id: string;
}

/**
 * Standard protocol data.
 */
export interface StandardData {
  /** Protocol information */
  protocol: {
    /** Protocol slug */
    slug: string;
    /** Protocol URL */
    url: string;
  };
  /** Forked protocols */
  forks: {
    /** Fork slug */
    slug: string;
    /** Fork URL */
    url: string;
  }[];
  /** Supported actions */
  actions: StandardAction[];
}

/**
 * Standard action definition.
 */
export interface StandardAction {
  /** Action identifier */
  action: string;
  /** Action name */
  name: string;
  /** Function names used in contracts */
  functionNames: string[];
  /** Supported chains for this action */
  supportedChains: Network[];
  /** Required inputs for this action */
  inputs: string[];
}

/**
 * Action data definition.
 */
export interface ActionData {
  /** Action identifier */
  action: string;
  /** Input parameter definitions */
  inputs: {
    [key: string]: string;
  };
}

/**
 * IPOR shortcut input data.
 */
export interface IporShortcutInputData {
  /** Flag that indicates whether to use the shared router */
  isRouter?: boolean | null;
  /** Amount of tokenIn in wei */
  amountIn: string;
  /** Address of the tokenIn */
  tokenIn: string;
  /** Address of the tokenBToBuy */
  tokenBToBuy: string;
  /** Percentage of tokenB to buy in basis points */
  percentageForTokenB: string;
  /** Slippage in basis points */
  slippage?: string;
  /** Flag that indicates whether to simulate the transaction */
  simulate?: boolean | null;
}

/**
 * IPOR shortcut transaction data.
 */
export interface IporShortcutData {
  /** Block number the transaction was created on */
  createdAt: number;
  /** The tx object to use in ethers */
  tx: Transaction;
  /** Logs from the simulated transaction */
  logs: string[];
  /** Tenderly simulation URL */
  simulationURL: string;
}

/**
 * Non-tokenized position data.
 */
export interface NonTokenizedData {
  /** Chain ID of the network of the nontokenized position */
  chainId: number;
  /** The specific standard integration or version of the nontokenized position */
  protocol: string;
  /** Ethereum address of the nontokenized position */
  address: string;
  /** Ethereum address of the nontokenized position */
  primaryAddress: string;
  /** Underlying tokens of nontokenized position */
  underlyingTokens: Token[] | null;
}

/**
 * Parameters for routing to non-tokenized position.
 */
export interface RouteNonTokenizedParams {
  /** Chain ID of the network to execute the transaction on */
  chainId?: number;
  /** Ethereum address of the wallet to send the transaction from */
  fromAddress: string;
  /** Routing strategy to use (must be 'delegate') */
  routingStrategy?: "delegate";
  /** Input tokens */
  tokenIn: string[];
  /** Non-tokenized position to receive */
  positionOut: string;
  /** Slippage in basis points */
  slippage?: string;
  /** Fee in basis points */
  fee?: string[];
  /** Fee receiver address */
  feeReceiver?: string;
  /** Amount to send */
  amountIn: string[];
  /** Receiver address */
  receiver: string;
  /** Spender address */
  spender?: string;
}

/**
 * Parameters for network queries.
 */
export interface NetworkParams {
  /** Title of the network to search for */
  name?: string;
  /** Chain ID of the network to search for */
  chainId?: string;
}

export { BundleAction };
