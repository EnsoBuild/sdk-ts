// src/types/actions.ts - Updated types to match OpenAPI specification

import { Address, AmountInArgument, Quantity } from "../types";

/**
 * Route action using Enso's routing engine.
 */
export type RouteAction = {
  /** Protocol for the route */
  protocol: string;
  /** Action type */
  action: "route";
  /** Action arguments matching OpenAPI spec */
  args: {
    /** Input token address */
    tokenIn: Address;
    /** Output token address */
    tokenOut: Address;
    /** Amount to route */
    amountIn: AmountInArgument;
    /** Primary contract address (optional) */
    primaryAddress?: Address;
    /** Receiver address */
    receiver: Address;
    /** Optional slippage in basis points */
    slippage?: Quantity;
    /** Optional pool fee */
    poolFee?: Quantity;
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
    /** Token address to get balance for */
    tokenIn: Address;
  };
};

/**
 * Approve token spending.
 */
export type ApproveAction = {
  /** Action type */
  action: "approve";
  /** Protocol to approve for */
  protocol: string;
  /** Action arguments */
  args: {
    /** Token to approve */
    token: Address;
    /** Spender address */
    spender: Address;
    /** Amount to approve */
    amount: Quantity;
  };
};

/**
 * Borrow tokens from a lending protocol.
 */
export type BorrowAction = {
  /** Protocol to borrow from */
  protocol: string;
  /** Action type */
  action: "borrow";
  /** Action arguments */
  args: {
    /** Collateral token address */
    collateral: Address | Address[];
    /** Token to borrow */
    tokenOut: Address;
    /** Amount to borrow */
    amountOut: Quantity;
    /** Primary contract address */
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
 * Repay a loan to a lending protocol.
 */
export type RepayAction = {
  /** Action type */
  action: "repay";
  /** Protocol to repay to */
  protocol: string;
  /** Action arguments */
  args: {
    /** Token to repay with */
    tokenIn: Address;
    /** Amount to repay */
    amountIn: Quantity;
    /** Primary contract address */
    primaryAddress: Address;
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
 * Split action.
 */
export type SplitAction = {
  /** Action type */
  action: "split";
  /** Protocol to interact with */
  protocol: string;
  /** Action arguments */
  args: Record<string, any>;
};

/**
 * Merge action.
 */
export type MergeAction = {
  /** Action type */
  action: "merge";
  /** Protocol to interact with */
  protocol: string;
  /** Action arguments */
  args: Record<string, any>;
};

/**
 * Minimum amount out action.
 */
export type MinAmountOutAction = {
  /** Action type */
  action: "minAmountOut";
  /** Protocol to interact with */
  protocol: string;
  /** Action arguments */
  args: Record<string, any>;
};

/**
 * Slippage action.
 */
export type SlippageAction = {
  /** Action type */
  action: "slippage";
  /** Protocol to interact with */
  protocol: string;
  /** Action arguments */
  args: Record<string, any>;
};

/**
 * Fee action.
 */
export type FeeAction = {
  /** Action type */
  action: "fee";
  /** Protocol to interact with */
  protocol: string;
  /** Action arguments */
  args: Record<string, any>;
};

/**
 * Enso fee action.
 */
export type EnsoFeeAction = {
  /** Action type */
  action: "ensofee";
  /** Protocol to interact with */
  protocol: string;
  /** Action arguments */
  args: Record<string, any>;
};

/**
 * Deposit tokens to a protocol.
 */
export type DepositAction = {
  /** Protocol to deposit to */
  protocol: string;
  /** Action type */
  action: "deposit";
  /** Action arguments */
  args: {
    /** Input token(s) */
    tokenIn: Address | Address[];
    /** Output token(s) (optional) */
    tokenOut?: Address;
    /** Amount to deposit */
    amountIn: AmountInArgument | AmountInArgument[];
    /** Primary contract address */
    primaryAddress: Address;
    /** Optional recipient address */
    receiver?: Address;
  };
};

/**
 * Redeem tokens from a protocol.
 */
export type RedeemAction = {
  /** Protocol to redeem from */
  protocol: string;
  /** Action type */
  action: "redeem";
  /** Action arguments */
  args: {
    /** Input token address (optional) */
    tokenIn?: Address;
    /** Output token */
    tokenOut: Address | Address[];
    /** Amount to redeem */
    amountIn: AmountInArgument;
    /** Primary contract address */
    primaryAddress: Address;
    /** Optional recipient address */
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
  protocol: string;
  /** Action arguments */
  args: {
    /** Amount to bridge */
    amountIn: AmountInArgument;
    /** Input token address */
    tokenIn: Address;
    /** Primary contract address */
    primaryAddress: Address;
    /** Destination chain ID */
    destinationChainId: number;
    /** Receiver address on destination chain */
    receiver: Address;
    /** Optional callback data to execute on the destination chain */
    callbackData?: string;
    /** Optional callback execution gas costs */
    callbackGasLimit?: string;
    /** Optional fee to pay in native asset */
    bridgeFee?: Quantity;
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
    /** Amount of tokens to deposit */
    amountIn: [AmountInArgument, AmountInArgument];
    /** Input token addresses */
    tokenIn: [Address, Address];
    /** Output token address */
    tokenOut: Address;
    /** Ticks for the deposit */
    ticks: Quantity;
    /** Fee for the pool to deposit into */
    fee: [Quantity, Quantity];
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
    tokenOut: [Address, Address];
    /** Amount of liquidity to redeem */
    liquidity: AmountInArgument;
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
    amountIn: AmountInArgument;
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
    amountIn: AmountInArgument[];
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
    /** Input token address (optional) */
    tokenIn?: Address;
    /** Output token address */
    tokenOut: Address;
    /** Amount to redeem */
    amountIn: AmountInArgument;
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
    /** Input token address (optional) */
    tokenIn?: Address;
    /** Output token addresses */
    tokenOut: Address[];
    /** Amount to redeem */
    amountIn: AmountInArgument;
    /** Primary contract address */
    primaryAddress: Address;
    /** Optional receiver address */
    receiver?: Address;
  };
};

/**
 * Transfer tokens to another address.
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
    /** Amount to transfer */
    amount: AmountInArgument;
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
    amount: AmountInArgument;
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
    amountIn: AmountInArgument;
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
    amountIn: AmountInArgument[];
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
    amountIn: AmountInArgument;
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
    amountIn: AmountInArgument;
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
    amountIn: AmountInArgument;
    /** Primary contract address */
    primaryAddress: Address;
    /** Optional receiver address */
    receiver?: Address;
  };
};

/**
 * Swap tokens action.
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
    /** Amount to deposit */
    amountIn: AmountInArgument;
    /** Primary contract address */
    primaryAddress?: Address;
    /** Receiver address */
    receiver: Address;
    /** Optional slippage in basis points */
    slippage?: Quantity;
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
    /** Token(s) to approve */
    token: Address | Address[];
    /** Amount(s) to approve */
    amount: Quantity | Quantity[];
    /** Address to transfer from */
    sender: Address;
    /** Address to transfer to */
    receiver: Address;
    /** Permit nonce */
    nonce: string;
    /** Permit deadline */
    deadline: string;
    /** Permit signature */
    signature: string;
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