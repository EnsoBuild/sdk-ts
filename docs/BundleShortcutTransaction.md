# BundleShortcutTransaction


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**bundle** | [**Array&lt;ActionToBundle&gt;**](ActionToBundle.md) |  | [default to undefined]
**gas** | **string** |  | [default to undefined]
**amountsOut** | **object** |  | [default to undefined]
**route** | [**Array&lt;Hop&gt;**](Hop.md) | The route the shortcut will use | [optional] [default to undefined]
**createdAt** | **number** | Block number the transaction was created on | [default to undefined]
**tx** | [**Transaction**](Transaction.md) | The tx object to use in &#x60;ethers&#x60; | [default to undefined]

## Example

```typescript
import { BundleShortcutTransaction } from './api';

const instance: BundleShortcutTransaction = {
    bundle,
    gas,
    amountsOut,
    route,
    createdAt,
    tx,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
