// src/types/actions.ts - Updated to match OpenAPI specification

import { Address, BytesArg, Quantity } from "./types";

/**
 * Route action using Enso's routing engine.
 */
export type RouteAction = {
  /** Must be 'enso' for route actions */
  protocol: "enso";
  /** Action type */
  action: "route";
  /** Action arguments matching OpenAPI spec */
  args: {
    /** Input token address */
    tokenIn: Address;
    /** Output token address */
    tokenOut: Address;
    /** Amount to route in wei (with full decimals) */
    amountIn: ActionOutputReference<Quantity>;
    /** Slippage tolerance in basis points (100 = 1%) */
    slippage?: Quantity;
    /** Address to receive the output tokens if not the caller */
    receiver?: Address;
    /** Optional address of the router or primary contract to use */
    primaryAddress?: Address;
    /** Optional pool fee in basis points when using specific pools */
    poolFee?: Quantity;
    /** The minimum amount out */
    minAmountOut?: Quantity;
    /** The fee in basis points */
    fee?: Quantity;
    /** Fee receiver */
    feeReceiver?: Address;
    /** A list of aggregators to be ignored from consideration */
    ignoreAggregators?: string[];
    /** A list of standards to be ignored from consideration */
    ignoreStandards?: string[];
  };
};

/**
 * Get balance of a token.
 */
export type BalanceAction = {
  /** Must be 'enso' for balance actions */
  protocol: "enso";
  /** Action type */
  action: "balance";
  /** Action arguments */
  args: {
    /** Address of the token to check balance */
    token: Address;
  };
};

/**
 *  Approve token spending.
 */
export type ApproveAction = {
  /** Protocol to approve for */
  protocol: "erc20";
  /** Action type */
  action: "approve";
  /** Action arguments */
  args: {
    /** Token to approve */
    token: Address;
    /** Spender address (protocol or router) */
    spender: Address;
    /** Amount to approve in wei (with full decimals) */
    amount: ActionOutputReference<Quantity>;
    /** Routing strategy must be router */
    routingStrategy?: "router";
  };
};

/**
 *  Borrow tokens from a lending protocol.
 */
export type BorrowAction = {
  /** Protocol to borrow from */
  protocol: string;
  /** Action type */
  action: "borrow";
  /** Action arguments */
  args: {
    /** Collateral token address(es) */
    collateral: Address | Address[];
    /** Token to borrow */
    tokenOut: Address;
    /** Amount to borrow in wei (with full decimals) */
    amountOut: ActionOutputReference<Quantity>;
    /** Address of the lending pool contract */
    primaryAddress: Address;
  };
};

/**
 * Harvest rewards from a protocol.
 */
export type HarvestAction = {
  /** Action type */
  action: "harvest";
  /** Protocol to harvest from */
  protocol: string;
  /** Action arguments */
  args: {
    /** Token to harvest */
    token: Address;
    /** Primary contract address */
    primaryAddress: Address;
  };
};

/**
 *  Repay a loan to a lending protocol.
 */
export type RepayAction = {
  /** Protocol to repay to */
  protocol: string;
  /** Action type */
  action: "repay";
  /** Action arguments */
  args: {
    /** Token to repay with */
    tokenIn: Address;
    /** Amount to repay in wei (with full decimals) */
    amountIn: ActionOutputReference<Quantity>;
    /** Address of the lending pool contract */
    primaryAddress: Address;
    /** The address of the user whose debt is being repaid" */
    onBehalfOf?: Address;
  };
};

/**
 * Call arbitrary contract method.
 */
export type CallAction = {
  /** Action type */
  action: "call";
  /** Protocol to interact with */
  protocol: string;
  /** Action arguments */
  args: {
    /** Contract address to call */
    address: Address;
    /** Method to call */
    method: string;
    /** ABI of the method */
    abi: string;
    /** Arguments for the method */
    args: any[];
  };
};

/**
 * Splits an amount into multiple parts based on specified percentages.
 *
 */
export type SplitAction = {
  /** Must be 'enso' for split actions */
  protocol: "enso";
  /** Action type */
  action: "split";
  /** Action arguments */
  args: {
    /** The token to split */
    tokenIn: Address;
    tokenOut: Address[];
    amountIn: ActionOutputReference<Quantity>;
    receiver?: Address;
  };
};

/**
 * Merge multiple token inputs into a single output.
 */
export type MergeAction = {
  /** Must be 'enso' for merge actions */
  protocol: "enso";
  /** Action type */
  action: "merge";
  /** Action arguments */
  args: {
    /** Address of token to input */
    tokenIn: Address[];
    /** Address of token to receive */
    tokenOut: Address;
    /** The amount to send */
    amountIn: ActionOutputReference<Quantity>[];
    /** The receiver account */
    receiver?: Address;
  };
};

