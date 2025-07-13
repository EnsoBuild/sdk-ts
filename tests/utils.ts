import { RouteParams } from "../src";

export function constructHappyPathLink(params: RouteParams): string {
  const baseUrl = "https://happypath.enso.build/";
  const urlParams = new URLSearchParams();

  // Core required parameters
  urlParams.set("chainId", params.chainId.toString());
  urlParams.set("tokenIn", params.tokenIn[0]); // Use first token for multi-token inputs
  urlParams.set("tokenOut", params.tokenOut[0]); // Use first token for multi-token outputs

  // Destination chain for cross-chain operations
  if (params.destinationChainId) {
    urlParams.set("outChainId", params.destinationChainId.toString());
  } else {
    urlParams.set("outChainId", params.chainId.toString()); // Same chain if not cross-chain
  }

  // Optional parameters that affect routing
  if (params.slippage) {
    urlParams.set("slippage", params.slippage.toString());
  }

  if (params.fromAddress) {
    urlParams.set("fromAddress", params.fromAddress);
  }

  if (params.receiver && params.receiver !== params.fromAddress) {
    urlParams.set("receiver", params.receiver);
  }

  if (params.routingStrategy && params.routingStrategy !== "delegate") {
    urlParams.set("routingStrategy", params.routingStrategy);
  }

  if (params.referralCode) {
    urlParams.set("referralCode", params.referralCode);
  }

  // Amount parameters
  if (params.amountIn && params.amountIn.length > 0) {
    urlParams.set("amountIn", params.amountIn[0].toString());
  }

  if (params.minAmountOut && params.minAmountOut.length > 0) {
    urlParams.set("minAmountOut", params.minAmountOut[0].toString());
  }

  // Advanced parameters
  if (params.fee && params.fee.length > 0) {
    urlParams.set("fee", params.fee[0].toString());
  }

  if (params.feeReceiver) {
    urlParams.set("feeReceiver", params.feeReceiver);
  }

  if (params.ignoreAggregators && params.ignoreAggregators.length > 0) {
    urlParams.set("ignoreAggregators", params.ignoreAggregators.join(","));
  }

  if (params.ignoreStandards && params.ignoreStandards.length > 0) {
    urlParams.set("ignoreStandards", params.ignoreStandards.join(","));
  }

  const url = `${baseUrl}?${urlParams.toString()}`;
  console.log(expect.getState().currentTestName, url);
  return url;
}
