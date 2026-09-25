import { Address, BytesArg, Quantity } from "./types";

export type StrictOutputReference = {
  /** Index of the previous action whose return value should be used. */
  useOutputOfCallAt: number;
  /** Return-value index for actions that return multiple values. */
  index?: number;
};

/** A literal value or a reference to a previous bundle action output. */
export type ActionOutputReference<T> = T | StrictOutputReference;
/** Token amount in base units, or a reference to a previous output amount. */
export type AmountArg = ActionOutputReference<Quantity>;
/** Extra protocol-specific arguments forwarded by standards metadata. */
export type ExtraArgs = Record<
  string,
  string | ActionOutputReference<Quantity>
>;

type ProtocolAction<
  TAction extends string,
  TArgs,
  TProtocol extends string = string,
> = {
  protocol: TProtocol;
  action: TAction;
  args: TArgs;
};

type EnsoAction<TAction extends string, TArgs> = {
  protocol: "enso";
  action: TAction;
  args: TArgs;
};

type WithOptionalPositionId = {
  positionId?: string;
};

type WithOptionalTokenId = {
  tokenId?: Quantity;
};

type WithReceiver = {
  receiver?: Address;
};

type WithOnBehalfOf = {
  onBehalfOf?: Address;
};

type WithArgs = {
  args?: ExtraArgs;
};

type SingleTokenInAmount = {
  tokenIn: Address;
  amountIn: AmountArg;
};

type MultiTokenInAmount = {
  tokenIn: Address[];
  amountIn: AmountArg[];
};

type BorrowArgs = WithReceiver &
  WithOnBehalfOf &
  WithOptionalPositionId &
  WithOptionalTokenId &
  WithArgs & {
    collateral?: Address | Address[];
    tokenOut: Address;
    amountOut: AmountArg;
    primaryAddress: Address;
  };

export type BorrowAction = ProtocolAction<"borrow", BorrowArgs>;

type DepositArgs = WithReceiver &
  WithOnBehalfOf &
  WithOptionalPositionId &
  WithOptionalTokenId &
  WithArgs & {
    tokenIn: Address | Address[];
    tokenOut?: Address | Address[];
    amountIn: AmountArg | AmountArg[];
    primaryAddress: Address;
  };

type SingleDepositArgs = Omit<
  DepositArgs,
  "tokenIn" | "amountIn" | "positionId" | "tokenId"
> &
  SingleTokenInAmount;

type MultiDepositArgs = Omit<
  DepositArgs,
  "tokenIn" | "amountIn" | "positionId" | "tokenId"
> &
  MultiTokenInAmount;

export type DepositAction = ProtocolAction<"deposit", DepositArgs>;
export type SingleDepositAction = ProtocolAction<
  "singledeposit",
  SingleDepositArgs
>;
export type MultiDepositAction = ProtocolAction<
  "multideposit",
  MultiDepositArgs
>;
export type TokenizedSingleDepositAction = ProtocolAction<
  "tokenizedsingledeposit",
  SingleDepositArgs & { tokenOut: Address }
>;
export type TokenizedMultiDepositAction = ProtocolAction<
  "tokenizedmultideposit",
  MultiDepositArgs & { tokenOut: Address }
>;
export type MultiOutSingleDepositAction = ProtocolAction<
  "multioutsingledeposit",
  Omit<SingleDepositArgs, "tokenOut"> & { tokenOut: Address[] }
>;
export type DepositCLMMAction = ProtocolAction<
  "depositclmm",
  WithReceiver & {
    tokenIn: Address[];
    tokenOut: Address;
    amountIn: AmountArg[];
    /** Lower and upper ticks for the concentrated liquidity position. */
    ticks: [Quantity, Quantity] | Quantity[];
    poolFee?: Quantity;
    /** Tick spacing for CLMMs that derive pools from spacing rather than fee. */
    tickSpacing?: Quantity;
    /** Hook contract for hook-enabled CLMMs. */
    hook?: Address;
  }
>;

type RedeemArgs = WithReceiver &
  WithOnBehalfOf &
  WithOptionalPositionId &
  WithOptionalTokenId &
  WithArgs & {
    tokenIn?: Address;
    tokenOut: Address | Address[];
    amountIn: AmountArg;
    primaryAddress: Address;
  };

type SingleRedeemArgs = Omit<
  RedeemArgs,
  "tokenOut" | "positionId" | "tokenId"
> & {
  tokenOut: Address;
};

type MultiRedeemArgs = Omit<
  RedeemArgs,
  "tokenOut" | "positionId" | "tokenId"
> & {
  tokenOut: Address[];
};

export type RedeemAction = ProtocolAction<"redeem", RedeemArgs>;
export type SingleRedeemAction = ProtocolAction<
  "singleredeem",
  SingleRedeemArgs
