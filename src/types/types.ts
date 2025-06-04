// src/types.ts - Updated types to match OpenAPI specification

/**
 * @fileoverview Type definitions for the Enso Finance API SDK
 */
import { BundleAction } from "./actions";
export type { BundleAction };

/**
 * Represents the different routing strategies available for transactions.
 * {@link https://docs.enso.build/pages/build/reference/routing-strategies}
 */
export type RoutingStrategy =
  | "router"
  | "delegate"
  | "router-legacy"
  | "delegate-legacy";

export type TokenType = "defi" | "base";
/**
 * Ethereum address format - must be a 42-character hexadecimal string starting with '0x'.
 * @example '0x123456789abcdef123456789abcdef1234567890'
 */
export type Address = `0x${string}`;

export type Quantity = string | number;

export type BytesArg = `0x${string}`;

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
  /** Address of the recipient for the transaction - an [Enso contract](https://docs.enso.build/pages/build/reference/deployments)
   * determined by the routing strategy you used in the request
   * @see {@link RoutingStrategy}
   */
  to: Address;
  /** Sender address */
  from: Address;
  /** Value to send in wei */
  value: Quantity;
};

/**
 * Parameters for getting route data between two tokens.
 */
export type RouteParams = {
  /** Ethereum address of the wallet to send the transaction from */
  fromAddress: Address;
  /** Ethereum address of the receiver of the tokenOut */
  receiver?: Address;
  /** Ethereum address of the spender of the tokenIn */
  spender?: Address;
  /** Chain ID of the network to execute the transaction on */
  chainId: number;
  /** Chain ID of the destination network for cross-chain bridging */
  destinationChainId?: number;
  /** Amount of tokenIn to swap in wei */
  amountIn: Quantity[];
  /** Slippage in basis points (1/10000). If specified, minAmountOut should not be specified */
  slippage?: Quantity;
  /** Minimum amount out in wei. If specified, slippage should not be specified */
  minAmountOut?: Quantity[];
  /** Ethereum address of the token to swap from. For ETH, use 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee */
  tokenIn: Address[];
  /** Ethereum address of the token to swap to. For ETH, use 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee */
  tokenOut: Address[];
  /** Routing strategy to use */
  routingStrategy: RoutingStrategy;
  /** Fee in basis points (1/10000) for each amountIn value. Must be in range 0-100 */
  fee?: Quantity[];
  /** The Ethereum address that will receive the collected fee. Required if fee is provided */
  feeReceiver?: Address;
  /** A list of swap aggregators to be ignored from consideration */
  ignoreAggregators?: string[];
  /** A list of standards to be ignored from consideration */
  ignoreStandards?: string[];
  /** Flag that indicates if gained tokenOut should be sent to EOA (deprecated) */
  toEoa?: boolean;
  /** Referral code that will be included in an on-chain event */
  referralCode?: string;
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
  tokenIn: Address[];
  /** Output tokens for this hop */
  tokenOut: Address[];
  /** Protocol used for this hop */
  protocol: string;
  /** Action performed in this hop */
  action: string;
  /** Primary contract address */
  primary: Address;
  /** Internal routes used in this hop */
  internalRoutes: string[];
  /** Arguments for this hop */
  args: Record<string, any>;
  /** Chain ID of the network */
  chainId: number;
};

/**
 * Response data from route calculation.
 */
export type RouteData = {
  /** Array of hops representing the calculated route */
  route: Hop[];
  /** Estimated gas used by the transaction */
  gas: Quantity;
  /** Estimated amount received */
  amountOut: Quantity;
  /** Price impact in basis points, null if USD price not found */
  priceImpact: Quantity | null;
  /** Block number the transaction was created on */
  createdAt: number;
  /** The tx object to use in ethers */
  tx: Transaction;
  /** Collected fee amounts for each amountIn input */
  feeAmount: Quantity[];
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
  amount: Quantity;
};

/**
 * Response data from approval request.
 */
export type ApproveData = {
  /** Amount of tokens approved in wei */
  amount: Quantity;
  /** Gas estimate for the transaction */
  gas: Quantity;
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
  amount: Quantity;
  /** The number of decimals the token uses */
  decimals: number;
  /** The address of the token */
  token: Address;
  /** Price of the token in USD */
  price: Quantity;
  /** Name of the token */
  name: string;
  /** Symbol of the token */
  symbol: string;
  /** Logo URI of the token */
  logoUri: string;
};

/**
 * Parameters for getting wallet balances.
 */