/**
 * Minimum amount out action - provides slippage protection with `minAmountOut` as threshold.
 */
export type MinAmountOutAction = {
  /** Must be 'enso' for minAmountOut actions */
  protocol: "enso";
  /** Action type */
  action: "minamountout";
  /** Action arguments */
  args: {
    /** Expected output amount in wei (with full decimals) */
    amountOut: StrictOutputReference<Quantity>;
    /** Minimum acceptable amount */
    minAmountOut: ActionOutputReference<Quantity>;
  };
};

/**
 *  Slippage action.
 */
export type SlippageAction = {
  /** Must be 'enso' for slippage actions */
  protocol: "enso";
  /** Action type */
  action: "slippage";
  /** Action arguments */
  args: {
    /** Maximum acceptable slippage in basis points (1 bps = 0.01%, 100 bps = 1%) */
    bps: Quantity;
    /** Expected output amount (with full decimals) or a return value from a previous action */
    amountOut: StrictOutputReference<Quantity>;
  };
};

export type ActionOutputReference<T> = T | StrictOutputReference<T>;

export type StrictOutputReference<T> = {
  useOutputOfCallAt: number;
  index?: number;
};

/**
 * Fee action - calculates and deducts a fee from a specified amount.
 */
export type FeeAction = {
  /** Must be 'enso' for fee actions */
  protocol: "enso";
  /** Action type */
  action: "fee";
  /** Action arguments */
  args: {
    /** Token address to apply the fee to */
    token: Address;
    /** Amount to apply the fee to (with full decimals) */
    amount: ActionOutputReference<Quantity>;
    /** Fee percentage in basis points (1 bps = 0.01%, 100 bps = 1%) */
    bps: Quantity;
    /** Address to receive the fee */
    receiver: Address;
  };
};

/**
 *  Enso fee action.
 */
export type EnsoFeeAction = {
  /** Must be 'enso' for ensofee actions */
  protocol: "enso";
  /** Action type */
  action: "ensofee";
  /** Action arguments */
  args: {
    /** Token address to apply the fee to */
    token: Address;
    /** Amount to apply the fee to (with full decimals) */
    amount: ActionOutputReference<Quantity>;
    /** Fee percentage in basis points (1 bps = 0.01%, 100 bps = 1%) */
    bps: Quantity;
  };
};

/**
 *  Deposit tokens to a protocol.
 */
export type DepositAction = {
  /** Protocol to deposit to */
  protocol: string;
  /** Action type */
  action: "deposit";
  /** Action arguments */
  args: {
    /** Input token(s) - can be single address or array for multiple tokens */
    tokenIn: Address | Address[];
    /** Output token(s) - can be single address or array for multiple tokens */
    tokenOut?: Address | Address[];
    /** Amount to deposit - can be single value or array for multiple tokens */
    amountIn:
      | ActionOutputReference<Quantity>
      | ActionOutputReference<Quantity>[];
    /** Address of the protocol contract to interact with */
    primaryAddress: Address;
    /** Address to receive the output tokens if not the caller */
    receiver?: Address;
  };
};

/**
 *  Redeem tokens from a protocol.
 */
export type RedeemAction = {
  /** Protocol to redeem from */
  protocol: string;
  /** Action type */
  action: "redeem";
  /** Action arguments */
  args: {
    /** Input token address (shares/tokens to redeem) */
    tokenIn?: Address;
    /** Output token(s) - can be single address or array for multiple tokens */
    tokenOut: Address | Address[];
    /** Amount to redeem in wei (with full decimals) */
    amountIn: ActionOutputReference<Quantity>;
    /** Address of the contract to interact with */
    primaryAddress: Address;
    /** Address to receive the output tokens if not the caller */
    receiver?: Address;
  };
};

/**
 * Bridge tokens across chains.
 */
export type BridgeAction = {
  /** Action type */
  action: "bridge";
  /** Protocol to use for bridging */
  protocol: "stargate";
  /** Action arguments */
  args: {
    /** Input token address */
    tokenIn: Address;
    /** Amount to bridge */
    amountIn: ActionOutputReference<Quantity>;
    /** Primary contract address (bridging protocol) */
    primaryAddress: Address;
    /** Destination chain ID */
    destinationChainId: number;
    /** Receiver address on destination chain */
    receiver: Address;
    /** Optional callback data to execute on the destination chain. The callback bundle MUST start with a balance action */
    callback?: BundleAction[];
    /** Optional callback execution gas costs */
    callbackGasLimit?: string;
    /** Optional fee to pay in native asset */
    bridgeFee?: string;
  };
};

/**
 * Deposit into a Concentrated Liquidity Market Maker (CLMM) position.
 */
