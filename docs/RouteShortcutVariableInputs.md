# RouteShortcutVariableInputs


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**chainId** | **number** | Chain ID of the network to execute the transaction on | [optional] [default to 1]
**fromAddress** | **string** | Ethereum address of the wallet to send the transaction from | [default to '0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
**routingStrategy** | **string** | Routing strategy to use | [optional] [default to undefined]
**toEoa** | **boolean** | Flag that indicates if gained tokenOut should be sent to EOA | [optional] [default to undefined]
**receiver** | **string** | Ethereum address of the receiver of the tokenOut | [optional] [default to undefined]
**spender** | **string** | Ethereum address of the spender of the tokenIn | [optional] [default to undefined]
**amountIn** | **Array&lt;string&gt;** | Amount of tokenIn to swap in wei | [default to undefined]
**minAmountOut** | **Array&lt;string&gt;** | Minimum amount out in wei. If specified, slippage should not be specified | [optional] [default to undefined]
**slippage** | **string** | Slippage in basis points (1/10000). If specified, minAmountOut should not be specified | [optional] [default to '50']
**fee** | **Array&lt;string&gt;** | Fee in basis points (1/10000) for each amountIn value. Must be in range 0-100. If specified, this percentage of each amountIn value will be sent to feeReceiver | [optional] [default to undefined]
**feeReceiver** | **string** | The Ethereum address that will receive the collected fee. Required if fee is provided | [optional] [default to undefined]
**ignoreAggregators** | **Array&lt;string&gt;** | A list of swap aggregators to be ignored from consideration | [optional] [default to undefined]
**ignoreStandards** | **Array&lt;string&gt;** | A list of standards to be ignored from consideration | [optional] [default to undefined]
**referralCode** | **string** | Referral code that will be included in an on-chain event. | [optional] [default to undefined]
**tokenIn** | **Array&lt;string&gt;** | Ethereum address of the token to swap from. For ETH, use 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee | [default to undefined]
**tokenOut** | **Array&lt;string&gt;** | Ethereum address of the token to swap to. For ETH, use 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee | [default to undefined]
**destinationChainId** | **number** | Chain ID of the network to bridge to and receive tokenOut | [optional] [default to undefined]
**variableEstimates** | **object** |  | [default to undefined]

## Example

```typescript
import { RouteShortcutVariableInputs } from '@ensobuild/shortcuts-sdk';

const instance: RouteShortcutVariableInputs = {
    chainId,
    fromAddress,
    routingStrategy,
    toEoa,
    receiver,
    spender,
    amountIn,
    minAmountOut,
    slippage,
    fee,
    feeReceiver,
    ignoreAggregators,
    ignoreStandards,
    referralCode,
    tokenIn,
    tokenOut,
    destinationChainId,
    variableEstimates,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
