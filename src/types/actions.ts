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

type WithPositionId = {
  positionId: BytesArg;
};

type WithOptionalPositionId = {
  positionId?: BytesArg;
};

type WithTokenId = {
  tokenId: Quantity;
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

type SingleTokenOutAmount = {
  tokenOut: Address;
  amountOut: AmountArg;
};

type MultiTokenOutAmount = {
  tokenOut: Address[];
  amountOut: AmountArg[];
};

type SingleFlashloanAmount = {
  flashloanToken: Address;
  flashloanAmount: AmountArg;
};

type MultiFlashloanAmount = {
  flashloanToken: Address[];
  flashloanAmount: AmountArg[];
};

type BorrowArgs = WithReceiver &
  WithOnBehalfOf &
  WithArgs & {
    collateral?: Address | Address[];
    tokenOut: Address;
    amountOut: AmountArg;
    primaryAddress: Address;
  };

export type BorrowAction = ProtocolAction<"borrow", BorrowArgs>;
export type BorrowWithPositionIdAction = ProtocolAction<
  "borrowwithpositionid",
  BorrowArgs & WithOptionalPositionId
>;
export type NftBorrowAction = ProtocolAction<
  "nftborrow",
  BorrowArgs & WithTokenId
>;

type DepositArgs = WithReceiver &
  WithOnBehalfOf &
  WithArgs & {
    tokenIn: Address | Address[];
    tokenOut?: Address | Address[];
    amountIn: AmountArg | AmountArg[];
    primaryAddress: Address;
  };

type SingleDepositArgs = Omit<DepositArgs, "tokenIn" | "amountIn"> &
  SingleTokenInAmount;

type MultiDepositArgs = Omit<DepositArgs, "tokenIn" | "amountIn"> &
  MultiTokenInAmount;

export type DepositAction = ProtocolAction<"deposit", DepositArgs>;
export type SingleDepositAction = ProtocolAction<
  "singledeposit",
  SingleDepositArgs
>;
export type SingleDepositWithPositionIdAction = ProtocolAction<
  "singledepositwithpositionid",
  SingleDepositArgs & WithPositionId
>;
export type MultiDepositAction = ProtocolAction<
  "multideposit",
  MultiDepositArgs
>;
export type MultiDepositWithPositionIdAction = ProtocolAction<
  "multidepositwithpositionid",
  MultiDepositArgs & WithPositionId
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
export type NftDepositAction = ProtocolAction<
  "nftdeposit",
  SingleDepositArgs & WithOptionalTokenId
>;
export type NftMultiDepositAction = ProtocolAction<
  "nftmultideposit",
  MultiDepositArgs & WithOptionalTokenId
>;

export type DepositCLMMAction = ProtocolAction<
  "depositclmm",
  Omit<NftMultiDepositAction["args"], "tokenOut" | "primaryAddress"> & {
    tokenOut: Address;
    primaryAddress?: Address;
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
  WithArgs & {
    tokenIn?: Address;
    tokenOut: Address | Address[];
    amountIn: AmountArg;
    primaryAddress: Address;
  };

type SingleRedeemArgs = Omit<RedeemArgs, "tokenOut"> & {
  tokenOut: Address;
};

type MultiRedeemArgs = Omit<RedeemArgs, "tokenOut"> & {
  tokenOut: Address[];
};

export type RedeemAction = ProtocolAction<"redeem", RedeemArgs>;
export type SingleRedeemAction = ProtocolAction<
  "singleredeem",
  SingleRedeemArgs
>;
export type SingleRedeemWithPositionIdAction = ProtocolAction<
  "singleredeemwithpositionid",
  SingleRedeemArgs & WithPositionId
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
export type NftRedeemAction = ProtocolAction<
  "nftredeem",
  SingleRedeemArgs & WithTokenId
>;
export type NftMultiRedeemAction = ProtocolAction<
  "nftmultiredeem",
  MultiRedeemArgs & WithTokenId
>;

export type RedeemCLMMAction = ProtocolAction<
  "redeemclmm",
  Omit<
    NftMultiRedeemAction["args"],
    "tokenIn" | "amountIn" | "primaryAddress"
  > & {
    tokenIn: Address;
    /** Amount of position liquidity to redeem. Defaults from liquidity in standards that support it. */
    amountIn?: AmountArg;
    /** Position manager or pool address. Defaults from tokenIn in standards that support it. */
    primaryAddress?: Address;
    /** Liquidity amount to remove from the CLMM position. */
    liquidity: AmountArg;
  }
>;

type RepayArgs = WithOnBehalfOf &
  WithArgs & {
    tokenIn: Address;
    amountIn: AmountArg;
    primaryAddress: Address;
  };

export type RepayAction = ProtocolAction<"repay", RepayArgs>;
export type RepayWithPositionIdAction = ProtocolAction<
  "repaywithpositionid",
  RepayArgs & WithOptionalPositionId
>;
export type NftRepayAction = ProtocolAction<
  "nftrepay",
  RepayArgs & WithTokenId
>;

type WithdrawArgs = WithReceiver &
  WithOnBehalfOf &
  WithArgs & {
    tokenOut: Address | Address[];
    amountOut: AmountArg | AmountArg[];
    primaryAddress: Address;
  };

type SingleWithdrawArgs = Omit<WithdrawArgs, "tokenOut" | "amountOut"> &
  SingleTokenOutAmount;

type MultiWithdrawArgs = Omit<WithdrawArgs, "tokenOut" | "amountOut"> &
  MultiTokenOutAmount;

export type WithdrawAction = ProtocolAction<"withdraw", WithdrawArgs>;
export type SingleWithdrawAction = ProtocolAction<
  "singlewithdraw",
  SingleWithdrawArgs
>;
export type SingleWithdrawWithPositionIdAction = ProtocolAction<
  "singlewithdrawwithpositionid",
  SingleWithdrawArgs & WithPositionId
>;
export type MultiWithdrawAction = ProtocolAction<
  "multiwithdraw",
  MultiWithdrawArgs
>;

export type ApproveAction = ProtocolAction<
  "approve",
  {
    token: Address;
    spender: Address;
    amount: AmountArg;
  }
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
  WithReceiver & {
    tokenIn: Address;
    tokenOut: Address;
    amountIn: AmountArg;
    primaryAddress: Address;
    slippage?: Quantity;
    poolFee?: Quantity;
    tickSpacing?: Quantity;
    hooks?: Address;
    poolId?: BytesArg;
    path?: Address[];
  }
>;

export type TransferAction = ProtocolAction<
  "transfer",
  {
    token: Address;
    amount: AmountArg;
    receiver: Address;
    /** ERC721/ERC1155 token ID, when transferring a tokenized position. */
    id?: Quantity;
  }
>;

export type TransferFromAction = ProtocolAction<
  "transferfrom",
  {
    token: Address;
    amount: AmountArg;
    receiver: Address;
    sender: Address;
    /** ERC721/ERC1155 token ID, when transferring a tokenized position. */
    id?: Quantity;
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

export type BridgeProtocol = "ccip" | "relay" | "stargate" | "cctp";

type BaseBridgeArgs = {
  tokenIn: Address;
  amountIn: AmountArg;
  primaryAddress: Address;
  destinationChainId: number;
  receiver: Address;
  callback?: BundleAction[];
};

type NonCctpBridgeArgs = BaseBridgeArgs & {
  cctpTransferType?: never;
  cctpForwardFee?: never;
};

type CctpBridgeArgs = BaseBridgeArgs & {
  /** CCTP finality preference. */
  cctpTransferType?: "fast" | "standard";
  /** CCTP Forwarding Service fee bracket. */
  cctpForwardFee?: "low" | "med" | "high";
};

export type NonCctpBridgeAction = ProtocolAction<
  "bridge",
  NonCctpBridgeArgs,
  Exclude<BridgeProtocol, "cctp">
>;
export type CctpBridgeAction = ProtocolAction<"bridge", CctpBridgeArgs, "cctp">;
export type BridgeAction = NonCctpBridgeAction | CctpBridgeAction;

type FlashloanArgs = WithReceiver & {
  flashloanToken: Address | Address[];
  flashloanAmount: AmountArg | AmountArg[];
  tokenOut?: Address | Address[];
  primaryAddress?: Address;
  tokenIn?: Address[];
  amountIn?: AmountArg[];
  /** Actions executed with the flashloaned funds before repayment. */
  callback: BundleAction[];
};

export type FlashloanAction = ProtocolAction<"flashloan", FlashloanArgs>;
export type SingleTokenFlashloanAction = ProtocolAction<
  "singletokenflashloan",
  Omit<FlashloanArgs, "flashloanToken" | "flashloanAmount"> &
    SingleFlashloanAmount
>;
export type MultiTokenFlashloanAction = ProtocolAction<
  "multitokenflashloan",
  Omit<FlashloanArgs, "flashloanToken" | "flashloanAmount"> &
    MultiFlashloanAmount
>;

type BaseRouteArgs = WithReceiver & {
  tokenIn: Address;
  tokenOut: Address;
  amountIn: AmountArg;
  slippage?: Quantity;
  minAmountOut?: AmountArg | AmountArg[];
  fee?: Quantity | Quantity[];
  feeReceiver?: Address;
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

export type CallAction = EnsoAction<
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

export type MathAction = EnsoAction<
  "add" | "sub" | "mul" | "div" | "min" | "max",
  {
    amountA: AmountArg;
    amountB: AmountArg;
  }
>;

export type ComparisonAction = EnsoAction<
  | "isequal"
  | "islessthan"
  | "isequalorlessthan"
  | "isgreaterthan"
  | "isequalorgreaterthan",
  {
    amountA: AmountArg;
    amountB: AmountArg;
  }
>;

export type NotAction = EnsoAction<
  "not",
  {
    condition: boolean | StrictOutputReference;
  }
>;

export type CheckAction = EnsoAction<
  "check",
  {
    condition: boolean | StrictOutputReference;
  }
>;

export type ToggleAction = EnsoAction<
  "toggle",
  {
    /** Boolean value or previous boolean output selecting between amountA and amountB. */
    condition: boolean | StrictOutputReference;
    amountA: AmountArg;
    amountB: AmountArg;
  }
>;

export type BundleAction =
  | ApproveAction
  | BorrowAction
  | BorrowWithPositionIdAction
  | NftBorrowAction
  | BridgeAction
  | DepositAction
  | SingleDepositAction
  | SingleDepositWithPositionIdAction
  | MultiDepositAction
  | MultiDepositWithPositionIdAction
  | TokenizedSingleDepositAction
  | TokenizedMultiDepositAction
  | MultiOutSingleDepositAction
  | DepositCLMMAction
  | NftDepositAction
  | NftMultiDepositAction
  | FlashloanAction
  | SingleTokenFlashloanAction
  | MultiTokenFlashloanAction
  | HarvestAction
  | PermitTransferFromAction
  | RedeemAction
  | SingleRedeemAction
  | SingleRedeemWithPositionIdAction
  | MultiRedeemAction
  | TokenizedSingleRedeemAction
  | TokenizedMultiRedeemAction
  | RedeemCLMMAction
  | NftRedeemAction
  | NftMultiRedeemAction
  | RepayAction
  | RepayWithPositionIdAction
  | NftRepayAction
  | SwapAction
  | TransferAction
  | TransferFromAction
  | WithdrawAction
  | SingleWithdrawAction
  | SingleWithdrawWithPositionIdAction
  | MultiWithdrawAction
  | RouteAction
  | BalanceAction
  | CallAction
  | SplitAction
  | MergeAction
  | MinAmountOutAction
  | SlippageAction
  | FeeAction
  | EnsoFeeAction
  | MathAction
  | ComparisonAction
  | NotAction
  | CheckAction
  | ToggleAction;