>;
export type MultiRedeemAction = ProtocolAction<"multiredeem", MultiRedeemArgs>;
export type TokenizedSingleRedeemAction = ProtocolAction<
  "tokenizedsingleredeem",
  SingleRedeemArgs & { tokenIn: Address }
>;
export type TokenizedMultiRedeemAction = ProtocolAction<
  "tokenizedmultiredeem",
  MultiRedeemArgs & { tokenIn: Address }
>;
export type RedeemCLMMAction = ProtocolAction<
  "redeemclmm",
  WithReceiver & {
    tokenIn: Address;
    tokenOut: Address[];
    /** Liquidity amount to remove from the CLMM position. */
    liquidity: AmountArg;
    tokenId: Quantity;
  }
>;

type RepayArgs = WithOnBehalfOf &
  WithOptionalPositionId &
  WithOptionalTokenId &
  WithArgs & {
    tokenIn: Address;
    amountIn: AmountArg;
    primaryAddress: Address;
  };

export type RepayAction = ProtocolAction<"repay", RepayArgs>;

type WithdrawArgs = WithReceiver &
  WithOnBehalfOf &
  WithOptionalPositionId &
  WithArgs & {
    tokenOut: Address | Address[];
    amountOut: AmountArg | AmountArg[];
    primaryAddress: Address;
  };

export type WithdrawAction = ProtocolAction<"withdraw", WithdrawArgs>;
export type SingleWithdrawAction = ProtocolAction<
  "singlewithdraw",
  WithdrawArgs
>;
export type SingleWithdrawWithPositionIdAction = ProtocolAction<
  "singlewithdrawwithpositionid",
  WithdrawArgs
>;
export type MultiWithdrawAction = ProtocolAction<"multiwithdraw", WithdrawArgs>;

export type ApproveAction = ProtocolAction<
  "approve",
  {
    token: Address;
    spender: Address;
    amount?: AmountArg;
    tokenId?: Quantity;
  },
  "erc20" | "erc721"
>;

export type HarvestAction = ProtocolAction<
  "harvest",
  {
    token: Address;
    primaryAddress: Address;
  }
>;

export type SwapAction = ProtocolAction<
  "swap",
  WithReceiver &
    WithArgs & {
      tokenIn: Address;
      tokenOut: Address;
      amountIn: AmountArg;
      primaryAddress: Address;
      slippage?: Quantity;
      poolFee?: Quantity;
      tickSpacing?: Quantity;
      hooks?: Address;
      poolId?: BytesArg;
      salt?: BytesArg;
      path?: Address[];
    }
>;

export type TransferAction = ProtocolAction<
  "transfer",
  {
    token: Address;
    amount?: AmountArg;
    receiver: Address;
    /** ERC721/ERC1155 token ID, when transferring a tokenized position. */
    tokenId?: Quantity;
  }
>;

export type TransferFromAction = ProtocolAction<
  "transferfrom",
  {
    token: Address;
    amount?: AmountArg;
    receiver: Address;
    sender?: Address;
    /** ERC721/ERC1155 token ID, when transferring a tokenized position. */
    tokenId?: Quantity;
  }
>;

export type PermitTransferFromAction = ProtocolAction<
  "permittransferfrom",
  {
    token: Address | Address[];
    amount: AmountArg | AmountArg[];
    sender: Address;
    receiver: Address;
    nonce: Quantity;
    deadline: Quantity;
    signature: BytesArg;
  }
>;

export type BridgeProtocol =
  "ccip" | "relay" | "stargate" | "cctp" | "layerzero-teller";

export type BridgeAction = ProtocolAction<
  "bridge",
  {
    tokenIn: Address;
    amountIn: AmountArg;
    primaryAddress: Address;
    destinationChainId: number;
    receiver: Address;
    callback?: BundleAction[];
    callbackValue?: Quantity;
    protocolArgs?: {
      transferType?: "fast" | "standard";
      forwardFee?: "low" | "med" | "high";
      isHyperCoreTransfer?: boolean;
    };
  }
>;

type FlashloanArgs = WithReceiver & {
  flashloanToken: Address | Address[];
  flashloanAmount: AmountArg | AmountArg[];
  tokenOut: Address | Address[];
  primaryAddress?: Address;
  tokenIn?: Address | Address[];
  amountIn?: AmountArg | AmountArg[];
  /** ERC721 token ID(s) for tokenIn. Mutually exclusive with amountIn. */
  tokenId?: Quantity | Quantity[];
  /** Actions executed with the flashloaned funds before repayment. */
  callback: BundleAction[];
};

export type FlashloanAction = ProtocolAction<"flashloan", FlashloanArgs>;

