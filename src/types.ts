export type RoutingStrategy = "router" | "delegate" | "ensowallet";

// consider importing from shared if more types come
export type Address = `0x${string}`;

export type MultiAddress = Address | Address[];

export type RouteParams = {
  fromAddress: Address;
  receiver: Address;
  spender: Address;
  chainId: number;
  amountIn: string;
  slippage?: number; // Slippage in basis points (1/10000). If specified, minAmountOut should not be specified
  minAmountOut?: string;
  tokenIn: Address;
  tokenOut: Address;
  routingStrategy?: RoutingStrategy;
  fee?: number; // Fee in basis points (1/10000) for each amountIn value. Must be in range 0-100. If specified, this percentage of each amountIn value will be sent to feeReceiver
  feeReceiver?: Address;
};

export type RouteSegment = {
  action: string;
  protocol: string;
  primary?: Address;
  tokenIn: Address[];
  tokenOut: Address[];
  positionInId?: string[];
  positionOutId?: string[];
  internalRoutes?: RouteSegment[][];
};

export type RouteData = {
  route: RouteSegment[];
  gas: number; // Estimated gas used by the transaction. Increase by 50% as a buffer.
  amountOut: number; // Estimated amount received.
  priceImpact: number | null; // Price impact in basis points, null if USD price not found.
  createdAt: number; // Block number the transaction was created on.
  tx: {
    data: string;
    to: Address;
    from: Address;
    value: string;
  };
  feeAmount: {
    [key: string]: number; // Collected fee amounts for each amountIn input.
  }[];
};

export type ApproveParams = {
  fromAddress: Address;
  tokenAddress: Address;
  chainId: number;
  amount: string;
  routingStrategy?: RoutingStrategy;
};

export type ApproveData = {
  amount: string;
  gas: string;
  spender: Address;
  token: Address;
  tx: {
    data: string;
    from: Address;
    to: Address;
  };
};

export type QuoteParams = Omit<
  RouteParams,
  "spender" | "receiver" | "slippage"
>;

export type QuoteData = {
  amountOut: string;
  gas: string;
  priceImpact: number;
};

export type BalanceParams = {
  chainId: number;
  eoaAddress: Address;
  useEoa?: boolean;
};

export type BalanceData = {
  amount: string;
  decimals: number;
  token: Address;
  price: string;
};

export type TokenParams = {
  address?: MultiAddress;
  underlyingTokens?: MultiAddress;
  underlyingTokensExact?: MultiAddress;
  apy?: number;
  tvl?: number;
  protocolSlug?: string;
  type?: "defi" | "base";
  includeMetadata?: boolean;
  chainId: number;
};

export type Token = {
  address: Address;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  logosUri: string[];
  type: "defi" | "base";
};

// put above object into type
export type TokenData = Token & {
  protocolSlug: string;
  underlyingTokens: Token[];
  primaryAddress: Address;
  apy: number | null;
  tvl: number | null;
};

export type PriceParams = {
  chainId: number;
  address: Address;
};

export type PriceData = {
  price: string; // 3614.8
  decimals: number; // 18
  symbol: string;
  timestamp: number;
  confidence: number; // 0.99 means 99% confidence
};

export type ProtocolParams = {
  slug?: string;
};

export type ProtocolData = {
  chains: { name: string; id: number }[];
  name: string | null;
  description: string | null;
  slug: string;
  url: string;
  logosUri: string[];
};

type AmountInArgument =
  | string
  | {
      useOutputOfCallAt: number;
      index?: number;
    };

export type BundleParams = {
  chainId: number;
  fromAddress: Address;
  routingStrategy?: RoutingStrategy;
  receiver?: Address;
  spender?: Address;
};

export enum BundleActionType {
  Swap = "swap",
  Transfer = "transfer",
  Bridge = "bridge",
  Deposit = "deposit",
  DepositCLMM = "depositclmm",
  Redeem = "redeem",
  RedeemCLMM = "redeemclmm",
  Route = "route",
  Balance = "balance",
}

export type DepositAction = {
  action: BundleActionType.Deposit;
  args: {
    amountIn: AmountInArgument;
    tokenIn: Address;
    tokenOut: Address;
  };
};

export type DepositCLMMAction = {
  action: BundleActionType.DepositCLMM;
  args: {
    amountIn: [AmountInArgument, AmountInArgument];
    tokenIn: [Address, Address];
    tokenOut: Address;
    tickLower: string;
    tickUpper: string;
  };
};

export type RouteAction = {
  protocol: "enso";
  action: BundleActionType.Route;
  args: {
    amountIn: AmountInArgument;
    tokenIn: Address;
    tokenOut: Address;
  };
};

export type BridgeAction = {
  action: BundleActionType.Bridge;
  args: {
    receiver: Address;
    primaryAddress: Address;
    amountIn: AmountInArgument;
    tokenIn: Address;
    destinationChainId: number;
    callback: any[];
  };
};

export type BalanceAction = {
  protocol: "enso";
  action: BundleActionType.Balance;
  args: {
    tokenIn: Address;
  };
};

export type TransferAction = {
  protocol: "enso";
  action: BundleActionType.Transfer;
  args: {
    tokenIn: Address;
    amountIn: AmountInArgument;
    receiver?: Address;
  };
};

export type BundleAction = {
  protocol: string;
} & (
  | DepositAction
  | DepositCLMMAction
  | RouteAction
  | BridgeAction
  | BalanceAction
  | TransferAction
);

export type BundleData = {
  bundle: BundleAction[];
  gas: string;
  createdAt: number;
  tx: {
    data: string;
    to: Address;
    from: Address;
    value: string;
  };
};