export type DepositCLMMAction = {
  /** Protocol to deposit to */
  protocol: string;
  /** Action type */
  action: "depositclmm";
  /** Action arguments */
  args: {
    /** Input token addresses */
    tokenIn: Address[];
    /** Output token address */
    tokenOut: Address;
    /** Amount of tokens to deposit */
    amountIn: ActionOutputReference<Quantity>[];
    /** Ticks for the deposit */
    ticks: Quantity[];
    /** Fee for the pool to deposit into */
    poolFee: Quantity;
    /** Optional receiver address */
    receiver?: Address;
  };
};

/**
 * Redeem from a CLMM position.
 */
export type RedeemCLMMAction = {
  /** Protocol to redeem from */
  protocol: string;
  /** Action type */
  action: "redeemclmm";
  /** Action arguments */
  args: {
    /** Input token address to redeem */
    tokenIn: Address;
    /** Output token addresses to receive */
    tokenOut: Address[];
    /** Amount of liquidity to redeem */
    liquidity: ActionOutputReference<Quantity>;
    /** Token ID of the NFT position */
    tokenId: string;
    /** Optional receiver address */
    receiver?: Address;
  };
};

/**
 * Tokenized single deposit action.
 */
export type TokenizedSingleDepositAction = {
  /** Protocol to deposit to */
  protocol: string;
  /** Action type */
  action: "tokenizedsingledeposit";
  /** Action arguments */
  args: {
    /** Input token address */
    tokenIn: Address;
    /** Output token address (required) */
    tokenOut: Address;
    /** Amount to deposit */
    amountIn: ActionOutputReference<Quantity>;
    /** Primary contract address */
    primaryAddress: Address;
    /** Optional receiver address */
    receiver?: Address;
  };
};

/**
 * Tokenized multi deposit action.
 */
export type TokenizedMultiDepositAction = {
  /** Protocol to deposit to */
  protocol: string;
  /** Action type */
  action: "tokenizedmultideposit";
  /** Action arguments */
  args: {
    /** Input token addresses */
    tokenIn: Address[];
    /** Output token address (required) */
    tokenOut: Address;
    /** Amounts to deposit */
    amountIn: ActionOutputReference<Quantity>[];
    /** Primary contract address */
    primaryAddress: Address;
    /** Optional receiver address */
    receiver?: Address;
  };
};

/**
 * Tokenized single redeem action.
 */
export type TokenizedSingleRedeemAction = {
  /** Protocol to redeem from */
  protocol: string;
  /** Action type */
  action: "tokenizedsingleredeem";
  /** Action arguments */
  args: {
    /** Input token address */
    tokenIn: Address;
    /** Output token address */
    tokenOut: Address;
    /** Amount to redeem */
    amountIn: ActionOutputReference<Quantity>;
    /** Primary contract address */
    primaryAddress: Address;
    /** Optional receiver address */
    receiver?: Address;
  };
};

/**
 * Tokenized multi redeem action.
 */
export type TokenizedMultiRedeemAction = {
  /** Protocol to redeem from */
  protocol: string;
  /** Action type */
  action: "tokenizedmultiredeem";
  /** Action arguments */
  args: {
    /** Input token address */
    tokenIn: Address;
    /** Output token addresses */
    tokenOut: Address[];
    /** Amount to redeem */
    amountIn: ActionOutputReference<Quantity>;
    /** Primary contract address */
    primaryAddress: Address;
    /** Optional receiver address */
    receiver?: Address;
  };
};

/**
 *  Transfer tokens to another address.
 */
export type TransferAction = {
  /** Protocol to use for transfer */
  protocol: string;
  /** Action type */
  action: "transfer";
  /** Action arguments */
  args: {
    /** Token to transfer */
    token: Address;
    /** Amount to transfer in wei (with full decimals) */
    amount: ActionOutputReference<Quantity>;
    /** Address to transfer to */
    receiver: Address;
    /** Optional ERC721 or ERC1155 token ID */
    id?: string;
  };
};

/**
 * Transfer tokens from another address.
 */
export type TransferFromAction = {
  /** Action type */
  action: "transferfrom";
  /** Protocol to use */
  protocol: string;
  /** Action arguments */
  args: {
    /** Token to transfer */
    token: Address;
    /** Address to transfer from */
    sender: Address;
    /** Address to transfer to */
    receiver: Address;
    /** Amount to transfer */
    amount: ActionOutputReference<Quantity>;
    /** Optional ERC721 or ERC1155 token ID */
    id?: string;
  };
};

/**
 * Single deposit action (deprecated, use `deposit` instead).
 */
export type SingleDepositAction = {
  /** Protocol to deposit to */
  protocol: string;
  /** Action type */
  action: "singledeposit";
  /** Action arguments */
  args: {
    /** Input token address */
    tokenIn: Address;
    /** Output token address (optional) */
    tokenOut?: Address;
    /** Amount to deposit */
    amountIn: ActionOutputReference<Quantity>;
    /** Primary contract address */
    primaryAddress: Address;
    /** Optional receiver address */
    receiver?: Address;
  };
};

