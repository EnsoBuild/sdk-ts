# RouteShortcutTransaction


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**gas** | **string** |  | [default to undefined]
**amountOut** | **string** |  | [default to undefined]
**priceImpact** | **number** | Price impact in basis points, null if USD price not found | [default to undefined]
**feeAmount** | **Array&lt;string&gt;** | An array of the fee amount collected for each tokenIn | [default to undefined]
**createdAt** | **number** | Block number the transaction was created on | [default to undefined]
**tx** | [**Transaction**](Transaction.md) | The tx object to use in &#x60;ethers&#x60; | [default to undefined]
**route** | [**Array&lt;Hop&gt;**](Hop.md) | The route the shortcut will use | [default to undefined]

## Example

```typescript
import { RouteShortcutTransaction } from './api';

const instance: RouteShortcutTransaction = {
    gas,
    amountOut,
    priceImpact,
    feeAmount,
    createdAt,
    tx,
    route,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
