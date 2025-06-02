# IporShortcutInput


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**isRouter** | **boolean** | Flag that indicates whether to use the shared router | [optional] [default to undefined]
**amountIn** | **string** | Amount of tokenIn in wei | [default to undefined]
**tokenIn** | **string** | Address of the tokenIn. For ETH, use 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee | [default to undefined]
**tokenBToBuy** | **string** | Address of the tokenBToBuy | [default to undefined]
**percentageForTokenB** | **string** | Percentage of tokenB to buy in basis points (1/10000) | [default to undefined]
**slippage** | **string** | Slippage in basis points (1/10000). Default is 300 | [optional] [default to '300']
**simulate** | **boolean** | Flag that indicates whether to simulate the transaction, verify some assertions, return simulationURL and events | [optional] [default to false]

## Example

```typescript
import { IporShortcutInput } from './api';

const instance: IporShortcutInput = {
    isRouter,
    amountIn,
    tokenIn,
    tokenBToBuy,
    percentageForTokenB,
    slippage,
    simulate,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
