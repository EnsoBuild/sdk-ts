// API v2: typed assets, positions and per-action outputs. Mirrors the API's v2 response schema.
import type {
  Address,
  BundleData,
  BundleParams,
  PreTransaction,
} from "./types";

export enum AssetType {
  Native = "native",
  ERC20 = "erc20",
  ERC721 = "erc721",
  ERC1155 = "erc1155",
}
export type AssetKind = `${AssetType}`;
/** Amounts and token ids are decimal strings. */
export type AssetAmount =
  | { type: "native"; address: Address; amount: string }
  | { type: "erc20"; address: Address; amount: string }
  | { type: "erc721"; address: Address; tokenId: string }
  | { type: "erc1155"; address: Address; tokenId: string; amount: string };

export enum AssetOutputCategory {
  Receipt = "receipt",
  Reward = "reward",
  Withdrawal = "withdrawal",
  Borrow = "borrow",
  Refund = "refund",
  Transfer = "transfer",
  Swap = "swap",
}
export enum MeasurementCoverage {
  Complete = "complete",
  Partial = "partial",
  NotMeasured = "notMeasured",
  NotApplicable = "notApplicable",
}
export enum AssetTransferability {
  Restricted = "restricted",
  Unknown = "unknown",
}

/** An asset that reached an account outside the executor. */
export type AssetReceipt = AssetAmount & {
  chainId: number;
  recipient: Address;
  category?: AssetOutputCategory;
  labels?: string[];
  /** Index into `positions` of the position this asset came from. */
  positionIndex?: number;
  transferability?: AssetTransferability;
};
/** Values before and after the whole transaction; absent when a read failed. */
export type ScalarChange = { before?: string; after?: string; delta?: string };
export type PositionMetric = "liquidity" | "collateral" | "debt" | "earmarked";
export type PositionMeasurement = ScalarChange & {
  metric: Exclude<PositionMetric, "debt">;
  /** Absent for protocol units (CLMM liquidity). */
  unit?: { type: "erc20"; address: Address };
};
export type PositionDebt = ScalarChange & {
  asset: { type: "erc20"; address: Address };
};
/** How the position is held: an ERC-20 receipt, an NFT, or a ledger entry without a token. */
export type PositionReceipt = "erc20" | "erc721" | "none";
export type PositionResult = {
  chainId: number;
  receipt: PositionReceipt;
  protocol?: string;
  /** Listed market identity (`positionId`); never an NFT id. */
  positionId?: string;
  account?: Address;
  asset?:
    | { type: "erc721"; address: Address; tokenId: string }
    | { type: "erc20"; address: Address };
  /** An NFT position's owner around the transaction; null when the token does not exist (minted after, burned before). */
  owner?: { before?: Address | null; after?: Address | null };
  measurements?: PositionMeasurement[];
  debts?: PositionDebt[];
  coverage?: {
    measurements?: MeasurementCoverage;
    rewards?: MeasurementCoverage;
  };
};
/** One requested action's gross outputs (`includeActionOutputs`). */
export type ActionResult = {
  chainId: number;
  /** Index path of the action in the request (callbacks nest). */
  path: number[];
  protocol: string;
  action: string;
  values?: Record<string, string>;
  assetsOut: AssetReceipt[];
  positionIndexes: number[];
};
/** A minimum enforced on chain for one fungible asset at one account. */
export type MinAssetOut = Extract<AssetAmount, { type: "native" | "erc20" }> & {
  chainId: number;
  recipient: Address;
};

export type RoutingStrategyV2 = "router" | "ensowallet-v2" | "delegate";

/** Same query as v1 bundles; v2 is single-chain and drops the legacy strategies. */
export type BundleParamsV2 = Omit<BundleParams, "routingStrategy"> & {
  routingStrategy?: RoutingStrategyV2;
  /** Per requested action outputs in `actionOutputs`. */
  includeActionOutputs?: boolean;
};
export type PreTransactionV2 = PreTransaction & {
  assetType?: AssetKind;
  /** ERC-721 id of an NFT approval. */
  tokenId?: string;
};
/** Typed results replace `amountsOut`, `minAmountsOut`, `approvals` and `bridgingEstimates`. */
export type BundleDataV2 = Omit<
  BundleData,
  | "amountsOut"
  | "minAmountsOut"
  | "approvals"
  | "bridgingEstimates"
  | "preTransactions"
> & {
  preTransactions?: PreTransactionV2[];
  minAssetsOut: MinAssetOut[];
  assetsOut: AssetReceipt[];
  positions: PositionResult[];
  actionOutputs?: ActionResult[];
};

/** A request asset; the API resolves an omitted `type` and refuses a wrong one. */
export type AssetInput =
  | { type?: "native" | "erc20"; address: Address; amount: string }
  | { type?: "erc721"; address: Address; tokenId: string };

/** Which position a request acts on. */
export type PositionReference =
  /** A listed market (ERC-20 receipt, receiptless, or an NFT market with an optional held id). */
  | {
      protocol: string;
      positionId: string;
      collection?: Address;
      tokenId?: string;
      poolAddress?: never;
    }
  /** A held NFT. */
  | {
      protocol: string;
      collection: Address;
      tokenId: string;
      positionId?: string;
      poolAddress?: never;
    }
  /** A new CLMM range: a V3-fork `poolAddress`, or V4 pool-key `args` (`poolFee`, `tickSpacing`, `hook`). */
  | {
      protocol: string;
      collection: Address;
      poolAddress?: Address;
      positionId?: never;
      tokenId?: never;
    };

export type PositionAction =
  "deposit" | "borrow" | "repay" | "redeem" | "depositclmm" | "redeemclmm";

export type PositionRouteRequest = {
  chainId: number;
  fromAddress: Address;
  routingStrategy: RoutingStrategyV2;
  action: PositionAction;
  position: PositionReference;
  assetsIn: AssetInput[];
  receiver?: Address;
  refundReceiver?: Address;
  onBehalfOf?: Address;
  /** Requested fungible withdrawals or borrowed tokens. */
  tokensOut?: Address[];
  /** On-chain minimums keyed by fungible output address. */
  minAmountsOut?: Record<Address, string>;
  /** Action arguments (e.g. `amountOut`, `ticks`, `liquidity`); identity keys are refused. */
  args?: Record<string, unknown>;
  includeActionOutputs?: boolean;
};
/** The v2 bundle response; positions carry their market identity and receipt class. */
export type PositionRouteData = BundleDataV2;