export type BalanceParams = {
  /** Chain ID of the network to execute the transaction on */
  chainId?: number;
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
  type?: TokenType;
  /** Only include tokens with APY over this value */
  apyFrom?: Quantity;
  /** Only include tokens with APY below this value */
  apyTo?: Quantity;
  /** Only include tokens with TVL over this value */
  tvlFrom?: Quantity;
  /** Only include tokens with TVL below this value */
  tvlTo?: Quantity;
  /** Pagination page number. Pages are of length 1000 */
  page?: number;
  /** Cursor for pagination. Pages are of length 1000 */
  cursor?: number;
  /** Whether to include token metadata (symbol, name and logos) */
  includeMetadata?: boolean;
  /** Names of the tokens */
  name?: string[];
  /** Symbols of the tokens */
  symbol?: string[];
}

/**
 * Represents an underlying token in a tokenized position.
 */
export interface UnderlyingToken {
  /** Ethereum address of the token */
  address: Address;
  /** Chain ID of the network of the token */
  chainId: number;
  /** Type of token */
  type: TokenType;
  /** Token decimals */
  decimals: number;
  /** Token symbol */
  symbol: string | null;
  /** Token name */
  name: string | null;
  /** A list of logos for the token */
  logosUri: string[] | null;
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
  symbol: string | null;
  /** Token name */
  name: string | null;
  /** A list of logos for the token */
  logosUri: string[] | null;
  /** Underlying tokens of defi token */
  underlyingTokens: UnderlyingToken[] | null;
  /** The overarching project or platform associated with the DeFi token */
  project: string | null;
  /** The specific standard integration or version of the DeFi project */
  protocolSlug: string | null;
  /** The defi position APY */
  apy: Quantity | null;
  /** The defi position base APY */
  apyBase: Quantity | null;
  /** The defi position reward APY */
  apyReward: Quantity | null;
  /** The defi position TVL */
  tvl: Quantity | null;
  /** Ethereum address for contract interaction of defi token */
  primaryAddress: Address | null;
}

/**
 * Extended token data type.
 */
export type TokenData = Token & {
  /** The overarching project or platform associated with the DeFi token */
  project: string | null;
  /** The specific standard integration or version of the DeFi project */
  protocolSlug: string | null;
  /** Underlying tokens of defi token */
  underlyingTokens: Token[] | null;
  /** Ethereum address for contract interaction of defi token */
  primaryAddress: Address | null;
  /** The defi position APY */
  apy: Quantity | null;
  /** The defi position TVL */
  tvl: Quantity | null;
};

export type PaginatedTokenData = PaginatedResult & {
  /** Array of token data */
  data: TokenData[];
};

/**
 * Paginated non-tokenized response.
 */
export interface PaginatedNonTokenizedPositionData extends PaginatedResult {
  /** Returned data for current page */
  data: NonTokenizedPositionData[];
}

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
 * Parameters for getting multiple token prices.
 */
export type MultiPriceParams = {
  /** Chain ID of the network to search for */
  chainId: number;
  /** Addresses of tokens to check prices for */
  addresses: Address[];
};

/**
 * Token price data response.
 */
export type PriceData = {
  /** Token price in USD */
  price: Quantity;
  /** Token address */
  address: Address;
  /** Token decimals */
  decimals: number;
  /** Token symbol */
  symbol: string;
  /** Unix timestamp of the price */
  timestamp: number;
  /** Chain ID of the token */
  chainId: number;
  /** Confidence level of the price (0-1) */
  confidence: number;
};

/**
 * Parameters for querying protocol data.
 */
export type ProtocolParams = {
  /** Chain ID of the network to search for */
  chainId?: number | string;
  /** Slug of the project to search for */
  slug?: string;
};

/**
 * Protocol information.
 */
export type ProtocolData = {
  /** Protocol project (category) */
  project: string | null;
  /** Protocol slug identifier */
  slug: string;
  /** Protocol name */
  name: string | null;
  /** Protocol description */
  description: string | null;
  /** Protocol website URL */
  url: string | null;
  /** Protocol logo URIs */
  logosUri: string[] | null;
  /** Supported chains for this protocol */
  chains: Network[] | null;
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
  routingStrategy: RoutingStrategy;
  /** Ethereum address of the receiver of the tokenOut */
  receiver?: Address;
  /** Ethereum address of the spender of the tokenIn */
  spender?: Address;
  /** A list of swap aggregators to be ignored from consideration */
  ignoreAggregators?: string[];
  /** Referral code that will be included in an on-chain event */
  referralCode?: string;
  /** A list of standards to be ignored from consideration */
  ignoreStandards?: string[] | null;
};

/**
 * Bundle transaction data response.
 */