/**
 * Multi deposit action (deprecated, use `deposit` instead).
 */
export type MultiDepositAction = {
  /** Protocol to deposit to */
  protocol: string;
  /** Action type */
  action: "multideposit";
  /** Action arguments */
  args: {
    /** Input token addresses */
    tokenIn: Address[];
    /** Output token address (optional) */
    tokenOut?: Address;
    /** Amounts to deposit */
    amountIn: ActionOutputReference<Quantity>[];
    /** Primary contract address */
    primaryAddress: Address;
    /** Optional receiver address */
    receiver?: Address;
  };
};

/**
 * Single redeem action (deprecated, use `redeem` instead).
 */
export type SingleRedeemAction = {
  /** Protocol to redeem from */
  protocol: string;
  /** Action type */
  action: "singleredeem";
  /** Action arguments */
  args: {
    /** Input token address (optional) */
    tokenIn?: Address;
    /** Output token address */
    tokenOut: Address;
    /** Amount to redeem */
    amountIn: ActionOutputReference<Quantity>;
    /** Primary contract address */
    primaryAddress: Address;
    /** Optional receiver address */
    receiver?: Address;
  };
};

/**
 * Multi redeem action (deprecated, use `redeem` instead).
 */
export type MultiRedeemAction = {
  /** Protocol to redeem from */
  protocol: string;
  /** Action type */
  action: "multiredeem";
  /** Action arguments */
  args: {
    /** Input token address (optional) */
    tokenIn?: Address;
    /** Output token addresses */
    tokenOut: Address[];
    /** Amount to redeem */
    amountIn: ActionOutputReference<Quantity>;
    /** Primary contract address */
    primaryAddress: Address;
    /** Optional receiver address */
    receiver?: Address;
  };
};

/**
 * Multi-output single deposit action.
 */
export type MultiOutSingleDepositAction = {
  /** Protocol to deposit to */
  protocol: string;
  /** Action type */
  action: "multioutsingledeposit";
  /** Action arguments */
  args: {
    /** Input token address */
    tokenIn: Address;
    /** Output token addresses */
    tokenOut: Address[];
    /** Amount to deposit */
    amountIn: ActionOutputReference<Quantity>;
    /** Primary contract address */
    primaryAddress: Address;
    /** Optional receiver address */
    receiver?: Address;
  };
};

/**
 *  Swap tokens action.
 */
export type SwapAction = {
  /** Protocol for the swap */
  protocol: string;
  /** Action type */
  action: "swap";
  /** Action arguments */
  args: {
    /** Input token address */
    tokenIn: Address;
    /** Output token address */
    tokenOut: Address;
    /** Amount to swap in wei (with full decimals) */
    amountIn: ActionOutputReference<Quantity>;
    /** Address of the router or pool contract */
    primaryAddress?: Address;
    /** Address to receive the output tokens */
    receiver: Address;
    /** Slippage tolerance in basis points (100 = 1%) */
    slippage?: Quantity;
    /** Optional pool fee in basis points when using specific pools */
    poolFee?: Quantity;
  };
};

/**
 * Permit and transfer tokens from another address.
 */
export type PermitTransferFromAction = {
  /** Protocol to use */
  protocol: string;
  /** Action type */
  action: "permittransferfrom";
  /** Action arguments */
  args: {
    /** Token(s) to transfer */
    token: Address | Address[];
    /** Amount(s) to transfer */
    amount: ActionOutputReference<Quantity> | ActionOutputReference<Quantity>[];
    /** Address to transfer from */
    sender: Address;
    /** Address to transfer to */
    receiver: Address;
    /** Nonce value to prevent signature replay */
    nonce: Quantity;
    /** Timestamp after which the signature is invalid */
    deadline: Quantity;
    /** The EIP-2612 permit signature */
    signature: BytesArg;
  };
};

/**
 * Union type of all possible bundle actions.
 */
export type BundleAction =
  | DepositAction
  | DepositCLMMAction
  | RouteAction
  | BridgeAction
  | BalanceAction
  | TransferAction
  | RedeemAction
  | ApproveAction
  | BorrowAction
  | SingleDepositAction
  | MultiDepositAction
  | TokenizedSingleDepositAction
  | TokenizedMultiDepositAction
  | MultiOutSingleDepositAction
  | HarvestAction
  | PermitTransferFromAction
  | SingleRedeemAction
  | MultiRedeemAction
  | TokenizedSingleRedeemAction
  | TokenizedMultiRedeemAction
  | RedeemCLMMAction
  | RepayAction
  | SwapAction
  | TransferFromAction
  | CallAction
  | SplitAction
  | MergeAction
  | MinAmountOutAction
  | SlippageAction
  | FeeAction
  | EnsoFeeAction;