type BaseRouteArgs = WithReceiver & {
  tokenIn: Address;
  tokenOut: Address;
  amountIn: AmountArg;
  slippage?: Quantity;
  minAmountOut?: AmountArg | AmountArg[];
  fee?: AmountArg | AmountArg[];
  feeReceiver?: Address;
  /** Destination-chain fee receiver for cross-chain routes with destination execution. */
  destinationFeeReceiver?: Address;
  ignoreAggregators?: string[];
  ignoreStandards?: string[];
  ignoreBridges?: string[];
};

type SameChainRouteArgs = BaseRouteArgs & {
  /** Destination chain ID is omitted for same-chain routes. */
  destinationChainId?: undefined;
  /** Optional refund receiver for route dust/refunds. */
  refundReceiver?: Address;
};

type CrossChainRouteArgs = BaseRouteArgs & {
  /** Destination chain ID for cross-chain routes. */
  destinationChainId: number;
  /** Destination-chain address that receives the route output. */
  receiver: Address;
  /** Optional address that receives refunded assets if a cross-chain route cannot complete. */
  refundReceiver?: Address;
};

export type RouteAction = EnsoAction<
  "route",
  SameChainRouteArgs | CrossChainRouteArgs
>;

export type BalanceAction = EnsoAction<
  "balance",
  {
    token: Address;
    estimate?: AmountArg;
    account?: Address;
  }
>;

export type ContractCallArg =
  | string
  | Address
  | Quantity
  | boolean
  | ContractCallArg[]
  | ActionOutputReference<Quantity>;

export type CallAction = ProtocolAction<
  "call",
  {
    address: Address;
    method: string;
    /** Function ABI/signature for encoding the call. */
    abi: string;
    args: ContractCallArg[];
    tokenIn?: Address;
    tokenOut?: Address;
    value?: AmountArg;
  }
>;

export type SplitAction = EnsoAction<
  "split",
  WithReceiver & {
    tokenIn: Address;
    tokenOut: Address[];
    amountIn: AmountArg;
  }
>;

export type MergeAction = EnsoAction<
  "merge",
  WithReceiver & {
    tokenIn: Address[];
    tokenOut: Address;
    amountIn: AmountArg[];
  }
>;

export type MinAmountOutAction = EnsoAction<
  "minamountout",
  {
    amountOut: AmountArg;
    minAmountOut: AmountArg;
  }
>;

export type SlippageAction = EnsoAction<
  "slippage",
  {
    bps: Quantity;
    amountOut: AmountArg;
  }
>;

export type FeeAction = EnsoAction<
  "fee",
  {
    receiver: Address;
    token: Address;
    amount: AmountArg;
    bps: Quantity;
  }
>;

export type EnsoFeeAction = EnsoAction<
  "ensofee",
  {
    token: Address;
    amount: AmountArg;
    bps: Quantity;
  }
>;

export type MathAction = ProtocolAction<
  "add" | "sub" | "mul" | "div" | "min" | "max",
  {
    amountA: AmountArg;
    amountB: AmountArg;
  },
  "math"
>;

export type ComparisonAction = ProtocolAction<
  | "isequal"
  | "islessthan"
  | "isequalorlessthan"
  | "isgreaterthan"
  | "isequalorgreaterthan",
  {
    amountA: AmountArg;
    amountB: AmountArg;
  },
  "helpers"
>;

export type NotAction = ProtocolAction<
  "not",
  {
    condition: boolean | StrictOutputReference;
  },
  "helpers"
>;

export type CheckAction = ProtocolAction<
  "check",
  {
    condition: boolean | StrictOutputReference;
  },
  "helpers"
>;

export type ToggleAction = ProtocolAction<
  "toggle",
  {
    /** Boolean value or previous boolean output selecting between amountA and amountB. */
    condition: boolean | StrictOutputReference;
    amountA: AmountArg;
    amountB: AmountArg;
  },
  "helpers"
>;

export type BundleAction =
  | RouteAction
  | SwapAction
  | BridgeAction
  | BalanceAction
  | ApproveAction
  | TransferAction
  | TransferFromAction
  | PermitTransferFromAction
  | DepositAction
  | RedeemAction
  | DepositCLMMAction
  | RedeemCLMMAction
  | TokenizedSingleDepositAction
  | TokenizedMultiDepositAction
  | TokenizedSingleRedeemAction
  | TokenizedMultiRedeemAction
  | MultiOutSingleDepositAction
  | CallAction
  | FlashloanAction
  | WithdrawAction
  | SingleWithdrawAction
  | SingleWithdrawWithPositionIdAction
  | MultiWithdrawAction
  | SplitAction
  | MergeAction
  | MinAmountOutAction
  | SlippageAction
  | FeeAction
  | EnsoFeeAction
  | RepayAction
  | BorrowAction
  | HarvestAction
  | SingleDepositAction
  | MultiDepositAction
  | SingleRedeemAction
  | MultiRedeemAction
  | MathAction
  | ComparisonAction
  | NotAction
  | CheckAction
  | ToggleAction;