export type BundleData = {
  /** Array of actions in the bundle */
  bundle: BundleAction[];
  /** Gas estimate for the bundle */
  gas: Quantity;
  /** Block number the transaction was created on */
  createdAt: number;
  /** The tx object to use in ethers */
  tx: Transaction;
  /** Amounts out for each action */
  amountsOut: Record<Address, Quantity>;
  route?: Hop[]; 
};

/**
 * Network information.
 */
export interface Network {
  /** Network ID */
  id: number;
  /** Network name */
  name: string | null;
}

/**
 * Connected network information.
 */
export interface ConnectedNetwork {
  /** Network ID */
  id: number;
  /** Network name */
  name: string | null;
  /** Whether the network is connected */
  isConnected: boolean;
}

/**
 * Project information.
 */
export interface Project {
  /** Project identifier */
  id: string;
  /** Supported chains for the project */
  chains: number[];
  /** Protocols supported in the project */
  protocols: string[];
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
  name: string | null;
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
    [key: string]: { type: string; description: string; optional?: boolean };
  };
}

/**
 * IPOR shortcut input data.
 */
export interface IporShortcutInputData {
  /** Flag that indicates whether to use the shared router */
  isRouter?: boolean | null;
  /** Amount of tokenIn in wei */
  amountIn: Quantity;
  /** Address of the tokenIn */
  tokenIn: Address;
  /** Address of the tokenBToBuy */
  tokenBToBuy: Address;
  /** Percentage of tokenB to buy in basis points */
  percentageForTokenB: Quantity;
  /** Slippage in basis points */
  slippage?: Quantity;
  /** Flag that indicates whether to simulate the transaction */
  simulate?: boolean;
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
  route?: Hop[];
}

/**
 * Non-tokenized position data.
 */
export interface NonTokenizedPositionData {
  /** Chain ID of the network of the nontokenized position */
  chainId: number;
  /** The specific standard integration or version of the nontokenized position */
  protocol: string;
  /** Ethereum address of the nontokenized position */
  address: Address;
  /** Ethereum address of the nontokenized position */
  primaryAddress: Address | null;
  /** Underlying tokens of nontokenized position */
  underlyingTokens: Token[] | null;
}

/**
 * Parameters for querying non-tokenized positions.
 */
export interface NonTokenizedParams {
  /** The overarching project or platform associated with the DeFi position */
  project?: string;
  /** The specific standard integration or version of the DeFi project */
  protocolSlug?: string;
  /** Chain ID of the network of the nontokenized position */
  chainId?: number;
  /** Chain ID of the destination network for cross-chain bridging */
  destinationChainId?: number;
  /** Ethereum addresses of the nontokenized positions */
  address?: Address[];
  /** Ethereum addresses for contract interaction of nontokenized position */
  primaryAddress?: Address[];
  /** Pagination page number. Pages are of length 1000 */
  page?: number;
  /** Cursor for pagination. Pages are of length 1000 */
  cursor?: number;
}

/**
 * Parameters for routing to non-tokenized position.
 */
export interface RouteNonTokenizedParams {
  /** Chain ID of the network to execute the transaction on */
  chainId: number;
  /** Ethereum address of the wallet to send the transaction from */
  fromAddress: Address;
  /** Routing strategy to use (must be 'delegate') */
  routingStrategy: "delegate" | "delegate-legacy";
  /** Input tokens */
  tokenIn: Address[];
  /** Non-tokenized position to receive */
  positionOut: Address;
  /** Slippage in basis points */
  slippage?: Quantity;
  /** Fee in basis points */
  fee?: Quantity[];
  /** Fee receiver address */
  feeReceiver?: Address;
  /** Amount to send */
  amountIn: Quantity[];
  /** Receiver address */
  receiver: Address;
  /** Spender address */
  spender?: Address;
  /** Referral code that will be included in an on-chain event */
  referralCode?: string;
}

/**
 * Parameters for network queries.
 */
export interface NetworkParams {
  /** Name of the network to search for */
  name?: string;
  /** Chain ID of the network to search for */
  chainId?: string;
}

/**
 * Parameters for volume query.
 */
export interface VolumeParams {
  /** Chain ID of the network to search for */
  chainId: number;
}

/**
 * Pagination metadata.
 */
export interface PaginationMeta {
  /** Total amount of pages */
  total: number;
  /** Last page number */
  lastPage: number;
  /** Current page number */
  currentPage: number;
  /** Amount of elements per page */
  perPage: number;
  /** Previous page */
  prev: number | null;
  /** Next page */
  next: number | null;
  /** Cursor for pagination */
  cursor: number;
}

/**
 * Base paginated result type.
 */
interface PaginatedResult {
  /** Metadata for pagination */
  meta: PaginationMeta;
}
