# WalletApproveTransaction


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tx** | **object** | The tx object to use in &#x60;ethers&#x60; | [default to undefined]
**gas** | **string** | The gas estimate for the transaction | [default to undefined]
**token** | **string** | The token address to approve | [default to undefined]
**amount** | **string** | The amount of tokens to approve | [default to undefined]
**spender** | **string** | The spender address to approve | [default to undefined]

## Example

```typescript
import { WalletApproveTransaction } from '@ensobuild/shortcuts-sdk';

const instance: WalletApproveTransaction = {
    tx,
    gas,
    token,
    amount,
    spender,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
