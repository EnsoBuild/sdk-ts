# NonTokenizedModel


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**chainId** | **number** | Chain ID of the network of the nontokenized position | [default to undefined]
**protocol** | **string** | The specific standard integration or version of the nontokenized position | [default to undefined]
**address** | **string** | Ethereum address of the nontokenized position | [default to undefined]
**primaryAddress** | **string** | Ethereum address of the nontokenized position | [default to undefined]
**underlyingTokens** | [**Array&lt;TokenModel&gt;**](TokenModel.md) | Underlying tokens of nontokenized position | [default to undefined]

## Example

```typescript
import { NonTokenizedModel } from '@ensobuild/shortcuts-sdk';

const instance: NonTokenizedModel = {
    chainId,
    protocol,
    address,
    primaryAddress,
    underlyingTokens,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
